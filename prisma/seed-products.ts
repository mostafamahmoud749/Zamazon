import 'dotenv/config';
import { prisma } from './lib/prisma';
import { assertSeedImagesReady, getCategorySeedImage } from './lib/seedImages';

// Add demo inventory without clearing existing users, orders, or products.
async function main() {
  assertSeedImagesReady();
  const owner = await prisma.user.findFirst({ select: { id: true }, orderBy: { id: 'asc' } });
  const demoUser = await prisma.user.upsert({
    where: { email: 'scroll-demo@example.com' },
    update: {},
    create: { email: 'scroll-demo@example.com', name: 'Scroll Demo' },
  });
  let categories = await prisma.category.findMany({
    where: { parentId: null },
    select: { id: true, name: true, slug: true },
    orderBy: { id: 'asc' },
    take: 5,
  });
  if (!categories.length) {
    const category = await prisma.category.upsert({
      where: { slug: 'scroll-demo' },
      update: {},
      create: { name: 'Scroll Demo', slug: 'scroll-demo' },
    });
    categories = [category];
  }

  const names = ['Everyday', 'Classic', 'Compact', 'Premium', 'Essential', 'Travel'];
  const data = Array.from({ length: 120 }, (_, index) => {
    const category = categories[index % categories.length];
    const number = String(index + 1).padStart(3, '0');
    return {
      userId: owner?.id ?? demoUser.id,
      categoryId: category.id,
      title: `${names[index % names.length]} ${category.name} Item ${number}`,
      description: `Sample ${category.name.toLowerCase()} product ${number} for exploring the Zamazon catalog.`,
      slug: `scroll-demo-product-${number}`,
      image: getCategorySeedImage(category.slug, Math.floor(index / categories.length)),
      stock: 10 + (index % 90),
      price: (9.99 + index * 2.5).toFixed(2),
      discount: index % 3 === 0 ? '10.00' : '0.00',
    };
  });

  const result = await prisma.product.createMany({ data, skipDuplicates: true });
  for (const { slug, image } of data) {
    await prisma.product.updateMany({
      where: { slug, image: '/products/demo-product.svg' },
      data: { image },
    });
  }
  const products = await prisma.product.findMany({
    where: { slug: { in: data.map(({ slug }) => slug) } },
    select: { id: true },
    orderBy: { id: 'asc' },
  });
  await prisma.review.createMany({
    data: products.map(({ id }, index) => ({
      userId: demoUser.id,
      productId: id,
      rating: index % 3 === 0 ? 3 : index % 2 === 0 ? 4 : 5,
      comment: 'Sample review for testing catalog filters.',
    })),
    skipDuplicates: true,
  });
  console.log(
    `Added ${result.count} products; ${products.length} scroll demo products are available.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
