import Z from 'zod';

const PasswordLengthSchema = Z.string()
  .min(6, 'Password must be at least 6 characters')
  .max(20, 'Password must be at most 20 characters');

export const RegisterSchema = Z.object({
  email: Z.email('Invalid email').trim(),
  password: PasswordLengthSchema.regex(
    /[A-Z]/,
    'Password must contain at least one uppercase letter',
  )
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[\W_]/, 'Password must contain at least one special character'),
  name: Z.string().min(1, 'Name is required').max(20, 'Name must be at most 20 characters'),
}).strict();

export const LoginSchema = Z.object({
  email: Z.email('Invalid email').trim(),
  password: PasswordLengthSchema,
}).strict();
