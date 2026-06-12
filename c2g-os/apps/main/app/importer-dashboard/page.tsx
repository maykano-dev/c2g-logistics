import { ShoppingBag, TrendingUp, Package, Wallet } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

export default async function ImporterDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: importer } = await supabase
    .from('importers')
    .select('id, wallet_balance')
    .eq('user_id', user?.id)
    .single();

  // Fetch some stats (dummy for now until we build the orders flow)
  const stats = [
    { name: "Total Orders", value: "0", icon: ShoppingBag, color: "text-blue-500", bg: "bg-blue-500/10" },
    { name: "Available Profit", value: `₵${importer?.wallet_balance || '0.00'}`, icon: Wallet, color: "text-green-500", bg: "bg-green-500/10" },
    { name: "Active Products", value: "0", icon: Package, color: "text-amber-500", bg: "bg-amber-500/10" },
    { name: "Conversion Rate", value: "0%", icon: TrendingUp, color: "text-purple-500", bg: "bg-purple-500/10" },
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
        <div className="lg:col-span-2 glass-panel p-6 shadow-lg border-border/50">
          <h2 className="text-xl font-bold mb-6">Recent Orders</h2>
          <div className="flex flex-col items-center justify-center text-center py-12 border-2 border-dashed border-border rounded-xl bg-secondary/20">
            <ShoppingBag className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="font-bold mb-2">No orders yet</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-sm">Share your store link with customers to start receiving orders.</p>
          </div>
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
            
            <button className="w-full flex items-center gap-4 p-4 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors border border-border group">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform">
                <Wallet className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="block font-bold">Withdraw Profits</span>
                <span className="text-xs text-muted-foreground">Transfer to Mobile Money</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
