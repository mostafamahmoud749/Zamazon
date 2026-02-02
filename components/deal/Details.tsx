import Stars from '@/components/deal/Stars';
import type { ProductRating } from '@/types/index';
type Data = {
  title: string;
  rating?: ProductRating;
};
type Details = {
  data: Data;
  m: boolean;
};
export default function Details({ data, m }: Details) {
  const rating = data?.rating;

  return (
    <div className="mt-4">
      <div className={`${m ? 'text-sm tracking-tight text-gray-600' : ''}`}>{data?.title}</div>
      {rating ? (
        <div className="my-1 flex items-center text-sm">
          <span>{rating.rate}</span>
          <Stars value={rating.rate} />
          <span className="ml-1 text-sky-700">({rating.count})</span>
        </div>
      ) : (
        <div className="my-1 text-sm text-gray-500">No ratings yet</div>
      )}
    </div>
  );
}
