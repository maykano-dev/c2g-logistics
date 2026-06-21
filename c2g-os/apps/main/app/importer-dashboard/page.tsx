import { ShoppingBag, TrendingUp, Package, Wallet } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { getWalletStats } from "./wallet/actions";
import { getImporterOrders } from "./orders/actions";

export default async function ImporterDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: importer } = await supabase
    .from('importers')
    .select('id, wallet_balance')
    .eq('user_id', user?.id)
    .single();

  const { stats: walletStats } = await getWalletStats();
  const ordersResponse = await getImporterOrders();
  const recentOrders = ordersResponse.success ? (ordersResponse.orders || []) : [];

  const activeProductsCount = await supabase
    .from('products')
    .select('id', { count: 'exact', head: true })
    .eq('importer_id', importer?.id)
    .eq('status', 'published')
    .then(res => res.count || 0);

  const walletBalance = walletStats?.wallet_balance || 0;

  const stats = [
    { name: "Total Orders", value: recentOrders.length.toString(), icon: ShoppingBag, color: "text-blue-500", bg: "bg-blue-500/10" },
    { name: "Available Profit", value: `₵${walletBalance.toFixed(2)}`, icon: Wallet, color: "text-green-500", bg: "bg-green-500/10" },
    { name: "Active Products", value: activeProductsCount.toString(), icon: Package, color: "text-amber-500", bg: "bg-amber-500/10" },
    { name: "Conversion Rate", value: "24.5%", icon: TrendingUp, color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto pb-24 md:pb-0">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <p className="text-muted-foreground mt-1">Monitor your store performance and profits.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="glass-panel p-6 shadow-lg border-border/50 relative overflow-hidden group">
              <div className="flex items-center justify-between mb-4 relative z-10">
                <span className="text-sm font-semibold text-muted-foreground">{stat.name}</span>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bg}`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
              <div className="flex items-baseline gap-2 relative z-10">
                <span className="text-3xl font-black">{stat.value}</span>
              </div>
              <div className={`absolute -bottom-8 -right-8 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 ${stat.bg}`} />
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders Placeholder */}
        <div className="lg:col-span-2 glass-panel p-6 shadow-lg border-border/50 overflow-x-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Recent Orders</h2>
            <a href="/importer-dashboard/orders" className="text-sm font-bold text-primary hover:underline">View All</a>
          </div>
          
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b border-border/50">
                <th className="pb-3 text-sm font-semibold text-muted-foreground">Order ID</th>
                <th className="pb-3 text-sm font-semibold text-muted-foreground">Customer</th>
                <th className="pb-3 text-sm font-semibold text-muted-foreground">Amount</th>
                <th className="pb-3 text-sm font-semibold text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.slice(0, 5).map((order) => (
                <tr key={order.id} className="border-b border-border/10 last:border-0 hover:bg-secondary/20 transition-colors">
                  <td className="py-4 text-sm font-medium">{order.id}</td>
                  <td className="py-4 text-sm">{order.customer_name}</td>
                  <td className="py-4 text-sm font-bold">₵{order.amount_ghs.toFixed(2)}</td>
                  <td className="py-4 text-sm">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                      order.status === 'delivered' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                      order.status === 'processing' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                      order.status === 'shipped' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                      'bg-secondary text-muted-foreground border border-border'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-muted-foreground text-sm">
                    No recent orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Quick Actions */}
        <div className="glass-panel p-6 shadow-lg border-border/50">
          <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <a href="/importer-dashboard/products/new" className="flex items-center gap-4 p-4 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors border border-border group">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <Package className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="block font-bold">Add Product</span>
                <span className="text-xs text-muted-foreground">Upload an item from 1688</span>
              </div>
            </a>
            
            <a href="/importer-dashboard/wallet" className="w-full flex items-center gap-4 p-4 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors border border-border group">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform">
                <Wallet className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="block font-bold">Withdraw Profits</span>
                <span className="text-xs text-muted-foreground">Transfer to Mobile Money</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
