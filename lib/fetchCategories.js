export async function fetchCategories(url) {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch categories');
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}
