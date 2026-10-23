import z from "zod"

export const UserSchema = z.object({
  id: z.number(), 
  name: z.string().nullable(),
  email: z.email(),
});

export type User = z.infer<typeof UserSchema>;