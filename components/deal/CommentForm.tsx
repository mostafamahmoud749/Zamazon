'use client';
import { useContext, useEffect, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { Comment } from '@/types';
import { UserContext } from '@/components/auth/UserProvider';
import Popup from '@/components/common/Popup';
import { CreateReviewSchema } from '@/schemas/reviews.schema';
import { getCsrfToken } from '@/lib/getCsrfToken';

type CommentFormProps = {
  productId: number;
  setComments: Dispatch<SetStateAction<Comment[]>>;
};

export default function CommentForm({ productId, setComments }: CommentFormProps) {
  const { user } = useContext(UserContext);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!errorMessage) return;
    const timeout = setTimeout(() => setErrorMessage(null), 8000);
    return () => clearTimeout(timeout);
  }, [errorMessage]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isSubmitting) return;
    setErrorMessage(null);
    const data = { rating, comment };

    const result = CreateReviewSchema.safeParse(data);

    if (!result.success) {
      setErrorMessage(result.error.issues.map((issue) => issue.message).join(' '));
      return;
    }

    setIsSubmitting(true);
    try {
      const csrfToken = await getCsrfToken();

      const response = await fetch(`${process.env.API_URL}/api/products/${productId}/reviews`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify(result.data),
      });

      if (!response.ok) {
        const responseData = await response.json().catch(() => null);
        const messages: Record<number, string> = {
          401: 'Please sign in to post a review.',
          403: 'Your session could not be verified. Please refresh and try again.',
          404: 'This product does not exist.',
          409: 'You have already reviewed this product.',
        };

        throw new Error(
          messages[response.status] ||
            (typeof responseData?.error === 'string' ? responseData.error : null) ||
            'Could not post your review. Please try again.',
        );
      }

      const review: Omit<Comment, 'user'> & { userId: number } = await response.json();
      const newComment: Comment = {
        ...review,
        user: { id: review.userId, name: user?.name ?? 'You' },
      };
      setComments((current) => [...current, newComment]);

      setRating(0);
      setComment('');
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Could not post your review. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-gray-300 pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8"
    >
      {errorMessage && (
        <Popup success={false} message={errorMessage} onClose={() => setErrorMessage(null)} />
      )}
      <h3 className="text-dark text-lg font-semibold">Write a comment</h3>

      <div className="mt-4">
        <label htmlFor="comment-rating" className="text-dark mb-2 block text-sm font-medium">
          Your rating
        </label>
        <select
          id="comment-rating"
          name="rating"
          value={rating}
          onChange={(event) => setRating(Number(event.target.value))}
          className="w-full cursor-pointer rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-sky-700 focus:ring-1 focus:ring-sky-700 focus:outline-none"
        >
          <option value={0} disabled>
            Select a rating
          </option>
          <option value="5">5 stars</option>
          <option value="4">4 stars</option>
          <option value="3">3 stars</option>
          <option value="2">2 stars</option>
          <option value="1">1 star</option>
        </select>
      </div>

      <div className="mt-4">
        <label htmlFor="product-comment" className="text-dark mb-2 block text-sm font-medium">
          Your comment
        </label>
        <textarea
          id="product-comment"
          name="comment"
          rows={4}
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          placeholder="What did you think of this product?"
          className="block w-full resize-y rounded-md border border-gray-300 px-3 py-2 text-sm leading-6 placeholder:text-gray-400 focus:border-sky-700 focus:ring-1 focus:ring-sky-700 focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-yellow text-dark focus-visible:outline-dark_blue mt-4 w-full cursor-pointer rounded-full px-5 py-2.5 text-sm font-medium transition-colors hover:bg-yellow-400 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? 'Posting...' : 'Post comment'}
      </button>
    </form>
  );
}
