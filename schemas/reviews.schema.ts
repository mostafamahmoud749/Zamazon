import Z from 'zod';

export const CreateReviewSchema = Z.object({
  rating: Z.coerce
    .number()
    .int()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must be at most 5'),
  comment: Z.string().trim().max(1000, 'Comment must be at most 1000 characters').optional(),
});

export const UpdateReviewSchema = Z.object({
  rating: Z.coerce
    .number()
    .int()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must be at most 5')
    .optional(),
  comment: Z.string().trim().max(1000, 'Comment must be at most 1000 characters').optional(),
}).refine((data) => Object.keys(data).length > 0, 'At least one field must be provided for update');

export const ReviewIdParamsSchema = Z.object({
  reviewId: Z.coerce.number().int().positive('Review ID must be a positive integer'),
});

export const ReviewRouteParamsSchema = Z.object({
  id: Z.coerce.number().int().positive('Product ID must be a positive integer'),
  reviewId: Z.coerce.number().int().positive('Review ID must be a positive integer'),
});
