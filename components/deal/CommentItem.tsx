'use client';
import { useEffect, useRef, useState } from 'react';
import type { Dispatch, FormEvent, SetStateAction } from 'react';
import Stars from '@/components/deal/Stars';
import Popup from '@/components/common/Popup';
import { Pencil, Trash2 } from 'lucide-react';
import { UpdateReviewSchema } from '@/schemas/reviews.schema';
import { getCsrfToken } from '@/lib/getCsrfToken';
import type { Comment } from '@/types';

type CommentItemProps = {
  reviewId: number;
  productId: number;
  name: string;
  date: string;
  rating: number;
  comment: string;
  isOwner: boolean;
  setComments: Dispatch<SetStateAction<Comment[]>>;
};

export default function CommentItem({
  reviewId,
  productId,
  name,
  date,
  rating,
  comment,
  isOwner,
  setComments,
}: CommentItemProps) {
  const [pendingAction, setPendingAction] = useState<'edit' | 'delete' | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const editorRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    if (!errorMessage) return;
    const timeout = setTimeout(() => setErrorMessage(null), 8000);
    return () => clearTimeout(timeout);
  }, [errorMessage]);

  async function editComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pendingAction) return;
    setErrorMessage(null);

    const formData = new FormData(event.currentTarget);
    const result = UpdateReviewSchema.safeParse({
      rating: Number(formData.get('rating')),
      comment: formData.get('comment'),
    });

    if (!result.success) {
      setErrorMessage(result.error.issues.map((issue) => issue.message).join(' '));
      return;
    }

    setPendingAction('edit');
    try {
      const csrfToken = await getCsrfToken();
      const response = await fetch(
        `${process.env.API_URL}/api/products/${productId}/reviews/${reviewId}`,
        {
          method: 'PATCH',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
          body: JSON.stringify(result.data),
        },
      );

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || 'Could not update your review. Please try again.');
      }

      const review: Pick<Comment, 'rating' | 'comment'> = await response.json();
      setComments((current) =>
        current.map((item) =>
          item.id === reviewId ? { ...item, rating: review.rating, comment: review.comment } : item,
        ),
      );
      if (editorRef.current) editorRef.current.open = false;
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Could not update your review. Please try again.',
      );
    } finally {
      setPendingAction(null);
    }
  }

  async function deleteComment() {
    if (pendingAction) return;
    setErrorMessage(null);
    setPendingAction('delete');

    try {
      const csrfToken = await getCsrfToken();
      const response = await fetch(
        `${process.env.API_URL}/api/products/${productId}/reviews/${reviewId}`,
        {
          method: 'DELETE',
          credentials: 'include',
          headers: { 'X-CSRF-Token': csrfToken },
        },
      );

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || 'Could not delete your review. Please try again.');
      }

      setComments((current) => current.filter((item) => item.id !== reviewId));
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Could not delete your review. Please try again.',
      );
    } finally {
      setPendingAction(null);
    }
  }

  return (
    <div className="pb-6">
      {errorMessage && (
        <Popup success={false} message={errorMessage} onClose={() => setErrorMessage(null)} />
      )}
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-dark font-semibold">{name}</h3>
        <p className="text-xs text-gray-500">{date}</p>
      </div>
      <div className="mt-2">
        <Stars value={rating} />
      </div>
      <p className="mt-3 text-sm leading-6 text-gray-700">{comment}</p>
      {isOwner && (
        <div className="mt-3 flex items-start gap-2">
          <details ref={editorRef} className="group min-w-0 flex-1">
            <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium text-sky-800 transition-colors hover:bg-sky-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 [&::-webkit-details-marker]:hidden">
              <Pencil size={14} aria-hidden="true" />
              <span className="group-open:hidden">Edit</span>
              <span className="hidden group-open:inline">Close editor</span>
            </summary>
            <form
              onSubmit={editComment}
              className="mt-3 space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4"
            >
              <fieldset disabled={pendingAction !== null} className="space-y-4">
                <label className="text-dark block text-sm font-medium">
                  Your rating
                  <select
                    name="rating"
                    defaultValue={rating}
                    className="mt-2 block w-full cursor-pointer rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-sky-700 focus:ring-1 focus:ring-sky-700 focus:outline-none"
                  >
                    <option value="5">5 stars</option>
                    <option value="4">4 stars</option>
                    <option value="3">3 stars</option>
                    <option value="2">2 stars</option>
                    <option value="1">1 star</option>
                  </select>
                </label>
                <label className="text-dark block text-sm font-medium">
                  Your comment
                  <textarea
                    name="comment"
                    defaultValue={comment}
                    rows={4}
                    className="mt-2 block w-full resize-y rounded-md border border-gray-300 bg-white px-3 py-2 text-sm leading-6 focus:border-sky-700 focus:ring-1 focus:ring-sky-700 focus:outline-none"
                  />
                </label>
                <button
                  type="submit"
                  className="bg-yellow text-dark focus-visible:outline-dark_blue cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-colors hover:bg-yellow-400 focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  {pendingAction === 'edit' ? 'Saving...' : 'Save changes'}
                </button>
              </fieldset>
            </form>
          </details>
          <button
            type="button"
            onClick={deleteComment}
            disabled={pendingAction !== null}
            className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Trash2 size={14} aria-hidden="true" />
            {pendingAction === 'delete' ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      )}
    </div>
  );
}
