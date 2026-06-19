import { Plus, PackageSearch, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { getLinkOrders, getMallOrders } from "./actions";
import OrdersTabsClient from "./orders-tabs-client";

export default async function OrdersPage() {
  const linkOrders = await getLinkOrders();
  const mallOrders = await getMallOrders();

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Orders</h1>
          <p className="text-muted-foreground mt-1">Manage and track all your purchases.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            href="/dashboard/orders/new" 
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 gap-2 shadow-sm hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            Place Link Order
          </Link>
          <Link 
            href="/shop" 
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all border-2 border-primary/20 bg-primary/10 text-primary hover:bg-primary/20 h-10 px-4 gap-2 shadow-sm hover:scale-[1.02]"
          >
            <ShoppingCart className="w-4 h-4" />
            Go to Mall
          </Link>
        </div>
      </div>

      <OrdersTabsClient linkOrders={linkOrders} mallOrders={mallOrders} />
    </div>
  );
}
