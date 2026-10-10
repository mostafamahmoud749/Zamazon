export interface CreateReviewDto {
  rating: number;
  comment?: string;
}

export interface PatchReviewDto {
  rating?: number;
  comment?: string;
}
