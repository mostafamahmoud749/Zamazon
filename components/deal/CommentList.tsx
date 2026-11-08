'use client';
import { useContext, useEffect, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import CommentItem from '@/components/deal/CommentItem';
import { UserContext } from '@/components/auth/UserProvider';
import type { Comment } from '@/types/index';
import ReviewSkeleton from '@/components/loading/ReviewSkeleton';

type CommentListProps = {
  productId: number;
  comments: Comment[];
  setComments: Dispatch<SetStateAction<Comment[]>>;
};

export default function CommentList({ productId, comments, setComments }: CommentListProps) {
  const { user } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    async function fetchComments() {
      try {
        const response = await fetch(`/api/products/${productId}/reviews`, {
          signal: controller.signal,
        });

        if (response.status === 404) {
          if (!controller.signal.aborted) setComments([]);
          return;
        }

        if (!response.ok) {
          throw new Error(`Failed to fetch comments: ${response.status}`);
        }

        const data = await response.json();
        if (!controller.signal.aborted) setComments(data);
      } catch (error) {
        if (!controller.signal.aborted) console.error('Error fetching comments:', error);
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    void fetchComments();
    return () => controller.abort();
  }, [productId, setComments]);

  const showComments = comments.map((comment) => {
    const formattedDate = new Date(comment.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC',
    });
    return (
      <CommentItem
        key={comment.id}
        reviewId={comment.id}
        productId={productId}
        name={comment.user.name}
        rating={comment.rating}
        date={formattedDate}
        comment={comment.comment ?? ''}
        isOwner={user?.id === comment.user.id}
        setComments={setComments}
      />
    );
  });

  return (
    <div className="divide-y divide-gray-300 lg:col-span-2">
      {isLoading ? (
        <ReviewSkeleton />
      ) : comments.length > 0 ? (
        showComments
      ) : (
        'No reviews yet. Be the first to leave one!'
      )}
    </div>
  );
}
