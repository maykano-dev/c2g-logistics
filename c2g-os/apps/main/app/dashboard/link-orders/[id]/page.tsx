import { getLinkOrder } from "../actions";
import { OrderDetailsClient } from "./order-details-client";
import { notFound } from "next/navigation";

export default async function OrderDetailsPage({ 
  params,
  searchParams
}: { 
  params: Promise<{ id: string }>,
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  const order = await getLinkOrder(resolvedParams.id);

  if (!order) {
    notFound();
  }

  const initialTrack = resolvedSearchParams.track === "true";

  return (
    <OrderDetailsClient order={order} initialTrack={initialTrack} />
  );
}
