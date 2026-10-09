export interface CreateProductDto {
  categoryId?: number;
  stock: number;
  title: string;
  description: string;
  price: number;
  discount?: number;
  image: string;
  slug: string;
}

export interface PatchProductDto {
  categoryId?: number;
  stock?: number;
  title?: string;
  description?: string;
  price?: number;
  discount?: number;
  image?: string;
  slug?: string;
}
