export async function fetchCategories(url: string): Promise<string[]> {
  try {
    const res = await fetch(url, { next: { revalidate: 600 } }); // cache for 10 minutes
    if (!res.ok) return [];

    const data: unknown = await res.json();


    // DummyJSON categories: [{ slug, name, url }]
    if (
      Array.isArray(data) &&
      data.length > 0 &&
      typeof data[0] === 'object' &&
      data[0] !== null &&
      'name' in data[0]
    ) {
      return data.map((c: { name: string }) => c.name);
    }

    // Plain string array (original fakestoreapi format)
    return Array.isArray(data) && data.every((x) => typeof x === 'string') ? data : [];
  } catch {
    return [];
  }
}
