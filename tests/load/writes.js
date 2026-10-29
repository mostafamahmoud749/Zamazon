import exec from 'k6/execution';
import { check } from 'k6';
import { accounts, json, login, must, optionsFor, pause, request } from './helpers.js';

if (__ENV.ALLOW_WRITES !== 'true')
  throw new Error('Set ALLOW_WRITES=true with a disposable test database');
const users = accounts();
export const options = optionsFor([
  'products.create',
  'products.update',
  'products.delete',
  'reviews.create',
  'reviews.update',
  'reviews.delete',
  'cart.create',
  'cart.update',
  'cart.delete',
  'addresses.create',
  'addresses.update',
]);

function checkout(payload, token, key, expectedStatus) {
  const response = must(
    request('POST', '/api/orders', 'orders.checkout', payload, token, [expectedStatus], {
      'Idempotency-Key': key,
    }),
    expectedStatus,
    'Checkout',
  );
  const order = json(response, 'orders.checkout', (value) => Number.isInteger(value?.id));
  if (!order?.id) throw new Error('Checkout did not return an order ID');
  return order;
}

export default function writes() {
  const token = login(users);
  const cart = json(
    must(request('GET', '/api/cart/items', 'cart.list'), 200, 'Read cart'),
    'cart.list',
    Array.isArray,
  );
  if (!Array.isArray(cart) || cart.length) {
    exec.test.abort(
      'Write tests need a distinct account per VU with an empty cart; use disposable test accounts',
    );
  }

  const suffix = `${Date.now()}-${exec.vu.idInTest}-${exec.vu.iterationInScenario}`;
  let productId;
  let addressId;
  let reviewId;
  let cartId;
  let orderId;
  try {
    const product = must(
      request(
        'POST',
        '/api/products',
        'products.create',
        {
          title: `Load test ${suffix}`,
          description: 'Disposable load-test fixture',
          price: 10,
          stock: 10,
          image: 'https://example.com/load-test.jpg',
          slug: `load-test-${suffix}`,
        },
        token,
        [201],
      ),
      201,
      'Create product',
    ).json();
    productId = product.id;
    must(
      request('PATCH', `/api/products/${productId}`, 'products.update', { price: 12 }, token),
      200,
      'Update product',
    );

    const review = must(
      request(
        'POST',
        `/api/products/${productId}/reviews`,
        'reviews.create',
        {
          rating: 4,
          comment: 'Load-test review',
        },
        token,
        [201],
      ),
      201,
      'Create review',
    ).json();
    reviewId = review.id;
    must(
      request(
        'PATCH',
        `/api/products/${productId}/reviews/${reviewId}`,
        'reviews.update',
        { rating: 5 },
        token,
      ),
      200,
      'Update review',
    );

    const address = must(
      request(
        'POST',
        '/api/addresses',
        'addresses.create',
        {
          street: 'Load-test street',
          city: 'Cairo',
          state: 'Cairo',
          postalCode: '11511',
          country: 'Egypt',
        },
        token,
        [201],
      ),
      201,
      'Create address',
    ).json();
    addressId = address.id;
    must(
      request(
        'PATCH',
        `/api/addresses/${addressId}`,
        'addresses.update',
        { street: 'Updated test street' },
        token,
      ),
      200,
      'Update address',
    );

    const item = must(
      request('POST', '/api/cart/items', 'cart.create', { productId, quantity: 1 }, token, [201]),
      201,
      'Add cart item',
    ).json();
    cartId = item.id;
    must(
      request('PATCH', `/api/cart/items/${cartId}`, 'cart.update', { quantity: 2 }, token),
      200,
      'Update cart',
    );
    // Exercise cart deletion before optionally testing checkout.
    must(
      request('DELETE', `/api/cart/items/${cartId}`, 'cart.delete', undefined, token),
      200,
      'Delete cart item',
    );
    cartId = undefined;

    if (__ENV.CHECKOUT === 'true') {
      cartId = must(
        request('POST', '/api/cart/items', 'cart.create', { productId, quantity: 1 }, token, [201]),
        201,
        'Add checkout item',
      ).json().id;
      const key = `load-${suffix}`;
      const payload = { addressId, paymentMethod: 'credit_card' };
      // Checkout additionally requires an Idempotency-Key header.
      const order = checkout(payload, token, key, 201);
      orderId = order.id;
      cartId = undefined; // Successful checkout consumes the cart.
      const replay = checkout(payload, token, key, 200);
      check(replay, { 'checkout replay returns the same order': (value) => value.id === orderId });
      json(
        request('GET', `/api/orders/${orderId}`, 'orders.detail'),
        'orders.detail',
        (value) => value?.id === orderId,
      );
      must(
        request('PATCH', `/api/orders/${orderId}/cancel`, 'orders.cancel', {}, token),
        200,
        'Cancel order',
      );
    }
  } finally {
    // Target only records created by this iteration. Cleanup failures remain failed metrics.
    if (cartId) request('DELETE', `/api/cart/items/${cartId}`, 'cart.cleanup', undefined, token);
    if (reviewId)
      request(
        'DELETE',
        `/api/products/${productId}/reviews/${reviewId}`,
        'reviews.delete',
        undefined,
        token,
        [204],
      );
    if (addressId && !orderId)
      request('DELETE', `/api/addresses/${addressId}`, 'addresses.delete', undefined, token, [204]);
    if (productId)
      request('DELETE', `/api/products/${productId}`, 'products.delete', undefined, token);
  }
  pause();
}
