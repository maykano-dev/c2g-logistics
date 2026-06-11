import { ShoppingBag, Package, MapPin, Clock } from "lucide-react";
import { getMallOrders } from "./actions";

export default async function MallOrdersPage() {
  const { orders, error } = await getMallOrders();

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "pending_payment":
        return "bg-amber-500/10 text-amber-500 border border-amber-500/20";
      case "processing":
      case "purchased":
      case "in_warehouse":
        return "bg-blue-500/10 text-blue-500 border border-blue-500/20";
      case "in_transit":
      case "clearing_customs":
        return "bg-indigo-500/10 text-indigo-500 border border-indigo-500/20";
      case "ready_for_pickup":
      case "delivered":
        return "bg-green-500/10 text-green-500 border border-green-500/20";
      default:
        return "bg-secondary text-muted-foreground border border-border";
    }
  };

  const formatStatusLabel = (status: string) => {
    if (!status) return "Unknown";
    return status.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto pb-24 md:pb-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mall Orders</h1>
          <p className="text-muted-foreground mt-1">Track and manage your purchases from the C2G Mall.</p>
        </div>
        
        <a href="/shop" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring border border-input bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 gap-2 shadow-lg shadow-primary/25">
          <ShoppingBag className="w-4 h-4" /> Go to Mall
        </a>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-destructive/10 text-destructive border border-destructive/30 text-sm">
          Failed to load mall orders: {error}
        </div>
      )}

      {orders && orders.length === 0 ? (
        <div className="glass-panel p-12 text-center flex flex-col items-center justify-center border-dashed border-2">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <ShoppingBag className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-3">No Mall Orders Yet</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">You haven't placed any orders in the C2G Mall. Explore our catalog of cheap, quality goods from China!</p>
          <a href="/shop" className="inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 h-12 px-8 shadow-lg shadow-primary/25">
            Start Shopping Now
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {orders?.map((order) => (
            <div key={order.id} className="glass-panel overflow-hidden transition-all hover:shadow-xl hover:border-primary/20 hover:-translate-y-1 group">
              <div className="border-b border-border/50 bg-secondary/30 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                  <div>
                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider block mb-1">Order ID</span>
                    <span className="font-mono font-bold">#{order.id}</span>
                  </div>
                  <div className="hidden sm:block w-px h-8 bg-border/50"></div>
                  <div>
                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider block mb-1">Date</span>
                    <span className="font-medium flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-primary" />
                      {new Date(order.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="hidden sm:block w-px h-8 bg-border/50"></div>
                  <div>
                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider block mb-1">Total</span>
                    <span className="font-bold text-primary">₵{order.total_amount?.toFixed(2) || '0.00'}</span>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(order.status)}`}>
                    {formatStatusLabel(order.status)}
                  </span>
                  {order.payment_status === 'pending' && order.status === 'pending_payment' && (
                    <span className="text-xs text-amber-500 font-medium animate-pulse flex items-center gap-1">
                      Awaiting Payment
                    </span>
                  )}
                </div>
              </div>
              
              <div className="p-4 sm:p-5 sm:flex justify-between items-center bg-background/50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Package className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Shipping to: {order.shipping_address_id ? 'Saved Address' : 'Default'}
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-2 sm:gap-3">
                  {order.status === 'pending_payment' ? (
                    <button className="w-full sm:w-auto inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 shadow-lg shadow-primary/25">
                      Pay Now
                    </button>
                  ) : (
                    <button className="w-full sm:w-auto inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                      Track Package
                    </button>
                  )}
                  <button className="w-full sm:w-auto inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
