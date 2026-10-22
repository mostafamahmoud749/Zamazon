import images from '../seed-images.json';

type SeedImageSlug = keyof typeof images;

const categoryImages: Record<string, SeedImageSlug[]> = {
  electronics: [
    'noise-cancelling-headphones',
    'mechanical-keyboard',
    '4k-usb-c-monitor',
    'mirrorless-camera',
    'wireless-earbuds',
    'smartwatch-active',
    'portable-projector',
    'bluetooth-speaker',
  ],
  'home-kitchen': [
    'pour-over-coffee-maker',
    'smart-table-lamp',
    'ergonomic-office-chair',
    'cast-iron-skillet',
    'standing-desk',
  ],
  'sports-outdoors': ['yoga-mat', 'adjustable-dumbbells', 'running-backpack'],
  books: ['the-last-lighthouse', 'practical-typescript'],
  fashion: ['leather-crossbody-bag', 'classic-sunglasses'],
};

export function getSeedImage(slug: string): string {
  const image = (images as Record<string, { url: string }>)[slug];
  if (
    !image ||
    !/^https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/.+\.(webp|jpe?g|png)$/.test(image.url)
  ) {
    throw new Error(`Missing Cloudinary seed image for ${slug}. Run npm run seed:images first.`);
  }
  return image.url;
}

export function assertSeedImagesReady() {
  for (const slug of Object.keys(images)) getSeedImage(slug);
}

export function getCategorySeedImage(categorySlug: string, index: number): string {
  const slugs = categoryImages[categorySlug] ?? (Object.keys(images) as SeedImageSlug[]);
  return getSeedImage(slugs[index % slugs.length]);
}
