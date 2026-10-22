import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { GET } from './route';
import { fetchProducts } from '@/lib/fetchProducts';

vi.mock('@/lib/fetchProducts', () => ({ fetchProducts: vi.fn() }));

describe('products proxy pagination mode', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubEnv('API_URL', 'https://api.example.com');
    vi.mocked(fetchProducts).mockResolvedValue([]);
  });

  it.each([
    ['&cumulative=true', 'true'],
    ['&cumulative=false', 'false'],
    ['', 'false'],
  ])('forwards the correct pagination mode for %s', async (suffix, cumulative) => {
    const request = new NextRequest(
      `https://shop.example.com/api/products?page=3&search=phone${suffix}`,
    );
    const response = await GET(request);

    expect(response.status).toBe(200);
    expect(fetchProducts).toHaveBeenCalledTimes(1);
    const [url, signal] = vi.mocked(fetchProducts).mock.calls[0];
    const params = new URL(url).searchParams;
    expect(params.get('page')).toBe('3');
    expect(params.get('search')).toBe('phone');
    expect(params.get('cumulative')).toBe(cumulative);
    expect(signal).toBe(request.signal);
  });

  it('rejects invalid cumulative values before calling the backend', async () => {
    const response = await GET(
      new NextRequest('https://shop.example.com/api/products?cumulative=yes'),
    );

    expect(response.status).toBe(400);
    expect(fetchProducts).not.toHaveBeenCalled();
  });
});
