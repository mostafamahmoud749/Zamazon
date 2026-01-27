export async function fetchProducts(url) {
  try {
    const shouldLog = process.env.NODE_ENV === 'production';
    const res = await fetch(url, { next: { revalidate: 600 } }); // cache for 10 minutes
    if (!res.ok) {
      if (shouldLog) console.warn('fetchProducts non-OK response', { url, status: res.status });
      return null;
    }
    return await res.json();
  } catch (err) {
    if (process.env.NODE_ENV === 'production') {
      console.error('fetchProducts failed', { url, error: String(err) });
    }
    return null;
  }
}
