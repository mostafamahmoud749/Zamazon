export async function fetchProducts<T = unknown>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { next: { revalidate: 600 } }); // cache for 10 minutes
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}
