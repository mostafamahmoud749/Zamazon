import Z from 'zod';

export const IdempotencyKeySchema = Z.string()
  .min(1)
  .max(128)
  .regex(/^[A-Za-z0-9_-]+$/);

export const OrderQuerySchema = Z.object({
  page: Z.coerce.number().int().min(1).default(1),
});

export const OrderIdParamsSchema = Z.object({
  id: Z.coerce.number().int().positive('Order ID must be a positive integer'),
});

export const CreateOrderSchema = Z.object({
  addressId: Z.coerce.number().int().positive('Address ID must be a positive integer'),
  paymentMethod: Z.enum(['credit_card', 'paypal', 'bank_transfer']),
});
