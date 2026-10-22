import { randomUUID } from 'node:crypto';
import { v2 as cloudinary } from 'cloudinary';
import type { ImageUploadSignature } from '../../types/image.js';

export function createImageUploadSignature(userId: number): ImageUploadSignature | null {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) return null;

  const params = {
    timestamp: Math.floor(Date.now() / 1000),
    public_id: `zamazon/users/${userId}/images/${randomUUID()}`,
    type: 'upload',
    overwrite: false,
    allowed_formats: 'jpg,jpeg,png,webp',
    transformation: 'c_limit,w_1600,h_1600/f_webp,q_auto',
    eval: 'if (resource_info.bytes > 5242880) { throw new Error("Images must be 5 MB or smaller"); }',
  };

  return {
    uploadUrl: `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/image/upload`,
    apiKey,
    params,
    signature: cloudinary.utils.api_sign_request(params, apiSecret),
  };
}
