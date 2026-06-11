import { Bell, Package, CreditCard, Link as LinkIcon, CheckCircle2 } from "lucide-react";

export default function NotificationsPage() {
  const notifications = [
    {
      id: 1,
      type: "package",
      icon: Package,
      title: "Package Received in Warehouse",
      message: "Your package (Tracking: YT89938221123) has safely arrived at the Guangzhou warehouse and is ready for consolidation.",
      time: "2 hours ago",
      read: false,
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      id: 2,
      type: "invoice",
      icon: CreditCard,
      title: "New Invoice Generated",
      message: "Invoice INV-2026-001 for shipping fees has been generated. Please clear your balance to avoid shipping delays.",
      time: "5 hours ago",
      read: false,
      color: "text-destructive",
      bg: "bg-destructive/10"
    },
    {
      id: 3,
      type: "order",
      icon: LinkIcon,
      title: "Link Order Purchased",
      message: "Good news! We have successfully purchased your 'Nike Air Max Pro' from the supplier.",
      time: "Yesterday",
      read: true,
      color: "text-primary",
      bg: "bg-primary/10"
    },
    {
      id: 4,
      type: "system",
      icon: CheckCircle2,
      title: "Account Verified",
      message: "Your C2G Logistics account has been fully verified. You can now use all platform features.",
      time: "2 days ago",
      read: true,
      color: "text-green-500",
      bg: "bg-green-500/10"
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground mt-1">Stay updated on your packages, orders, and account alerts.</p>
        </div>
        <button className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
          Mark all as read
        </button>
      </div>

      <div className="glass-panel p-0 overflow-hidden divide-y divide-border/50">
        {notifications.map((notif) => {
          const Icon = notif.icon;
          return (
            <div key={notif.id} className={`p-4 md:p-6 flex gap-4 transition-colors hover:bg-muted/50 ${notif.read ? 'opacity-70' : 'bg-primary/5'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${notif.bg}`}>
                <Icon className={`w-5 h-5 ${notif.color}`} />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className={`text-sm font-semibold ${notif.read ? 'text-foreground' : 'text-primary'}`}>
                    {notif.title}
                  </h4>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{notif.time}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {notif.message}
                </p>
              </div>
              {!notif.read && (
                <div className="w-2 h-2 bg-primary rounded-full shrink-0 mt-1.5 shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
