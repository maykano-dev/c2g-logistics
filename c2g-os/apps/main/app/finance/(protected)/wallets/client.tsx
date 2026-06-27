"use client";

import { useState } from "react";
import { Search, Wallet, AlertCircle, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function WalletSearchClient({ initialWallets, initialQuery }: { initialWallets: any[], initialQuery: string }) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/finance/wallets?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-4 max-w-2xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email, phone, or wallet ID..."
            className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>
        <button type="submit" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition-colors">
          Search
        </button>
      </form>

      {/* Results Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-400">
            <thead className="bg-zinc-950/50 text-zinc-500 font-medium">
              <tr>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Wallet ID</th>
                <th className="px-6 py-4">Available Balance</th>
                <th className="px-6 py-4">Held Balance</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {initialWallets.map((wallet) => (
                <tr key={wallet.id} className="hover:bg-zinc-800/20 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-bold text-zinc-200">{wallet.customers?.name || "Unknown"}</div>
                    <div className="text-xs text-zinc-500">{wallet.customers?.email} &middot; {wallet.customers?.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs bg-zinc-950 px-2 py-1 rounded border border-zinc-800">
                      {wallet.id.split('-')[0]}...
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-zinc-200">
                      ₵{parseFloat(wallet.available_balance).toLocaleString(undefined, {minimumFractionDigits: 2})}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-zinc-500">
                      ₵{parseFloat(wallet.held_balance).toLocaleString(undefined, {minimumFractionDigits: 2})}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {wallet.isFrozen ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-bold bg-rose-500/10 text-rose-500">
                        <AlertCircle className="w-3.5 h-3.5" /> Frozen
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-bold bg-emerald-500/10 text-emerald-500">
                        <Wallet className="w-3.5 h-3.5" /> Active
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/finance/wallets/${wallet.id}`}
                      className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-medium text-sm transition-colors opacity-0 group-hover:opacity-100"
                    >
                      View Ledger <ChevronRight className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
              
              {initialWallets.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                    No wallets found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
