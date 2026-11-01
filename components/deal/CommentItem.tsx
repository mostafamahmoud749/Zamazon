import Stars from '@/components/deal/Stars';

type CommentItemProps = {
  name: string;
  date: string;
  rating: number;
  comment: string;
};

export default function CommentItem({ name, date, rating, comment }: CommentItemProps) {
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
    </div>
  );
}
