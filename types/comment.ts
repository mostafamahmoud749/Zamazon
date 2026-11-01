export type Comment = {
  id: number;
  ProductId: number;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    userId: number;
    name: string;
  };
};
