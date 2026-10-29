import http from 'k6/http';
import { check, sleep } from 'k6';
import exec from 'k6/execution';
import { Rate } from 'k6/metrics';
import { SharedArray } from 'k6/data';

export const baseUrl = (__ENV.BASE_URL || 'http://localhost:9000').replace(/\/+$/, '');
const rateLimited = new Rate('rate_limited');
const profile = __ENV.PROFILE || 'smoke';
const profiles = {
  smoke: { vus: 1, iterations: 1 },
  constant: { vus: Number(__ENV.VUS || 5), duration: __ENV.DURATION || '30s' },
  load: {
    stages: [
      { duration: '30s', target: 10 },
      { duration: '1m', target: 10 },
      { duration: '30s', target: 25 },
      { duration: '2m', target: 25 },
      { duration: '30s', target: 50 },
      { duration: '2m', target: 50 },
      { duration: '30s', target: 0 },
    ],
  },
  stress: {
    stages: [
      { duration: '30s', target: 10 },
      { duration: '1m', target: 10 },
      { duration: '30s', target: 50 },
      { duration: '2m', target: 50 },
      { duration: '30s', target: 100 },
      { duration: '2m', target: 100 },
      { duration: '30s', target: 0 },
    ],
  },
};

if (!profiles[profile]) throw new Error('PROFILE must be smoke, constant, load, or stress');
if (!Number.isSafeInteger(profiles.constant.vus) || profiles.constant.vus < 1) {
  throw new Error('VUS must be a positive integer');
}
const p95 = Number(__ENV.P95_MS || 1000);
const thinkTime = Number(__ENV.THINK_TIME || 1);
if (!Number.isFinite(p95) || p95 <= 0) throw new Error('P95_MS must be positive');
if (!Number.isFinite(thinkTime) || thinkTime < 0) throw new Error('THINK_TIME must be nonnegative');

export function optionsFor(endpoints) {
  const thresholds = {
    http_req_failed: ['rate<0.01'],
    checks: ['rate>0.99'],
    http_req_duration: [`p(95)<${p95}`],
    rate_limited: [{ threshold: 'rate==0', abortOnFail: true, delayAbortEval: '5s' }],
  };
  for (const endpoint of endpoints) {
    thresholds[`http_req_duration{name:${endpoint}}`] = [`p(95)<${p95}`];
    thresholds[`http_req_failed{name:${endpoint}}`] = ['rate<0.01'];
  }
  return {
    ...profiles[profile],
    thresholds,
    noCookiesReset: true,
    summaryTrendStats: ['avg', 'med', 'p(90)', 'p(95)', 'p(99)', 'max'],
  };
}

export function pause() {
  sleep(thinkTime);
}

// Stable metric names prevent every product ID from becoming a separate series.
export function request(method, path, name, body, token, statuses = [200], extraHeaders = {}) {
  const response = http.request(
    method,
    `${baseUrl}${path}`,
    body === undefined ? null : JSON.stringify(body),
    {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'X-CSRF-Token': token } : {}),
        ...extraHeaders,
      },
      tags: { name },
      timeout: '15s',
      redirects: 0,
      responseCallback: http.expectedStatuses(...statuses),
    },
  );
  rateLimited.add(response.status === 429);
  check(response, { [`${name}: expected status`]: (res) => statuses.includes(res.status) });
  return response;
}

export function json(response, name, validate) {
  let value;
  try {
    value = response.json();
  } catch {
    // Count malformed responses as failed checks instead of silently skipping them.
  }
  check(value, { [`${name}: valid response body`]: (body) => validate(body) });
  return value;
}

export function must(response, status, operation) {
  if (response.status !== status) {
    throw new Error(`${operation} failed with HTTP ${response.status}; check server logs`);
  }
  if (status === 201) {
    const body = json(
      response,
      operation,
      (value) => Number.isSafeInteger(value?.id) && value.id > 0,
    );
    if (!body?.id) throw new Error(`${operation} did not return a resource ID`);
  }
  return response;
}

export function accounts() {
  const values = new SharedArray('load-test-accounts', () => {
    if (__ENV.ACCOUNTS_FILE) return JSON.parse(open(__ENV.ACCOUNTS_FILE));
    if (__ENV.TEST_EMAIL && __ENV.TEST_PASSWORD) {
      return [{ email: __ENV.TEST_EMAIL, password: __ENV.TEST_PASSWORD }];
    }
    throw new Error('Set ACCOUNTS_FILE or TEST_EMAIL and TEST_PASSWORD for authenticated tests');
  });
  const entries = Array.from(values);
  if (!entries.length || entries.some((account) => !account.email || !account.password)) {
    throw new Error('Accounts must be a nonempty JSON array of { email, password }');
  }
  if (new Set(entries.map((account) => account.email)).size !== values.length) {
    throw new Error('Each load-test account must have a different email');
  }
  return values;
}

export function csrfToken() {
  const response = must(request('GET', '/api/auth/csrf-token', 'auth.csrf'), 200, 'Get CSRF token');
  const body = json(response, 'auth.csrf', (value) => typeof value?.csrfToken === 'string');
  if (!body?.csrfToken) throw new Error('Server did not return a CSRF token');
  return body.csrfToken;
}

let sessionToken;
export function login(users) {
  if (sessionToken) return sessionToken;
  const account = users[exec.vu.idInTest - 1];
  if (!account) exec.test.abort('Provide at least one distinct test account per virtual user');
  const token = csrfToken();
  const response = request(
    'POST',
    '/api/auth/login',
    'auth.login',
    {
      email: account.email,
      password: account.password,
    },
    token,
  );
  if (response.status !== 200)
    exec.test.abort(`Login failed with HTTP ${response.status}; verify test credentials`);
  // Passport regenerates the session during login, invalidating the original token.
  sessionToken = csrfToken();
  return sessionToken;
}
