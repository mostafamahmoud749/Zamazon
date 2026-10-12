import { prisma } from '../../prisma/lib/prisma.js';

export const checkAvailableProductQuantity = async (productId: number, quantity: number) => {
  const availableQuantity = await prisma.product.findUnique({
    where: { id: productId },
    select: { stock: true, isActive: true },
  });

  if (!availableQuantity || !availableQuantity.isActive || availableQuantity.stock < quantity) {
    return false;
  }

  return true;
};
