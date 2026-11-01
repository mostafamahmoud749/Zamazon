export type Comment = {
  id: number;
  productId: number;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: {
    id: number;
    name: string;
  };
};
