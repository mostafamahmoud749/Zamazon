import CartSkeleton from '@/components/loading/CartSkeleton';

export default function Loading() {
  return (
    <div className="mx-auto mt-4 w-11/12 max-w-6xl">
      <CartSkeleton />
    </div>
  );
}
