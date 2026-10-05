import { prisma } from '../../prisma/lib/prisma.js';

export async function getCategoryIdsIncludingChildren(categoryIds: number[]) {
  const allCategoryIds = new Set(categoryIds);
  let parentIds = categoryIds;

  while (parentIds.length > 0) {
    const children = await prisma.category.findMany({
      where: { parentId: { in: parentIds } },
      select: { id: true },
    });

    const childIds = children
      .map((category) => category.id)
      .filter((id) => !allCategoryIds.has(id));

    childIds.forEach((id) => allCategoryIds.add(id));
    parentIds = childIds;
  }

  return [...allCategoryIds];
}
