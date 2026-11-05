import z from 'zod';

export const UserSchema = z.object({
  id: z.number(),
  defaultAddressId: z.number().nullable(),
  name: z.string().nullable(),
  email: z.email(),
  image: z.string().min(1, 'add a image src').max(200, 'image src so long'),
});

export const SetDefaultAddressSchema = z.object({
  defaultAddressId: z.number().int().positive(),
});

export const UpdateImage = z.object({
  image: z.string().min(1, 'add a image src').max(200, 'image src so long'),
});

export type User = z.infer<typeof UserSchema>;
