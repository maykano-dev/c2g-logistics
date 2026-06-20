import { getMallOrder } from "../../../mall-orders/actions";
import { MallOrderDetailsClient } from "./mall-order-details-client";
import { notFound } from "next/navigation";

export default async function MallOrderDetailsPage({ 
  params,
  searchParams
}: { 
  params: Promise<{ id: string }>,
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  const order = await getMallOrder(resolvedParams.id);

  if (!order) {
    notFound();
  }

  const initialTrack = resolvedSearchParams.track === "true";

  return (
    <MallOrderDetailsClient order={order} initialTrack={initialTrack} />
  );
}
