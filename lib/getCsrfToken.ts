export async function getCsrfToken(): Promise<string> {
  const response = await fetch(`${process.env.API_URL}/api/auth/csrf-token`, {
    credentials: 'include',
    cache: 'no-store',
  });

  if (!response.ok) throw new Error('Could not get CSRF token');

  const { csrfToken } = await response.json();
  return csrfToken;
}
