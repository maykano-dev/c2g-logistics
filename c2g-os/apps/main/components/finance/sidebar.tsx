"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Wallet, 
  CreditCard, 
  Truck, 
  Receipt, 
  FileText, 
  Settings,
  Banknote,
  Users
} from "lucide-react";

const navItems = [
  { name: "Overview", href: "/finance", icon: LayoutDashboard },
  { name: "Wallets", href: "/finance/wallets", icon: Wallet },
  { name: "Payments", href: "/finance/payments", icon: CreditCard },
  { name: "Shipping Fees", href: "/finance/shipping", icon: Truck },
  { name: "Withdrawals", href: "/finance/withdrawals", icon: Banknote },
  { name: "Refunds", href: "/finance/refunds", icon: Receipt },
  { name: "Expenses", href: "/finance/expenses", icon: FileText },
  { name: "Customer Debt", href: "/finance/debt", icon: Users },
  { name: "Settings", href: "/finance/settings", icon: Settings },
];

export default function FinanceSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-zinc-950 border-r border-zinc-800 text-zinc-300">
      <div className="p-6 border-b border-zinc-800">
        <Link href="/finance" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-600/20">
            C2G
          </div>
          <div>
            <h1 className="font-bold text-zinc-100 tracking-tight text-lg">Finance ERP</h1>
            <p className="text-xs text-indigo-400 font-medium">Enterprise Module</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = item.href === '/finance' 
            ? pathname === '/finance' 
            : (pathname === item.href || pathname.startsWith(`${item.href}/`));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-indigo-500/10 text-indigo-400"
                  : "hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? "text-indigo-400" : "text-zinc-500"}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-zinc-800">
        <div className="bg-zinc-900 rounded-lg p-4">
          <div className="text-xs text-zinc-500 uppercase tracking-wider font-bold mb-2">Security</div>
          <div className="flex items-center gap-2 text-sm text-green-500">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Audit Logging Active
          </div>
        </div>
      </div>
    </div>
  );
}
