export async function fetchProducts(url) {
  try {
    const res = await fetch(url, { next: { revalidate: 600 } }); // cache for 10 minutes
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
