import { 
  Package, 
  PlaneTakeoff, 
  Link as LinkIcon, 
  MapPin, 
  FileText,
  PlusCircle,
  CreditCard,
  Clock
} from "lucide-react";
import Link from "next/link";

export default function DashboardOverview() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening with your imports.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Orders in Transit", value: "3", icon: PlaneTakeoff, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Ready for Pickup", value: "0", icon: Package, color: "text-green-500", bg: "bg-green-500/10" },
          { label: "Total Mall Orders", value: "0", icon: FileText, color: "text-purple-500", bg: "bg-purple-500/10" },
          { label: "Pending Payments", value: "2", icon: CreditCard, color: "text-red-500", bg: "bg-red-500/10" },
          { label: "Active Shipments", value: "0", icon: PlaneTakeoff, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "In Warehouse", value: "0", icon: MapPin, color: "text-purple-500", bg: "bg-purple-500/10" },
          { label: "Incoming Packages", value: "0", icon: Package, color: "text-orange-500", bg: "bg-orange-500/10" },
          { label: "Link Orders", value: "5", icon: LinkIcon, color: "text-primary", bg: "bg-primary/10" },
        ].map((card, idx) => (
          <div key={idx} className="glass-panel p-4 flex flex-col justify-between group hover:border-primary/50 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-lg ${card.bg}`}>
                <card.icon className={`w-4 h-4 md:w-5 md:h-5 ${card.color}`} />
              </div>
            </div>
            <div>
              <p className="text-xl md:text-2xl font-bold text-foreground">{card.value}</p>
              <p className="text-xs md:text-sm text-muted-foreground font-medium leading-tight mt-1">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 glass-panel p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Recent Activity</h2>
            <Link href="/dashboard/activity" className="text-sm text-primary hover:underline font-medium">View All</Link>
          </div>
          <div className="space-y-6">
            {[
              { action: "Shipment Departed", desc: "Batch #SHP-2026-06 arrived at sorting facility.", time: "2 hours ago", icon: PlaneTakeoff },
              { action: "Invoice Generated", desc: "Invoice #INV-0089 created for $120.00.", time: "5 hours ago", icon: FileText },
              { action: "Package Received", desc: "Tracking #TRK998233 received in China Warehouse.", time: "1 day ago", icon: MapPin },
              { action: "Package Registered", desc: "Tracking #TRK112455 registered successfully.", time: "2 days ago", icon: Package },
            ].map((activity, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="relative mt-1">
                  <div className="w-10 h-10 rounded-full bg-secondary/50 border border-border flex items-center justify-center z-10 relative">
                    <activity.icon className="w-4 h-4 text-primary" />
                  </div>
                  {idx !== 3 && <div className="absolute top-10 bottom-[-24px] left-1/2 w-px bg-border -translate-x-1/2" />}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">{activity.desc}</p>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass-panel p-6 flex flex-col h-full">
          <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
          <div className="flex flex-col gap-3">
            <Link href="/dashboard/link-orders/new" className="flex items-center gap-3 p-4 rounded-xl border border-border/50 bg-secondary/20 hover:bg-primary/10 hover:border-primary/30 transition-all group">
              <div className="p-2 bg-primary/20 rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <LinkIcon className="w-5 h-5 text-primary group-hover:text-current" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">Place Link Order</p>
                <p className="text-xs text-muted-foreground">Buy for me service</p>
              </div>
              <PlusCircle className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>

            <Link href="/dashboard/packages/register" className="flex items-center gap-3 p-4 rounded-xl border border-border/50 bg-secondary/20 hover:bg-primary/10 hover:border-primary/30 transition-all group">
              <div className="p-2 bg-green-500/20 rounded-lg group-hover:bg-green-500 group-hover:text-white transition-colors">
                <Package className="w-5 h-5 text-green-500 group-hover:text-current" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">Register Package</p>
                <p className="text-xs text-muted-foreground">Add incoming tracking</p>
              </div>
              <PlusCircle className="w-5 h-5 text-muted-foreground group-hover:text-green-500 transition-colors" />
            </Link>

            <Link href="/dashboard/invoices" className="flex items-center gap-3 p-4 rounded-xl border border-border/50 bg-secondary/20 hover:bg-primary/10 hover:border-primary/30 transition-all group">
              <div className="p-2 bg-red-500/20 rounded-lg group-hover:bg-red-500 group-hover:text-white transition-colors">
                <CreditCard className="w-5 h-5 text-red-500 group-hover:text-current" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">Pay Invoice</p>
                <p className="text-xs text-muted-foreground">Clear outstanding dues</p>
              </div>
            </Link>

            <Link href="/dashboard/warehouse" className="flex items-center gap-3 p-4 rounded-xl border border-border/50 bg-secondary/20 hover:bg-primary/10 hover:border-primary/30 transition-all group mt-auto">
              <div className="p-2 bg-purple-500/20 rounded-lg group-hover:bg-purple-500 group-hover:text-white transition-colors">
                <MapPin className="w-5 h-5 text-purple-500 group-hover:text-current" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">Warehouse Address</p>
                <p className="text-xs text-muted-foreground">View shipping details</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
