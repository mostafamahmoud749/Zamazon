import exec from 'k6/execution';
import { json, must, optionsFor, pause, request } from './helpers.js';

export const options = optionsFor([
  'products.list',
  'products.search',
  'products.rating',
  'products.cumulative',
  'products.detail',
  'products.reviews',
  'categories.list',
]);

const hasRating = (value) =>
  Number.isFinite(value?.rating?.rate) &&
  value.rating.rate >= 0 &&
  value.rating.rate <= 5 &&
  Number.isInteger(value.rating.count) &&
  value.rating.count >= 0;

export function setup() {
  const productsResponse = must(
    request('GET', '/api/products', 'setup.products'),
    200,
    'Discover products',
  );
  const products = json(productsResponse, 'setup.products', Array.isArray);
  if (!Array.isArray(products) || products.length === 0) {
    throw new Error('Add active products first (npm run seed:products against the test database)');
  }
  const categoriesResponse = must(
    request('GET', '/api/categories', 'setup.categories'),
    200,
    'Discover categories',
  );
  const categories = json(categoriesResponse, 'setup.categories', Array.isArray);
  if (!Array.isArray(categories)) throw new Error('Expected a categories array');
  return {
    products: products.map(({ id, title, categoryId }) => ({ id, title, categoryId })),
    categories,
  };
}

export default function browse(data) {
  const index = (exec.vu.idInTest + exec.vu.iterationInScenario - 1) % data.products.length;
  const product = data.products[index];
  const page = 1 + (exec.vu.iterationInScenario % 3);
  const variants = [
    [`/api/products?page=${page}`, 'products.list'],
    [`/api/products?search=${encodeURIComponent(product.title.slice(0, 100))}`, 'products.search'],
    ['/api/products?rating=4', 'products.rating'],
    ['/api/products?page=2&cumulative=true', 'products.cumulative'],
  ];
  if (product.categoryId) {
    variants.push([
      `/api/products?filters=${encodeURIComponent(JSON.stringify([product.categoryId]))}`,
      'products.category',
    ]);
  }
  for (const [path, name] of variants) {
    const response = request('GET', path, name);
    json(response, name, (value) => Array.isArray(value) && value.every(hasRating));
    pause();
  }

  const detail = request('GET', `/api/products/${product.id}`, 'products.detail');
  json(detail, 'products.detail', (value) => value?.id === product.id && hasRating(value));
  const reviews = request(
    'GET',
    `/api/products/${product.id}/reviews`,
    'products.reviews',
    undefined,
    undefined,
    [200, 404],
  );
  if (reviews.status === 200) json(reviews, 'products.reviews', Array.isArray);

  json(request('GET', '/api/categories', 'categories.list'), 'categories.list', Array.isArray);
  json(
    request('GET', '/api/categories/ancestors', 'categories.ancestors'),
    'categories.ancestors',
    Array.isArray,
  );
  const category = data.categories[index % data.categories.length];
  if (category) {
    json(
      request('GET', `/api/categories?ids=${category.id}`, 'categories.lookup'),
      'categories.lookup',
      Array.isArray,
    );
    const children = request(
      'GET',
      `/api/categories/${category.id}/childrens`,
      'categories.children',
      undefined,
      undefined,
      [200, 404],
    );
    if (children.status === 200) json(children, 'categories.children', Array.isArray);
  }
  pause();
}
