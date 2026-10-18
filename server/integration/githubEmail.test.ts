import { afterEach, describe, expect, it, vi } from 'vitest';
import { getVerifiedGitHubEmail } from '../services/githubEmail.js';

afterEach(() => vi.unstubAllGlobals());

describe('getVerifiedGitHubEmail', () => {
  it('authenticates using a header and prefers the verified primary email', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      Response.json([
        { email: 'unverified@example.com', primary: true, verified: false },
        { email: 'other@example.com', primary: false, verified: true },
        { email: 'primary@example.com', primary: true, verified: true },
      ]),
    );
    vi.stubGlobal('fetch', fetchMock);

    expect(await getVerifiedGitHubEmail('test-token')).toBe('primary@example.com');
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.github.com/user/emails?per_page=100',
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer test-token' }),
      }),
    );
  });

  it('uses a verified secondary email when the primary is unverified', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        Response.json([
          { email: 'primary@example.com', primary: true, verified: false },
          { email: 'verified@example.com', primary: false, verified: true },
        ]),
      ),
    );

    expect(await getVerifiedGitHubEmail('test-token')).toBe('verified@example.com');
  });

  it('returns no email when none are verified', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue(
          Response.json([{ email: 'unverified@example.com', primary: true, verified: false }]),
        ),
    );

    expect(await getVerifiedGitHubEmail('test-token')).toBeUndefined();
  });

  it('reports failed requests without exposing the upstream response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response('sensitive upstream response', { status: 403 })),
    );

    await expect(getVerifiedGitHubEmail('test-token')).rejects.toMatchObject({
      message: 'GitHub email lookup failed',
      code: 'GITHUB_EMAIL_HTTP_403',
    });
  });
});
