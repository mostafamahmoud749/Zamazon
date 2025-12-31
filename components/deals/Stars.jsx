import { Star } from 'lucide-react';
export default function Stars({ text }) {
  return (
    <div className="flex whitespace-nowrap text-yellow-500">
      {[1, 2, 3, 4].map((i) => (
        <Star key={i} fill="currentColor" stroke="currentColor" />
      ))}
      <Star />
      <span className="ml-1 text-black">{text}</span>
    </div>
  );
}
