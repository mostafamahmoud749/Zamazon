export async function fetchCategories(url) {
  try {
    const shouldLog = process.env.NODE_ENV === 'production';
    const res = await fetch(url, { next: { revalidate: 600 } }); // cache for 10 minutes
    if (!res.ok) {
      if (shouldLog) console.warn('fetchCategories non-OK response', { url, status: res.status });
      return [];
    }
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    if (process.env.NODE_ENV === 'production') {
      console.error('fetchCategories failed', { url, error: String(err) });
    }
    return [];
  }
}
