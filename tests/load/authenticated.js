import { accounts, json, login, optionsFor, pause, request } from './helpers.js';

const users = accounts();
export const options = optionsFor(['users.me', 'cart.list', 'addresses.list', 'orders.list']);

export default function authenticated() {
  login(users);
  const me = request('GET', '/api/users/me', 'users.me');
  json(me, 'users.me', (value) => Number.isInteger(value?.id));
  pause();
  json(request('GET', '/api/cart/items', 'cart.list'), 'cart.list', Array.isArray);
  json(request('GET', '/api/addresses', 'addresses.list'), 'addresses.list', Array.isArray);
  pause();
  const orders = json(
    request('GET', '/api/orders?page=1', 'orders.list'),
    'orders.list',
    Array.isArray,
  );
  if (Array.isArray(orders) && orders.length) {
    const order = request('GET', `/api/orders/${orders[0].id}`, 'orders.detail');
    json(
      order,
      'orders.detail',
      (value) => value?.id === orders[0].id && Array.isArray(value.orderItems),
    );
  }
  pause();
}
