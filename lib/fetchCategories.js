export async function fetchCategories(url) {
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return [];

    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}
