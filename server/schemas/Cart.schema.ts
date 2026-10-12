import Z from 'zod';

export const MAX_CART_QUANTITY = 99;

export const CartIDParamsSchema = Z.object({
  id: Z.coerce.number().int().positive('Cart ID must be a positive integer'),
});

export const CreateCartItemSchema = Z.object({
  productId: Z.number().int().positive(),
  quantity: Z.number().int().positive().max(MAX_CART_QUANTITY),
});

export const UpdateCartItemSchema = Z.object({
  quantity: Z.number().int().positive().max(MAX_CART_QUANTITY),
});
