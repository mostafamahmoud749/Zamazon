import z from 'zod';

export const UserSchema = z.object({
  id: z.number(),
  defaultAddressId: z.number().nullable(),
  name: z.string().nullable(),
  email: z.email(),
  image: z.string().nullable(),
});

export const SetDefaultAddressSchema = z.object({
  defaultAddressId: z.number().int().positive(),
});

export const UpdateImage = z.object({
  image: z
    .url({ protocol: /^https$/, error: 'Image must be a valid HTTPS URL' })
    .max(2048, 'Image URL must be at most 2048 characters'),
});

export type User = z.infer<typeof UserSchema>;
