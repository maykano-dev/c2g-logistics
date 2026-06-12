import { getLinkOrder } from "../../actions";
import { redirect } from "next/navigation";
import { EditLinkOrderForm } from "./edit-form";

export default async function EditLinkOrderPage({ params }: { params: { id: string } }) {
  const order = await getLinkOrder(params.id);

  if (!order) {
    redirect("/dashboard/link-orders");
  }

  // We only allow editing if it hasn't been paid for yet.
  const isPaid = order.payment_status === 'paid' || order.payment_status === 'Paid';
  if (isPaid || order.order_status === 'cancelled') {
    redirect(`/dashboard/link-orders/${order.id}`);
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-2xl mx-auto pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Order</h1>
        <p className="text-muted-foreground mt-1">Update quantities or shipping instructions before payment.</p>
      </div>

      <EditLinkOrderForm order={order} />
    </div>
  );
}
