import { Plus, PackageSearch } from "lucide-react";
import Link from "next/link";
import { getLinkOrders } from "./actions";
import { LinkOrderCard } from "./link-order-card";

export default async function LinkOrdersPage() {
  const orders = await getLinkOrders();

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Link Orders</h1>
          <p className="text-muted-foreground mt-1">Manage and track your "Buy For Me" orders.</p>
        </div>
        <Link 
          href="/dashboard/link-orders/new" 
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 gap-2 shadow-lg shadow-primary/25 hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          Place Link Order
        </Link>
      </div>

      <div className="space-y-4">
        {orders.length > 0 ? (
          orders.map((order: any) => (
            <LinkOrderCard key={order.id} order={order} />
          ))
        ) : (
          <div className="glass-panel p-12 text-center flex flex-col items-center justify-center border-dashed">
            <div className="w-16 h-16 bg-secondary/50 rounded-full flex items-center justify-center mb-4">
              <PackageSearch className="w-8 h-8 text-muted-foreground opacity-50" />
            </div>
            <h3 className="text-xl font-bold mb-2">No Link Orders Yet</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              You haven't placed any "Buy For Me" orders yet. Click the button above to get started.
            </p>
            <Link 
              href="/dashboard/link-orders/new" 
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-6 gap-2"
            >
              Place Your First Order
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
