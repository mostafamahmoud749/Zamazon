'use client';
import { useEffect, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import CommentItem from '@/components/deal/CommentItem';
import type { Comment } from '@/types/index';

type CommentListProps = {
  productId: number;
  comments: Comment[];
  setComments: Dispatch<SetStateAction<Comment[]>>;
};

export default function CommentList({ productId, comments, setComments }: CommentListProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchComments() {
      try {
        const response = await fetch(`${process.env.API_URL}/api/products/${productId}/reviews`);

        if (response.status === 404) {
          setComments([]);
          return;
        }

        if (!response.ok) {
          throw new Error(`Failed to fetch comments: ${response.status}`);
        }

        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchComments();
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
        name={comment.user.name}
        rating={comment.rating}
        date={formattedDate}
        comment={comment.comment ?? ''}
      />
    );
  });

  return (
    <div className="divide-y divide-gray-300 lg:col-span-2">
      {isLoading
        ? 'Loading reviews...'
        : comments.length > 0
          ? showComments
          : 'No reviews yet. Be the first to leave one!'}
    </div>
  );
}
