import Stars from '@/components/deal/Stars';

export default function Details({ data, m }) {
  return (
    <div className="mt-4">
      <div className={`${m ? 'text-sm tracking-tight text-gray-600' : ''}`}>{data?.title}</div>
      <div className="my-1 flex items-center text-sm">
        <span>{data.rating.rate}</span>
        <Stars value={data.rating.rate} />
        <span className="text-sky-700 ml-1">({data.rating.count})</span>
      </div>
    </div>
  );
}
