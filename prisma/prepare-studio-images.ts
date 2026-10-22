import { readFile, writeFile, mkdir, rename } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import sharp from 'sharp';

const directory = new URL('../public/products/studio/', import.meta.url);
const manifestPath = fileURLToPath(new URL('./seed-images.json', import.meta.url));
const background = '#f3f4f6';

async function main() {
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  const prompts = JSON.parse(await readFile(new URL('prompts.json', directory), 'utf8'));
  const slugs = Object.keys(manifest);
  // Check the full set before changing any seed references.
  const originals = await Promise.all(
    slugs.map(async (slug) => {
      if (!prompts.images[slug]) throw new Error(`Missing studio prompt: ${slug}`);
      return readFile(new URL(`source/${slug}.png`, directory));
    }),
  );
  await mkdir(directory, { recursive: true });

  for (const [index, slug] of slugs.entries()) {
    const metadata = await sharp(originals[index]).metadata();
    if (!metadata.hasAlpha) throw new Error(`Studio source needs transparency: ${slug}`);
    const { data, info } = await sharp(originals[index])
      .trim({ threshold: 10 })
      .resize({ width: 800, height: 800, fit: 'inside' })
      .png()
      .toBuffer({ resolveWithObject: true });
    const left = Math.floor((1024 - info.width) / 2);
    const top = Math.floor((1024 - info.height) / 2);
    const image = await sharp(data)
      .extend({
        left,
        right: 1024 - info.width - left,
        top,
        bottom: 1024 - info.height - top,
        background,
      })
      .flatten({ background })
      .webp({ lossless: true })
      .toBuffer();
    if (image.length > 5242880) throw new Error(`Studio image exceeds 5 MiB: ${slug}`);
    const output = `public/products/studio/${slug}.webp`;
    await writeFile(new URL(`${slug}.webp`, directory), image);
    const imageHash = createHash('sha256').update(image).digest('hex').slice(0, 12);
    manifest[slug] = {
      url: '',
      publicId: `zamazon/seed/products/studio/${slug}-${imageHash}`,
      source: {
        url: output,
        page: 'public/products/studio/prompts.json',
        author: 'AI-generated Zamazon demo artwork',
        license: 'Generated demo artwork',
      },
      width: 1024,
      height: 1024,
      bytes: image.length,
      format: 'webp',
      background,
    };
    console.log(`Prepared ${slug}: 1024x1024, ${image.length} bytes, ${background}`);
  }
  await writeFile(`${manifestPath}.tmp`, `${JSON.stringify(manifest, null, 2)}\n`);
  await rename(`${manifestPath}.tmp`, manifestPath);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : 'Studio image preparation failed');
  process.exitCode = 1;
});
