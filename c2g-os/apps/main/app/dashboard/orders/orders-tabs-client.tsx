"use client";

import { useState } from "react";
import { Link as LinkIcon, ShoppingBag, PackageSearch } from "lucide-react";
import Link from "next/link";
import { LinkOrderCard } from "./link-order-card";
import { MallOrderCard } from "./mall-order-card";

export default function OrdersTabsClient({ 
  linkOrders, 
  mallOrders 
}: { 
  linkOrders: any[];
  mallOrders: any[];
}) {
  const [activeTab, setActiveTab] = useState<"link" | "mall">("link");

  return (
    <div className="space-y-6">
      {/* Tabs Navigation */}
      <div className="flex p-1 bg-secondary/50 rounded-xl w-fit border border-border/50 shadow-inner">
        <button
          onClick={() => setActiveTab("link")}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm transition-all duration-300 ${
            activeTab === "link"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <LinkIcon className="w-4 h-4" />
          Link Orders
          <span className="ml-1.5 px-2 py-0.5 rounded-md bg-secondary text-xs">{linkOrders.length}</span>
        </button>
        <button
          onClick={() => setActiveTab("mall")}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm transition-all duration-300 ${
            activeTab === "mall"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-white/5"
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          Mall Orders
          <span className={`ml-1.5 px-2 py-0.5 rounded-md text-xs ${activeTab === "mall" ? "bg-black/20 text-white" : "bg-secondary"}`}>
            {mallOrders.length}
          </span>
        </button>
      </div>

      {/* Tabs Content */}
      <div className="relative">
        {/* Link Orders Tab */}
        {activeTab === "link" && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {linkOrders.length > 0 ? (
              linkOrders.map((order: any) => (
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
                  href="/dashboard/orders/new" 
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-6 gap-2"
                >
                  Place Your First Order
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Mall Orders Tab */}
        {activeTab === "mall" && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {mallOrders.length > 0 ? (
              mallOrders.map((order: any) => (
                <MallOrderCard key={order.id} order={order} />
              ))
            ) : (
              <div className="glass-panel p-12 text-center flex flex-col items-center justify-center border-dashed">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <ShoppingBag className="w-8 h-8 text-primary opacity-50" />
                </div>
                <h3 className="text-xl font-bold mb-2">No Mall Orders Yet</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                  You haven't purchased anything directly from the C2G Mall yet.
                </p>
                <Link 
                  href="/shop" 
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 gap-2"
                >
                  Browse the Mall
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
