# Server load tests

These k6 scripts exercise the Express API directly. They do not measure browser
rendering, images, or Next.js page performance. Keep the test code in this repo;
run it from another machine when measuring deployment capacity.

## Install and start

Install the standalone [k6 executable](https://grafana.com/docs/k6/latest/set-up/install-k6/)
and confirm `k6 version` works. k6 is not an npm package and does not run in Node.js.

Start your backend normally, then run a one-user, one-iteration smoke test:

```bash
# Terminal 1
npm run backend

# Terminal 2
npm run test:load
```

The browsing test discovers active products and categories from the API. Add
representative products and reviews to your test database first. If needed,
`npm run seed:products` adds demo products to whichever database your environment
points to. No products is a setup error rather than a misleading empty test.

## Measure increasing load

The API normally allows 300 requests per IP per 15 minutes. All virtual users
on one load-generator machine share that quota. A capacity test needs a higher
quota on its test server:

```bash
# Start/restart a backend connected to a separate test database.
API_RATE_LIMIT_MAX=1000000 npm run backend

# Run in another terminal.
PROFILE=load npm run test:load
```

This is an explicit server setting, not a bypass header. Without it, the default
limit stays 300. The scripts count 429s as failures and abort after detecting
rate limiting; a 429 measures the configured quota, not server capacity. Restart
the backend between independent local runs to reset the in-memory quota.

| Profile           | Workload                                                    |
| ----------------- | ----------------------------------------------------------- |
| `smoke` (default) | 1 virtual user, 1 complete journey                          |
| `constant`        | 5 users for 30 seconds; configure with `VUS` and `DURATION` |
| `load`            | Ramp to 10, 25, then 50 users, with holds; 7 minutes total  |
| `stress`          | Ramp to 10, 50, then 100 users, with holds; 7 minutes total |

You can also set a custom constant load:

```bash
PROFILE=constant VUS=5 DURATION=30s npm run test:load
BASE_URL=https://your-test-api.example.com PROFILE=load npm run test:load
```

`BASE_URL` is the API origin, without `/api`. It defaults to
`http://localhost:9000`. k6 does not automatically load the project's `.env`.

## Authenticated reads

Use existing, dedicated test accounts. Each VU has its own cookie jar, logs in
once, and fetches a fresh CSRF token after Passport regenerates its session.
Cookies persist between iterations. Passwords and response bodies are not logged.

For a one-user smoke test:

```bash
TEST_EMAIL=your-test-email TEST_PASSWORD=your-test-password npm run test:load:auth
```

For multiple users, copy `accounts.example.json` to `accounts.local.json` in
this folder and replace the entries with real test credentials. Supply at least
one distinct account per VU: 50 for `load`, 100 for `stress`. An insufficient
account pool or failed login aborts the run. The local file is gitignored.

```bash
ACCOUNTS_FILE=./accounts.local.json PROFILE=load npm run test:load:auth
```

`ACCOUNTS_FILE` is resolved relative to the test script by k6. The examples
assume the file lives in `tests/load/`. You may also use an absolute path.
The failed-login limit remains enabled; correct credentials are required.

## Write journeys

Use a disposable database and test accounts with empty carts. Writes are
separate from the default browsing and authenticated-read scripts:

```bash
ALLOW_WRITES=true ACCOUNTS_FILE=./accounts.local.json npm run test:load:writes
ALLOW_WRITES=true ACCOUNTS_FILE=./accounts.local.json PROFILE=load npm run test:load:writes
```

Each iteration creates its own product, review, address, and cart item, updates
them, then deletes the review, cart item, and address and deactivates the product.
The API soft-deletes products, so inactive product records remain. Cleanup runs
in `finally` and targets only IDs created by that iteration. A stopped process,
server failure, or rejected cleanup request can leave fixtures behind. Reset
the disposable database between comparable runs.

Checkout is an additional option:

```bash
ALLOW_WRITES=true CHECKOUT=true ACCOUNTS_FILE=./accounts.local.json npm run test:load:writes
```

It adds the generated product to the empty cart, creates an order with an
idempotency key, verifies a replay returns the same order, reads it, and cancels
it to restore stock. Canceled orders and their referenced addresses remain
because the API has no order-delete endpoint. The test uses the application's
existing order service; it does not call a payment gateway.

## Endpoint coverage

| Script             | Endpoints                                                                                                                                                             |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `browse.js`        | Product listing, pagination, search, rating and category filters, cumulative pagination; product detail and reviews; category listing, lookup, ancestors and children |
| `authenticated.js` | CSRF token, login, current user, cart list, address list, order list and order detail when orders exist                                                               |
| `writes.js`        | CSRF token and login; product, review, address and cart create/update/delete; optional order create/replay/read/cancel                                                |

Review lists and category children legitimately return 404 when empty; these
two cases are expected responses. Other unexpected 4xx/5xx responses fail the
test. Missing optional data skips category-specific or existing-order requests.
The browsing smoke test samples the first product; further iterations rotate
through the first 20 discovered products. Seed representative reviews to exercise
rating aggregation at realistic volumes.

Registration, logout, GitHub OAuth, and image signatures are not included in
these journeys. Registration would accumulate users, logout would end the
session reused for browsing, OAuth needs a separate external-provider flow,
and signatures have a separate 30/hour/user quota. No files are uploaded.

## Results

The default pass criteria are fewer than 1% HTTP failures, more than 99% passing
response checks, and p95 response time below 1000 ms. Named endpoint thresholds
show individual response times for the main endpoints; all requests contribute
to overall metrics. These are starting targets, not a promised capacity.

```bash
P95_MS=500 THINK_TIME=2 PROFILE=load npm run test:load
```

`THINK_TIME` controls pauses between actions, defaulting to 1 second. A virtual
user repeatedly performs the script's journey, so 50 VUs does not mean 50 requests
per second or 50 total registered users. Report the journey and pauses with any
capacity result. Smoke tests check that the journey works; they do not establish
capacity or statistically useful percentiles.

For live charts and an HTML report:

```bash
mkdir -p tests/load/results
K6_WEB_DASHBOARD=true K6_WEB_DASHBOARD_EXPORT=tests/load/results/browse.html PROFILE=load npm run test:load
```

Open `http://localhost:5665` while the test runs. Close the dashboard tab when
finished so k6 can exit. Reports are gitignored. See the
[k6 dashboard documentation](https://grafana.com/docs/k6/latest/results-output/web-dashboard/).

Watch backend/database CPU, memory, query time, and database connections alongside
k6's p95/p99, request rate, errors, and checks. Compare stages while load is held
steady. Use production-sized data and comparable deployment settings; tests on
your laptop do not establish Vercel capacity. No capacity claim can be made until
these tests run against the intended deployment.
