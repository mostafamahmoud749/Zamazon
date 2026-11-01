import Stars from '@/components/deal/Stars';
import { Pencil, Trash2 } from 'lucide-react';

type CommentItemProps = {
  name: string;
  date: string;
  rating: number;
  comment: string;
  isOwner: boolean;
};

export default function CommentItem({ name, date, rating, comment, isOwner }: CommentItemProps) {
  return (
    <div className="pb-6">
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
          <details className="group min-w-0 flex-1">
            <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium text-sky-800 transition-colors hover:bg-sky-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 [&::-webkit-details-marker]:hidden">
              <Pencil size={14} aria-hidden="true" />
              <span className="group-open:hidden">Edit</span>
              <span className="hidden group-open:inline">Close editor</span>
            </summary>
            <div className="mt-3 space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
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
                type="button"
                className="bg-yellow text-dark focus-visible:outline-dark_blue cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-colors hover:bg-yellow-400 focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                Save changes
              </button>
            </div>
          </details>
          <button
            type="button"
            className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
          >
            <Trash2 size={14} aria-hidden="true" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
