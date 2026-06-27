"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  Link as LinkIcon, 
  FileText, 
  Settings, 
  MapPin,
  Bell,
  LogOut,
  Menu,
  X,
  ShoppingCart,
  ClipboardList,
  Heart,
  Wallet
} from "lucide-react";
import { logout } from "../auth/actions";
import { useWishlist } from "@/components/shop/wishlist-context";

export default function DashboardClientLayout({
  children,
  stats,
  walletBalance = 0,
}: {
  children: React.ReactNode;
  stats?: any;
  walletBalance?: number;
}) {
  const pathname = usePathname();
  const { items: wishlistItems } = useWishlist();

  const navLinks = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { 
      name: "Packages", 
      href: "/dashboard/packages", 
      icon: Package,
      count: stats?.pendingPackagesCount || 0
    },
    { 
      name: "Orders", 
      href: "/dashboard/orders", 
      icon: ClipboardList,
      count: stats?.pendingPaymentsCount || 0
    },
    { name: "Warehouse", href: "/dashboard/warehouse", icon: MapPin },
    { name: "Wallet", href: "/dashboard/wallet", icon: Wallet },
  ];

  return (
    <div className="h-screen h-[100dvh] overflow-hidden bg-background flex flex-col md:flex-row relative">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 glass border-r border-border/50 sticky top-0 h-screen overflow-y-auto z-50 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
        <div className="p-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-10 h-10 relative flex items-center justify-center">
              <Image src="/logo.png" alt="C2G Logistics Logo" fill sizes="32px" className="object-contain" />
            </div>
            <span className="font-bold text-xl tracking-tight">C2G Logistics</span>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(link.href));
            const Icon = link.icon;
            return (
              <Link 
                key={link.name} 
                href={link.href} 
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg font-medium transition-colors ${
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-md" 
                    : "text-muted-foreground hover:bg-white/5 dark:hover:bg-black/20 hover:text-foreground"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  {link.name}
                </div>
                {link.count > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${isActive ? 'bg-white/20 text-white' : 'bg-destructive/10 text-destructive'}`}>
                    {link.count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border/50">
          <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-white/5 dark:hover:bg-black/20 hover:text-foreground transition-colors">
            <Settings className="w-5 h-5" />
            Settings
          </Link>
          <form action={logout}>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-destructive hover:bg-destructive/10 transition-colors mt-2">
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen relative w-full overflow-y-auto overflow-x-hidden">
        {/* Dynamic Background Elements */}
        <div className="fixed top-[-20%] right-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[150px] rounded-full animate-pulse -z-10" />
        <div className="fixed bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/10 blur-[120px] rounded-full animate-pulse delay-1000 -z-10" />

        {/* Mobile Header */}
        <header className="md:hidden h-[calc(3.5rem+env(safe-area-inset-top))] pt-[env(safe-area-inset-top)] glass border-b border-border/50 flex items-center justify-between px-4 sticky top-0 z-40 w-full shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 relative flex items-center justify-center -ml-1 shrink-0">
              <Image src="/logo.png" alt="C2G Logistics Logo" fill sizes="32px" className="object-contain" />
            </div>
            <span className="font-bold tracking-tight text-foreground hidden [@media(min-width:400px)]:block truncate">C2G Logistics</span>
          </div>
          
          <div className="flex items-center gap-2 shrink-0">
            <Link href="/dashboard/notifications" className="relative p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full shrink-0">
              <Bell className="w-5 h-5" />
              {stats?.unreadNotificationsCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-destructive text-[9px] font-bold text-white flex items-center justify-center rounded-full border border-background">
                  {stats.unreadNotificationsCount > 9 ? '9+' : stats.unreadNotificationsCount}
                </span>
              )}
            </Link>
            <Link href="/dashboard/wallet" className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-tr from-primary/10 to-accent/10 border border-border hover:bg-white/10 transition-colors shadow-sm min-w-0">
              <Wallet className="w-4 h-4 text-primary shrink-0" />
              <span className="text-sm font-bold tracking-tight truncate">₵{new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(walletBalance)}</span>
            </Link>
            <Link href="/dashboard/settings" className="w-7 h-7 rounded-full bg-gradient-to-tr from-primary to-accent border-2 border-background shadow-sm flex items-center justify-center overflow-hidden shrink-0">
              <Settings className="w-3.5 h-3.5 text-white mix-blend-overlay" />
            </Link>
          </div>
        </header>

        {/* Desktop Header */}
        <header className="hidden md:flex h-[calc(4rem+env(safe-area-inset-top))] pt-[env(safe-area-inset-top)] glass border-b border-border/50 items-center justify-end px-6 sticky top-0 z-40 w-full shrink-0">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/notifications" className="relative p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-white/10 dark:hover:bg-black/20 shrink-0">
              <Bell className="w-5 h-5" />
              {stats?.unreadNotificationsCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-destructive text-[9px] font-bold text-white flex items-center justify-center rounded-full border border-background">
                  {stats.unreadNotificationsCount > 9 ? '9+' : stats.unreadNotificationsCount}
                </span>
              )}
            </Link>
            <Link href="/dashboard/wallet" className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-tr from-primary/10 to-accent/10 border border-border hover:bg-white/10 transition-colors shadow-sm min-w-0 max-w-[200px]">
              <Wallet className="w-4 h-4 text-primary shrink-0" />
              <span className="text-sm font-bold tracking-tight truncate">₵{new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(walletBalance)}</span>
            </Link>
            <Link href="/dashboard/settings" className="shrink-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-accent border-2 border-background shadow-sm hover:scale-105 transition-transform" />
            </Link>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-4 md:p-6 lg:p-8 pb-[calc(8rem+env(safe-area-inset-bottom))] md:pb-8 z-0 w-full">
          {children}
        </div>
      </main>

      <AnnouncementsOverlay />

      {/* Mobile Bottom Navigation — Liquid Glass Animated Pill */}
      <MobileNav navLinks={navLinks as any} pathname={pathname} />
    </div>
  );
}

// Separate client component for the animated nav to avoid hook issues
import { motion } from "framer-motion";
import AnnouncementsOverlay from "../../components/dashboard/announcements-overlay";

function MobileNav({
  navLinks,
  pathname,
}: {
  navLinks: { name: string; href: string; icon: React.ElementType; count?: number }[];
  pathname: string;
}) {
  return (
    <nav className="md:hidden fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-[380px]">
      {/* Outer fully-pill liquid glass shell */}
      <div
        className="relative flex items-center justify-between rounded-full p-2"
        style={{
          background: "rgba(20, 25, 40, 0.45)",
          backdropFilter: "blur(32px) saturate(200%)",
          WebkitBackdropFilter: "blur(32px) saturate(200%)",
          border: "1px solid rgba(255,255,255,0.15)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.2)",
        }}
      >
        {/* Top-edge ambient highlight */}
        <div
          className="absolute top-0 left-[15%] right-[15%] h-px rounded-full pointer-events-none"
          style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)" }}
        />

        {navLinks.map((link) => {
          const isActive =
            pathname === link.href ||
            (link.href !== "/dashboard" && pathname.startsWith(link.href));
          const Icon = link.icon;
          const shortName = link.name.split(" ")[0]; // e.g., "Link Orders" -> "Link"

          return (
            <Link
              key={link.name}
              href={link.href}
              className={`relative flex items-center justify-center h-12 rounded-full transition-all duration-300 ease-out z-10 ${
                isActive ? "px-5" : "w-12 px-0 hover:bg-white/5"
              }`}
            >
              {/* Animated sliding liquid glass active pill */}
              {isActive && (
                <motion.div
                  layoutId="active-nav-pill"
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3), 0 4px 12px rgba(0,0,0,0.2)",
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                  }}
                />
              )}

              {/* Badge Counter overlay */}
              {link.count && link.count > 0 ? (
                <div className={`absolute top-1.5 right-1 z-30 flex items-center justify-center bg-destructive text-white rounded-full text-[9px] font-bold shadow-lg shadow-destructive/40 border border-background/20 transition-all ${isActive ? 'w-4 h-4 right-1' : 'w-4 h-4 right-1'}`}>
                  {link.count > 9 ? '9+' : link.count}
                </div>
              ) : null}

              {/* Icon & Text Container */}
              <div className="relative z-20 flex items-center gap-2">
                <Icon
                  className={`shrink-0 transition-colors duration-300 ${
                    isActive ? "text-white" : "text-white/60"
                  }`}
                  style={{ width: "22px", height: "22px", strokeWidth: isActive ? 2.5 : 2 }}
                />
                
                {isActive && (
                  <motion.span
                    initial={{ opacity: 0, width: 0, scale: 0.8 }}
                    animate={{ opacity: 1, width: "auto", scale: 1 }}
                    exit={{ opacity: 0, width: 0, scale: 0.8 }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                      opacity: { duration: 0.2 },
                    }}
                    className="text-white font-semibold text-[13px] whitespace-nowrap overflow-hidden"
                  >
                    {shortName}
                  </motion.span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
