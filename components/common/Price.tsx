import { formatPrice } from '@/lib/pricing';

type PriceProps = {
  priceCents: number;
  originalPriceCents?: number | null;
  className?: string;
};

export default function Price({ priceCents, originalPriceCents, className = '' }: PriceProps) {
  const hasDiscount = originalPriceCents != null && originalPriceCents > priceCents;

  return (
    <div className={`flex flex-col gap-0.5 tabular-nums ${className}`}>
      {hasDiscount && (
        <del className="text-xs font-normal text-gray-500">
          <span className="sr-only">Original price: </span>
          {formatPrice(originalPriceCents / 100)}
        </del>
      )}
      <span className="font-semibold">{formatPrice(priceCents / 100)}</span>
      {hasDiscount && (
        <span className="text-xs font-medium text-green-700">
          Save {formatPrice((originalPriceCents - priceCents) / 100)}
        </span>
      )}
    </div>
  );
}
