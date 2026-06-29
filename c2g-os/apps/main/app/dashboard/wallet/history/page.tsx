import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ArrowDownToLine, ArrowUpRight, History, Clock, XCircle, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import HistorySearchClient from "./search-client";

export const metadata = { title: "Wallet History | C2G Logistics" };

export default async function WalletHistoryPage({ searchParams }: { searchParams: Promise<{ page?: string, q?: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: customer } = await supabase
    .from("customers")
    .select("id")
    .eq("id", user.id)
    .single();

  if (!customer) return <div>Customer not found.</div>;

  const { data: wallet } = await supabase
    .from("wallets")
    .select("id")
    .eq("customer_id", customer.id)
    .single();

  if (!wallet) return <div>Wallet not found.</div>;

  const awaitedParams = await searchParams;
  const page = parseInt(awaitedParams?.page || "1", 10);
  const q = awaitedParams?.q || "";
  const itemsPerPage = 20;
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage - 1;

  let query = supabase
    .from("wallet_transactions")
    .select("*", { count: "exact" })
    .eq("wallet_id", wallet.id);

  if (q) {
    // Search by reference_id or amount
    const amountQ = isNaN(Number(q)) ? -999999 : Number(q);
    query = query.or(`reference_id.ilike.%${q}%,amount.eq.${amountQ}`);
  }

  const { data: transactions, count } = await query
    .order("created_at", { ascending: false })
    .range(start, end);

  const totalPages = count ? Math.ceil(count / itemsPerPage) : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/wallet" className="p-2 -ml-2 rounded-full hover:bg-secondary transition-colors">
            <ChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <History className="w-6 h-6 text-primary" /> Wallet History
        </h1>
      </div>

      <HistorySearchClient initialQuery={q} />

      <div className="glass-panel p-6">
        {(!transactions || transactions.length === 0) ? (
          <div className="text-center py-12 text-muted-foreground">
            <History className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No transactions found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((tx: any) => {
              const isPositive = Number(tx.amount) > 0;
              const isPending = tx.status === 'pending';
              const isFailed = tx.status === 'failed' || tx.status === 'cancelled';
              
              let iconBgColor = isPositive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500';
              let amountColor = isPositive ? 'text-emerald-500' : 'text-foreground';
              
              if (isPending) {
                iconBgColor = 'bg-yellow-500/10 text-yellow-500';
                amountColor = 'text-yellow-500';
              } else if (isFailed) {
                iconBgColor = 'bg-zinc-500/10 text-zinc-500';
                amountColor = 'text-zinc-500 line-through';
              }

              return (
                <div key={tx.id} className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-background/50 hover:bg-background transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${iconBgColor}`}>
                      {isPending ? <Clock className="w-5 h-5" /> : 
                       isFailed ? <XCircle className="w-5 h-5" /> : 
                       isPositive ? <ArrowDownToLine className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm capitalize">{tx.transaction_type.replace(/_/g, ' ')}</p>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-sm uppercase tracking-wider font-bold ${
                          tx.status === 'completed' ? 'bg-emerald-500/20 text-emerald-500' :
                          tx.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                          'bg-red-500/20 text-red-500'
                        }`}>
                          {tx.status}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground font-mono mt-1">Ref: {tx.reference_id || 'N/A'}</p>
                      <p className="text-[10px] text-zinc-500 mt-1">{new Date(tx.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className={`font-bold ${amountColor}`}>
                    {isPositive && !isFailed ? '+' : ''}₵{Math.abs(Number(tx.amount)).toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {totalPages > 1 && (
            <div className="mt-8 pt-6 border-t border-border/50 flex justify-center items-center gap-4">
                <Link 
                    href={`/dashboard/wallet/history?page=${page - 1}${q ? `&q=${q}` : ''}`}
                    className={`p-2 rounded-xl border border-border/50 ${page <= 1 ? 'opacity-50 pointer-events-none' : 'hover:bg-secondary'}`}
                >
                    <ChevronLeft className="w-5 h-5" />
                </Link>
                <span className="text-sm font-medium">Page {page} of {totalPages}</span>
                <Link 
                    href={`/dashboard/wallet/history?page=${page + 1}${q ? `&q=${q}` : ''}`}
                    className={`p-2 rounded-xl border border-border/50 ${page >= totalPages ? 'opacity-50 pointer-events-none' : 'hover:bg-secondary'}`}
                >
                    <ChevronRight className="w-5 h-5" />
                </Link>
            </div>
        )}
      </div>
    </div>
  );
}
