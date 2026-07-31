import { OrderTracker } from "@/components/OrderTracker";

// Next 16: route params arrive as a Promise.
export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <OrderTracker orderId={id} />;
}
