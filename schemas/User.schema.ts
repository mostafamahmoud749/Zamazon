import z from 'zod';

export const UserSchema = z.object({
  id: z.number(),
  defaultAddressId: z.number().nullable(),
  name: z.string().nullable(),
  email: z.email(),
});

export const SetDefaultAddressSchema = z.object({
  defaultAddressId: z.number().int().positive(),
});

export type User = z.infer<typeof UserSchema>;
