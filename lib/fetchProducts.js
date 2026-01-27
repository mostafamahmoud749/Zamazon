export async function fetchProducts(url) {
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;

    return await res.json();
  } catch {
    return null;
  }
}
