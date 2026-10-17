import { prisma } from '../../../prisma/lib/prisma.js';

export async function createMockProducts() {
  const suffix = crypto.randomUUID();
  const [userOne, userTwo] = await Promise.all([
    prisma.user.create({
      data: { email: `products-one-${suffix}@example.com` },
    }),
    prisma.user.create({
      data: { email: `products-two-${suffix}@example.com` },
    }),
  ]);
  const [categoryOne, categoryTwo] = await Promise.all([
    prisma.category.create({
      data: { name: `Products Electronics ${suffix}`, slug: `products-electronics-${suffix}` },
    }),
    prisma.category.create({
      data: { name: `Products Clothing ${suffix}`, slug: `products-clothing-${suffix}` },
    }),
  ]);

  const products = await prisma.product.createManyAndReturn({
    data: [
      {
        userId: userOne.id,
        categoryId: categoryOne.id,
        title: 'Product 1',
        description: 'Description 1',
        price: 10.0,
        discount: 0.0,
        stock: 100,
        slug: `product-1-${suffix}`,
        image: 'image1.jpg',
        isActive: true,
      },
      {
        userId: userOne.id,
        categoryId: categoryOne.id,
        title: 'Product 2',
        description: 'Description 2',
        price: 20.0,
        discount: 0.0,
        stock: 200,
        slug: `product-2-${suffix}`,
        image: 'image2.jpg',
        isActive: true,
      },
      {
        userId: userTwo.id,
        categoryId: categoryTwo.id,
        title: 'Product 3',
        description: 'Description 3',
        price: 30.0,
        discount: 0.0,
        stock: 300,
        slug: `product-3-${suffix}`,
        image: 'image3.jpg',
        isActive: true,
      },
    ],
  });
  await prisma.review.createMany({
    data: [
      { productId: products[0].id, userId: userOne.id, rating: 5 },
      { productId: products[0].id, userId: userTwo.id, rating: 3 },
      { productId: products[1].id, userId: userOne.id, rating: 5 },
      { productId: products[1].id, userId: userTwo.id, rating: 1 },
    ],
  });

  return {
    categoryOneId: categoryOne.id,
    categoryTwoId: categoryTwo.id,
    productIds: products.map(({ id }) => id),
    userIds: [userOne.id, userTwo.id],
  };
}
