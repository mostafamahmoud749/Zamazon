'use client';
import { useState } from 'react';
import CommentList from '@/components/deal/CommentList';
import CommentForm from '@/components/deal/CommentForm';
import type { Comment } from '@/types';

export default function Comments({ productId }: { productId: number }) {
  const [comments, setComments] = useState<Comment[]>([]);

  return (
    <div className="mx-2 my-8 rounded-xl border border-gray-300 bg-white p-4 sm:p-6 md:mx-auto md:w-5/6 md:max-w-7xl">
      <h2 className="text-dark border-b border-gray-300 pb-5 text-xl font-semibold">
        Customer comments
      </h2>
      <div className="mt-6 grid gap-8 lg:grid-cols-3">
        <CommentList productId={productId} comments={comments} setComments={setComments} />
        <CommentForm productId={productId} setComments={setComments} />
      </div>
    </div>
  );
}
