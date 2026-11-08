import OrderDetails from '@/components/orders/OrderDetails';
import { OrderIdParamsSchema } from '@/schemas/Orders.schema';
import { notFound } from 'next/navigation';

type OrderDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  const result = OrderIdParamsSchema.safeParse(await params);
  if (!result.success) notFound();

  return <OrderDetails key={result.data.id} orderId={result.data.id} />;
}
