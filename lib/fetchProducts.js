export async function fetchProducts(url) {
  const res = await fetch(url, { 
    cache: "no-store" 
  });
  // if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}