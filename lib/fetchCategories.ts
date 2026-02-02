export async function fetchCategories(url: string): Promise<string[]> {
  try {
    const res = await fetch(url, { next: { revalidate: 600 } }); // cache for 10 minutes
    if (!res.ok) return [];

    const data: unknown = await res.json();
    return Array.isArray(data) && data.every((x) => typeof x === 'string') ? data : [];
  } catch {
    return [];
  }
}
