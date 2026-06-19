import Link from "next/link";
import { getSettings } from "../actions";
import { NewLinkOrderForm } from "./new-link-order-form";

export default async function NewLinkOrderPage() {
  const settings = await getSettings();
  const exchangeRate = settings?.rate_link_orders || settings?.rate_shop_products || 0.5200;

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Link href="/dashboard/orders" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            Link Orders
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm font-medium">New Request</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Place a New Link Order</h1>
        <p className="text-muted-foreground mt-1">Found a product on a Chinese site? We'll buy it and ship it to you.</p>
      </div>

      <NewLinkOrderForm exchangeRate={exchangeRate} />
    </div>
  );
}
