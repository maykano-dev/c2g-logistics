import { getLinkOrder, getSettings } from "../../actions";
import { redirect } from "next/navigation";
import { EditLinkOrderForm } from "./edit-form";

export default async function EditLinkOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const order = await getLinkOrder(resolvedParams.id);
  const settings = await getSettings();

  if (!order) {
    redirect("/dashboard/orders");
  }

  // We only allow editing if it hasn't been paid for yet.
  const isPaid = order.payment_status === 'paid' || order.payment_status === 'Paid';
  if (isPaid || order.order_status === 'cancelled') {
    redirect(`/dashboard/orders/${order.id}`);
  }

  // Calculate fees from settings
  const exchangeRate = settings?.rate_link_orders || settings?.rate_shop_products || 0.5200;
  const serviceFeePercentage = settings?.service_fee_percentage != null ? settings.service_fee_percentage : 15;
  const minServiceFee = settings?.minimum_service_fee || 5;
  const localDeliveryPercentage = settings?.local_delivery_percentage != null ? settings.local_delivery_percentage : 0;
  const minLocalDeliveryFee = settings?.minimum_local_delivery_fee || 0;

  return (
    <div className="space-y-8 animate-fade-in max-w-2xl mx-auto pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Order</h1>
        <p className="text-muted-foreground mt-1">Update quantities or shipping instructions before payment.</p>
      </div>

      <EditLinkOrderForm 
        order={order}
        exchangeRate={exchangeRate}
        serviceFeePercentage={serviceFeePercentage}
        minServiceFee={minServiceFee}
        localDeliveryPercentage={localDeliveryPercentage}
        minLocalDeliveryFee={minLocalDeliveryFee}
      />
    </div>
  );
}
