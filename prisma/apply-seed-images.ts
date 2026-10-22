import 'dotenv/config';
import images from './seed-images.json';
import { prisma } from './lib/prisma';
import { assertSeedImagesReady, getCategorySeedImage, getSeedImage } from './lib/seedImages';

async function main() {
  assertSeedImagesReady();
  const categoryCount = Math.max(
    1,
    Math.min(5, await prisma.category.count({ where: { parentId: null } })),
  );
  const products = await prisma.product.findMany({
    where: {
      OR: [{ slug: { in: Object.keys(images) } }, { slug: { startsWith: 'scroll-demo-product-' } }],
    },
    select: { id: true, slug: true, image: true, category: { select: { slug: true } } },
  });
  let updated = 0;
  for (const product of products) {
    const match = /^scroll-demo-product-(\d{3})$/.exec(product.slug);
    if (!match && !Object.hasOwn(images, product.slug)) continue;
    const image = match
      ? getCategorySeedImage(
          product.category?.slug ?? '',
          Math.floor((Number(match[1]) - 1) / categoryCount),
        )
      : getSeedImage(product.slug);
    if (product.image === image) continue;
    const result = await prisma.product.updateMany({
      where: { id: product.id, image: product.image },
      data: { image },
    });
    updated += result.count;
  }
  console.log(
    `Updated images for ${updated} existing seed products. No records were created or deleted.`,
  );
}

main()
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : 'Seed image update failed');
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
