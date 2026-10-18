type GitHubEmail = {
  email: string;
  primary: boolean;
  verified: boolean;
};

export async function getVerifiedGitHubEmail(accessToken: string): Promise<string | undefined> {
  const response = await fetch('https://api.github.com/user/emails?per_page=100', {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${accessToken}`,
      'User-Agent': 'Zamazon',
    },
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    throw Object.assign(new Error('GitHub email lookup failed'), {
      code: `GITHUB_EMAIL_HTTP_${response.status}`,
    });
  }

  const emails: GitHubEmail[] = await response.json();
  return (
    emails.find((email) => email.verified && email.primary) ??
    emails.find((email) => email.verified)
  )?.email;
}
