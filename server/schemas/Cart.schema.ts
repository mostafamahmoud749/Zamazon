import Z from 'zod';

export const CartIDParamsSchema = Z.object({
  id: Z.coerce.number().int().positive('Cart ID must be a positive integer'),
});

export const CreateCartItemSchema = Z.object({
  productId: Z.number().int().positive(),
  quantity: Z.number().int().positive(),
})

export const UpdateCartItemSchema = Z.object({
  quantity: Z.number().int().positive(),
});