import { getCsrfToken } from './getCsrfToken';
import type { ImageUploadSignature, UploadedImage } from '@/types/image';

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const IMAGE_CONTENT_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export async function uploadImage(file: File): Promise<UploadedImage> {
  if (!IMAGE_CONTENT_TYPES.includes(file.type)) {
    throw new Error('Choose a JPEG, PNG, or WebP image');
  }
  if (!file.size) throw new Error('An image file is required');
  if (file.size > MAX_IMAGE_BYTES) throw new Error('Images must be 5 MB or smaller');

  const csrfToken = await getCsrfToken();
  const signatureResponse = await fetch(`${process.env.API_URL}/api/images/upload-signature`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'X-CSRF-Token': csrfToken },
    cache: 'no-store',
  });
  if (!signatureResponse.ok) {
    const error = await signatureResponse.json().catch(() => null);
    throw new Error(
      error?.error ||
        (signatureResponse.status === 401
          ? 'Sign in to upload an image'
          : 'Could not start image upload'),
    );
  }

  const { uploadUrl, apiKey, signature, params }: ImageUploadSignature =
    await signatureResponse.json();
  const form = new FormData();
  form.append('file', file);
  form.append('api_key', apiKey);
  form.append('signature', signature);
  for (const [key, value] of Object.entries(params)) {
    form.append(key, String(value));
  }

  
  const uploadResponse = await fetch(uploadUrl, {
    method: 'POST',
    credentials: 'omit',
    body: form,
  });
  const image = await uploadResponse.json().catch(() => null);
  if (!uploadResponse.ok) {
    throw new Error(image?.error?.message || 'Image upload failed. Please try again.');
  }
  if (
    image?.public_id !== params.public_id ||
    image?.resource_type !== 'image' ||
    typeof image?.secure_url !== 'string' ||
    !image.secure_url.startsWith('https://res.cloudinary.com/')
  ) {
    throw new Error('Cloudinary returned an invalid image response');
  }

  return {
    id: image.public_id.split('/').at(-1)!,
    publicId: image.public_id,
    url: image.secure_url,
    width: image.width,
    height: image.height,
    format: image.format,
    bytes: image.bytes,
  };
}
