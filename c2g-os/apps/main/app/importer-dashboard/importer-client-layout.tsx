"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Bell, Menu, X, ArrowLeft, Store, Package, ShoppingBag, Wallet, Settings } from "lucide-react";
import { logout } from "../auth/actions";
import { useState, useEffect } from "react";
import { getNotifications } from "@/app/dashboard/notifications/actions";

export default function ImporterDashboardClientLayout({
  children,
  user,
  importer,
}: {
  children: React.ReactNode;
  user: any;
  importer: any;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    async function loadNotifs() {
      const data = await getNotifications();
      const unread = data.filter((n: any) => !n.is_read).length;
      setUnreadCount(unread);
    }
    loadNotifs();
  }, [pathname]);

  const navLinks = [
    { name: "Overview", href: "/importer-dashboard", icon: Store },
    { name: "Products", href: "/importer-dashboard/products", icon: Package },
    { name: "Orders", href: "/importer-dashboard/orders", icon: ShoppingBag },
    { name: "Profits & Wallet", href: "/importer-dashboard/wallet", icon: Wallet },
    { name: "Settings", href: "/importer-dashboard/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row relative">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-secondary/20 border-r border-border/50 sticky top-0 h-screen overflow-y-auto z-50 backdrop-blur-xl">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-primary-foreground font-bold text-xl">
                {importer.business_name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-foreground block leading-none">
                {importer.business_name}
              </span>
              <span className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">
                Importer Portal
              </span>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/importer-dashboard" && pathname.startsWith(link.href));
            const Icon = link.icon;
            return (
              <Link 
                key={link.name} 
                href={link.href} 
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors ${
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                }`}
              >
                <Icon className="w-5 h-5" />
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border/50 space-y-2">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-white/5 hover:text-foreground transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" />
            Switch to Customer view
          </Link>
          <form action={logout}>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-destructive hover:bg-destructive/10 transition-colors text-sm">
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen relative w-full overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden h-16 bg-background/80 backdrop-blur-xl border-b border-border/50 flex items-center justify-between px-4 sticky top-0 z-40 w-full">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">
                {importer.business_name.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="font-bold tracking-tight text-foreground">{importer.business_name}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Link href="/importer-dashboard/notifications" className="relative p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-secondary">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-background" />
              )}
            </Link>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 -mr-2">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </header>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 top-16 bg-background/95 backdrop-blur-xl z-30 p-4 border-t border-border/50 animate-fade-in">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== "/importer-dashboard" && pathname.startsWith(link.href));
                const Icon = link.icon;
                return (
                  <Link 
                    key={link.name} 
                    href={link.href} 
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-4 rounded-xl font-medium transition-colors ${
                      isActive 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-secondary text-foreground"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}

        {/* Desktop Header */}
        <header className="hidden md:flex h-16 bg-background/50 backdrop-blur-sm border-b border-border/50 items-center justify-between px-8 sticky top-0 z-40 w-full shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Store URL:</span>
            <a href={`/store/${importer.store_slug}`} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-primary hover:underline">
              c2g-logistics.com/store/{importer.store_slug}
            </a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/importer-dashboard/notifications" className="relative p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-white/10 group">
              <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {unreadCount > 0 && (
                <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-background shadow-sm shadow-red-500/50 animate-pulse" />
              )}
            </Link>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-4 md:p-8 z-0 w-full overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
