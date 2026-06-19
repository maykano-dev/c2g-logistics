import { 
  Package, 
  PlaneTakeoff, 
  Link as LinkIcon, 
  MapPin, 
  FileText,
  PlusCircle,
  CreditCard,
  Clock,
  Activity,
  Bell,
  ShoppingCart
} from "lucide-react";
import Link from "next/link";
import { getDashboardStats, getRecentActivity } from "./actions";

// Format relative time (e.g., "2 hours ago")
function getRelativeTime(dateString: string) {
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const daysDifference = Math.round((new Date(dateString).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  
  if (Math.abs(daysDifference) < 1) {
    const hoursDifference = Math.round((new Date(dateString).getTime() - new Date().getTime()) / (1000 * 60 * 60));
    if (Math.abs(hoursDifference) < 1) {
      const minutesDifference = Math.round((new Date(dateString).getTime() - new Date().getTime()) / (1000 * 60));
      return rtf.format(minutesDifference, 'minute');
    }
    return rtf.format(hoursDifference, 'hour');
  }
  return rtf.format(daysDifference, 'day');
}

export default async function DashboardOverview() {
  const stats = await getDashboardStats();
  const recentActivities = await getRecentActivity();

  // If user is not authenticated or there was an error
  if (!stats) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Please log in to view your dashboard.
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-1">Welcome back, {stats.userName}! Here's what's happening with your imports.</p>
      </div>

      {/* Summary Cards - Mobile Horizontal Scroll, Desktop Grid */}
      <div className="-mx-4 md:mx-0 px-4 md:px-0">
        <div className="flex md:grid grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto snap-x hide-scrollbar pb-4 md:pb-0">
          {[
            { label: "Orders in Transit", value: stats.transitOrdersCount, icon: PlaneTakeoff, color: "text-blue-500", bg: "bg-blue-500/10" },
            { label: "Ready for Pickup", value: stats.readyForPickupCount, icon: Package, color: "text-green-500", bg: "bg-green-500/10" },
            { label: "Total Mall Orders", value: stats.mallOrdersCount, icon: FileText, color: "text-purple-500", bg: "bg-purple-500/10" },
            { label: "Pending Payments", value: stats.pendingPaymentsCount, icon: CreditCard, color: "text-red-500", bg: "bg-red-500/10" },
            { label: "Active Shipments", value: stats.activeShipmentsCount, icon: PlaneTakeoff, color: "text-blue-500", bg: "bg-blue-500/10" },
            { label: "In Warehouse", value: stats.inWarehouseCount, icon: MapPin, color: "text-purple-500", bg: "bg-purple-500/10" },
            { label: "Incoming Packages", value: stats.incomingPackagesCount, icon: Package, color: "text-orange-500", bg: "bg-orange-500/10" },
            { label: "Link Orders", value: stats.linkOrdersCount, icon: LinkIcon, color: "text-primary", bg: "bg-primary/10" },
          ].map((card, idx) => (
            <div key={idx} className="glass-panel p-5 flex flex-col justify-between group hover:border-primary/50 transition-colors snap-center min-w-[200px] md:min-w-0 flex-shrink-0 relative overflow-hidden">
              <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-[40px] -mr-10 -mt-10 pointer-events-none opacity-50 ${card.bg}`} />
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2.5 rounded-xl ${card.bg}`}>
                  <card.icon className={`w-5 h-5 ${card.color}`} />
                </div>
              </div>
              <div>
                <p className="text-3xl font-black text-foreground tracking-tight">{card.value}</p>
                <p className="text-sm text-muted-foreground font-semibold leading-tight mt-1">{card.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Quick Actions - 2x2 Grid on Mobile */}
        <div className="glass-panel p-6 flex flex-col h-full order-first lg:order-none lg:col-span-1 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[60px] -mr-20 -mt-20 pointer-events-none" />
          <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 lg:flex lg:flex-col gap-3">
            <Link href="/dashboard/link-orders/new" className="flex flex-col lg:flex-row items-start lg:items-center gap-3 p-4 rounded-xl border border-border/50 bg-secondary/30 hover:bg-primary/10 hover:border-primary/30 transition-all group backdrop-blur-sm">
              <div className="p-2.5 bg-primary/20 rounded-xl group-hover:bg-primary group-hover:text-primary-foreground transition-colors shadow-sm">
                <LinkIcon className="w-5 h-5 text-primary group-hover:text-current" />
              </div>
              <div className="flex-1 mt-2 lg:mt-0">
                <p className="font-bold text-sm lg:text-base">Place Link Order</p>
                <p className="text-xs text-muted-foreground hidden lg:block">Buy for me service</p>
              </div>
              <PlusCircle className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors hidden lg:block" />
            </Link>

            <Link href="/dashboard/packages/register" className="flex flex-col lg:flex-row items-start lg:items-center gap-3 p-4 rounded-xl border border-border/50 bg-secondary/30 hover:bg-primary/10 hover:border-primary/30 transition-all group backdrop-blur-sm">
              <div className="p-2.5 bg-green-500/20 rounded-xl group-hover:bg-green-500 group-hover:text-white transition-colors shadow-sm">
                <Package className="w-5 h-5 text-green-500 group-hover:text-current" />
              </div>
              <div className="flex-1 mt-2 lg:mt-0">
                <p className="font-bold text-sm lg:text-base">Register Package</p>
                <p className="text-xs text-muted-foreground hidden lg:block">Add incoming tracking</p>
              </div>
              <PlusCircle className="w-5 h-5 text-muted-foreground group-hover:text-green-500 transition-colors hidden lg:block" />
            </Link>

            <Link href="/dashboard/invoices" className="flex flex-col lg:flex-row items-start lg:items-center gap-3 p-4 rounded-xl border border-border/50 bg-secondary/30 hover:bg-primary/10 hover:border-primary/30 transition-all group backdrop-blur-sm">
              <div className="p-2.5 bg-red-500/20 rounded-xl group-hover:bg-red-500 group-hover:text-white transition-colors shadow-sm">
                <CreditCard className="w-5 h-5 text-red-500 group-hover:text-current" />
              </div>
              <div className="flex-1 mt-2 lg:mt-0">
                <p className="font-bold text-sm lg:text-base">Pay Invoice</p>
                <p className="text-xs text-muted-foreground hidden lg:block">Clear outstanding dues</p>
              </div>
            </Link>

            <Link href="/dashboard/warehouse" className="flex flex-col lg:flex-row items-start lg:items-center gap-3 p-4 rounded-xl border border-border/50 bg-secondary/30 hover:bg-primary/10 hover:border-primary/30 transition-all group backdrop-blur-sm">
              <div className="p-2.5 bg-purple-500/20 rounded-xl group-hover:bg-purple-500 group-hover:text-white transition-colors shadow-sm">
                <MapPin className="w-5 h-5 text-purple-500 group-hover:text-current" />
              </div>
              <div className="flex-1 mt-2 lg:mt-0">
                <p className="font-bold text-sm lg:text-base">Warehouse Address</p>
                <p className="text-xs text-muted-foreground hidden lg:block">View shipping details</p>
              </div>
            </Link>

            <Link href="/shop" className="flex flex-col lg:flex-row items-start lg:items-center gap-3 p-4 rounded-xl border border-border/50 bg-secondary/30 hover:bg-primary/10 hover:border-primary/30 transition-all group lg:mt-auto backdrop-blur-sm">
              <div className="p-2.5 bg-blue-500/20 rounded-xl group-hover:bg-blue-500 group-hover:text-white transition-colors shadow-sm">
                <ShoppingCart className="w-5 h-5 text-blue-500 group-hover:text-current" />
              </div>
              <div className="flex-1 mt-2 lg:mt-0">
                <p className="font-bold text-sm lg:text-base">Go to C2G Mall</p>
                <p className="text-xs text-muted-foreground hidden lg:block">Shop directly from China</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 glass-panel p-6 lg:order-none relative overflow-hidden">
          <div className="flex items-center justify-between mb-8 relative z-10">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Recent Activity
            </h2>
            <Link href="/dashboard/notifications" className="text-sm text-primary hover:underline font-semibold bg-primary/10 px-3 py-1.5 rounded-full transition-colors hover:bg-primary/20">
              View All
            </Link>
          </div>
          <div className="space-y-6 relative z-10">
            {recentActivities && recentActivities.length > 0 ? (
              recentActivities.map((activity, idx) => (
                <div key={activity.id} className="flex gap-5 group">
                  <div className="relative mt-0.5">
                    <div className="w-10 h-10 rounded-full bg-secondary border border-border/50 flex items-center justify-center z-10 relative group-hover:scale-110 group-hover:bg-primary/10 group-hover:border-primary/30 group-hover:text-primary transition-all shadow-sm">
                      <Bell className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    {idx !== recentActivities.length - 1 && <div className="absolute top-10 bottom-[-24px] left-1/2 w-[2px] bg-border/50 -translate-x-1/2 group-hover:bg-primary/30 transition-colors" />}
                  </div>
                  <div className="pb-2">
                    <p className="font-bold text-foreground text-sm">{activity.title || activity.type}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">{activity.message}</p>
                    <p className="text-[11px] font-semibold text-muted-foreground/70 mt-2 flex items-center gap-1.5 uppercase tracking-wider">
                      <Clock className="w-3 h-3" /> {getRelativeTime(activity.created_at)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground bg-secondary/20 rounded-2xl border border-dashed border-border/50">
                <div className="w-16 h-16 bg-secondary/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-border/50">
                  <Activity className="w-6 h-6 opacity-40" />
                </div>
                <p className="font-medium text-foreground">No recent activity yet.</p>
                <p className="text-sm mt-1">When your packages move, you'll see it here.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
