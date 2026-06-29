import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Wallet, ArrowDownToLine, ArrowUpRight, History, AlertCircle, Clock, XCircle } from "lucide-react";
import TopUpModal from "./top-up-modal";
import Link from "next/link";

export const metadata = { title: "My Wallet | C2G Logistics" };

export default async function WalletPage({ searchParams }: { searchParams: Promise<{ status?: string, ref?: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Handle cancelled top-ups
  const searchParamsAwaited = await searchParams;
  if (searchParamsAwaited?.status === 'cancelled' && searchParamsAwaited?.ref) {
    await supabase
      .from("wallet_transactions")
      .update({ status: 'failed' })
      .eq("reference_id", searchParamsAwaited.ref)
      .eq("status", "pending");
  }

  const { data: customer } = await supabase
    .from("customers")
    .select("id, phone")
    .eq("id", user.id)
    .single();

  if (!customer) {
    return <div className="p-8">Customer profile not found.</div>;
  }

  const { data: wallet } = await supabase
    .from("wallets")
    .select("*")
    .eq("customer_id", customer.id)
    .single();

  if (!wallet) {
    return <div className="p-8">Wallet not found. Please contact support.</div>;
  }

  const { data: transactions } = await supabase
    .from("wallet_transactions")
    .select("*")
    .eq("wallet_id", wallet.id)
    .order("created_at", { ascending: false })
    .limit(5);

  const totalBalance = Number(wallet.available_balance) + Number(wallet.held_balance);
  const isLowBalance = Number(wallet.available_balance) < Number(wallet.minimum_balance_threshold);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">C2G Wallet</h1>
          <p className="text-muted-foreground">Manage your funds, pay for services, and track shipping deposits.</p>
        </div>
        <TopUpModal currentPhone={customer.phone} />
      </div>

      {searchParamsAwaited?.status === 'cancelled' && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm">
          Your top-up attempt was cancelled.
        </div>
      )}

      {isLowBalance && (
        <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-500 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>Your available balance is below the recommended minimum of ₵{Number(wallet.minimum_balance_threshold).toFixed(2)}. Consider topping up to avoid delays in automatic deductions for shipping and processing.</p>
        </div>
      )}

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 bg-gradient-to-br from-primary/20 to-primary/5 border-primary/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Wallet className="w-24 h-24" />
          </div>
          <p className="text-sm font-medium text-primary mb-2">Available Balance</p>
          <h2 className="text-4xl font-black text-foreground">₵{Number(wallet.available_balance).toFixed(2)}</h2>
          <p className="text-xs text-muted-foreground mt-2">Ready to use for orders & shipping</p>
        </div>

        <div className="glass-panel p-6 bg-zinc-900 border-zinc-800">
          <p className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
            Held Funds <AlertCircle className="w-4 h-4" />
          </p>
          <h2 className="text-3xl font-bold text-foreground">₵{Number(wallet.held_balance).toFixed(2)}</h2>
          <p className="text-xs text-muted-foreground mt-2">Reserved for shipping deposits</p>
        </div>

        <div className="glass-panel p-6 bg-zinc-900 border-zinc-800">
          <p className="text-sm font-medium text-muted-foreground mb-2">Total Wallet Value</p>
          <h2 className="text-3xl font-bold text-foreground">₵{totalBalance.toFixed(2)}</h2>
          <p className="text-xs text-muted-foreground mt-2">Available + Held</p>
        </div>
      </div>

      {/* Transactions */}
      <div className="w-full">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <History className="w-5 h-5 text-primary" /> Wallet History
        </h3>

        {(!transactions || transactions.length === 0) ? (
          <div className="text-center py-12 text-muted-foreground">
            <Wallet className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No transactions yet.</p>
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

        {transactions && transactions.length >= 5 && (
          <div className="mt-6 text-center">
            <Link href="/dashboard/wallet/history" className="text-sm font-bold text-primary hover:underline">
              View All Transactions →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
