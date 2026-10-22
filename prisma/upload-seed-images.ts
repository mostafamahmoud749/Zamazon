import 'dotenv/config';
import { readFile, writeFile, rename } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { v2 as cloudinary, type UploadApiOptions } from 'cloudinary';
import sharp from 'sharp';

const manifestPath = fileURLToPath(new URL('./seed-images.json', import.meta.url));
type SeedImage = {
  url: string;
  publicId: string;
  source: { url: string; page: string; author: string; license: string };
  width?: number;
  height?: number;
  bytes?: number;
  format?: string;
};

async function main() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret)
    throw new Error('Missing Cloudinary environment variables');
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  const images: Record<string, SeedImage> = JSON.parse(await readFile(manifestPath, 'utf8'));
  for (const [slug, image] of Object.entries(images)) {
    if (!image.publicId.startsWith('zamazon/seed/products/'))
      throw new Error(`Invalid seed ID: ${slug}`);
    if (image.url) {
      if (!image.url.startsWith(`https://res.cloudinary.com/${cloudName}/image/upload/`)) {
        throw new Error(`${slug} belongs to a different Cloudinary cloud`);
      }
      console.log(`Already uploaded: ${slug}`);
      continue;
    }

    let original: Buffer;
    if (image.source.url.startsWith('https://')) {
      const response = await fetch(image.source.url, { signal: AbortSignal.timeout(45_000) });
      if (!response.ok) throw new Error(`Source image for ${slug} returned ${response.status}`);
      original = Buffer.from(await response.arrayBuffer());
    } else {
      original = await readFile(new URL(`../${image.source.url}`, import.meta.url));
    }
    if (original.length > 5 * 1024 * 1024) throw new Error(`Source image exceeds 5 MiB: ${slug}`);
    // Normalize trusted seed artwork losslessly before Cloudinary applies q_auto.
    const normalized = await sharp(original)
      .rotate()
      .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
      .webp({ lossless: true })
      .toBuffer();
    const source = `data:image/webp;base64,${normalized.toString('base64')}`;
    const studioImage = image.source.url.startsWith('public/products/studio/');
    const options: UploadApiOptions = {
      public_id: image.publicId,
      resource_type: 'image',
      type: 'upload',
      overwrite: false,
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'svg'],
      ...(studioImage
        ? {}
        : {
            format: 'webp',
            transformation: [
              { crop: 'limit', width: 1600, height: 1600 },
              { fetch_format: 'webp', quality: 'auto' },
            ],
          }),
      eval: 'if (resource_info.bytes > 5242880) { throw new Error("Images must be 5 MB or smaller"); }',
      timeout: 60_000,
    };
    const asset = await cloudinary.uploader.upload(source, options);
    if (
      asset.public_id !== image.publicId ||
      !['webp', 'jpg', 'jpeg', 'png'].includes(asset.format) ||
      !asset.secure_url ||
      asset.width > 1600 ||
      asset.height > 1600 ||
      asset.bytes > 5242880
    ) {
      throw new Error(`Unexpected Cloudinary upload response for ${slug}`);
    }
    if (studioImage && (asset.format !== 'webp' || asset.width !== 1024 || asset.height !== 1024)) {
      throw new Error(`Unexpected studio image format or dimensions for ${slug}`);
    }
    image.url = asset.secure_url;
    image.width = asset.width;
    image.height = asset.height;
    image.bytes = asset.bytes;
    image.format = asset.format;
    await writeFile(`${manifestPath}.tmp`, `${JSON.stringify(images, null, 2)}\n`);
    await rename(`${manifestPath}.tmp`, manifestPath);
    console.log(`Uploaded ${slug}: ${asset.width}x${asset.height}, ${asset.bytes} bytes`);
  }
}

main().catch((error: unknown) => {
  const message = error && typeof error === 'object' && 'message' in error ? error.message : null;
  console.error(typeof message === 'string' ? message : 'Seed image upload failed');
  process.exitCode = 1;
});
