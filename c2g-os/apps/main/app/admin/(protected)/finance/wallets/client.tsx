"use client";

import { useState } from "react";
import { Search, Wallet, Plus, Minus, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { adjustWalletBalance } from "./actions";
import { useModal } from "@/components/providers/modal-provider";

export default function AdminWalletsClient({ wallets }: { wallets: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAdjusting, setIsAdjusting] = useState<string | null>(null); // wallet id
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [referenceId, setReferenceId] = useState("");
  const [type, setType] = useState<"credit" | "debit">("credit");
  const { showAlert } = useModal();

  const filteredWallets = wallets.filter(w => {
    const term = searchTerm.toLowerCase();
    const customer = w.customers || {};
    return (
      customer.name?.toLowerCase().includes(term) ||
      customer.email?.toLowerCase().includes(term) ||
      customer.phone?.toLowerCase().includes(term) ||
      w.id.toLowerCase().includes(term)
    );
  });

  const handleAdjust = async (walletId: string) => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      showAlert({ title: "Invalid Amount", message: "Please enter a valid positive amount.", type: "warning" });
      return;
    }
    if (!description.trim()) {
      showAlert({ title: "Description Required", message: "Please provide a reason for this adjustment.", type: "warning" });
      return;
    }
    if (!referenceId.trim()) {
      showAlert({ title: "Reference Required", message: "Every financial action must have a reference ID.", type: "warning" });
      return;
    }

    const finalAmount = type === "credit" ? Number(amount) : -Number(amount);
    
    setIsAdjusting(walletId);
    try {
      const res = await adjustWalletBalance(walletId, finalAmount, description, referenceId);
      if (res.success) {
        showAlert({ title: "Success", message: "Wallet balance has been adjusted.", type: "success" });
        setIsAdjusting(null);
        setAmount("");
        setDescription("");
        setReferenceId("");
      } else {
        showAlert({ title: "Adjustment Failed", message: res.error || "An error occurred.", type: "danger" });
      }
    } catch (err: any) {
      showAlert({ title: "Error", message: err.message || "An unexpected error occurred.", type: "danger" });
    } finally {
      setIsAdjusting(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, email, or wallet ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      <div className="grid gap-6">
        {filteredWallets.map(wallet => (
          <div key={wallet.id} className="glass-panel p-6 rounded-xl border border-border/50">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                  <Wallet className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{wallet.customers?.name || "Unknown Customer"}</h3>
                  <div className="text-sm text-muted-foreground flex items-center gap-3">
                    <span>{wallet.customers?.email}</span>
                    {wallet.customers?.phone && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-border" />
                        <span>{wallet.customers?.phone}</span>
                      </>
                    )}
                  </div>
                  <div className="text-xs font-mono text-muted-foreground mt-1">ID: {wallet.id}</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 w-full lg:w-auto">
                <div className="flex items-center gap-6 w-full sm:w-auto bg-secondary/30 p-3 rounded-lg border border-border/50">
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Available</div>
                    <div className="text-xl font-bold text-primary">₵{parseFloat(wallet.available_balance || 0).toFixed(2)}</div>
                  </div>
                  <div className="w-px h-10 bg-border" />
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Held</div>
                    <div className="text-xl font-bold text-orange-500">₵{parseFloat(wallet.hold_balance || 0).toFixed(2)}</div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 w-full sm:w-64">
                  {isAdjusting === wallet.id ? (
                    <div className="space-y-3 bg-card p-3 rounded-lg border border-border shadow-sm animate-in fade-in slide-in-from-top-2">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setType("credit")}
                          className={`flex-1 py-1.5 text-xs font-bold rounded flex items-center justify-center gap-1 transition-colors ${type === "credit" ? "bg-green-500/20 text-green-600 border border-green-500/30" : "bg-secondary text-muted-foreground"}`}
                        >
                          <Plus className="w-3 h-3" /> Credit
                        </button>
                        <button
                          onClick={() => setType("debit")}
                          className={`flex-1 py-1.5 text-xs font-bold rounded flex items-center justify-center gap-1 transition-colors ${type === "debit" ? "bg-destructive/20 text-destructive border border-destructive/30" : "bg-secondary text-muted-foreground"}`}
                        >
                          <Minus className="w-3 h-3" /> Debit
                        </button>
                      </div>
                      <input
                        type="number"
                        placeholder="Amount (GHS)"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full px-3 py-2 bg-background border border-border rounded text-sm focus:outline-none focus:border-primary"
                      />
                      <input
                        type="text"
                        placeholder="Reason (e.g. Refund)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-3 py-2 bg-background border border-border rounded text-sm focus:outline-none focus:border-primary"
                      />
                      <input
                        type="text"
                        placeholder="Reference ID (e.g. LNK-1024)"
                        value={referenceId}
                        onChange={(e) => setReferenceId(e.target.value)}
                        className="w-full px-3 py-2 bg-background border border-border rounded text-sm focus:outline-none focus:border-primary"
                      />
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setIsAdjusting(null)}
                          className="flex-1 py-2 text-xs font-bold bg-secondary hover:bg-secondary/80 rounded transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleAdjust(wallet.id)}
                          className="flex-1 py-2 text-xs font-bold bg-primary text-primary-foreground hover:opacity-90 rounded transition-opacity"
                        >
                          Confirm
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setIsAdjusting(wallet.id)}
                      className="w-full py-2.5 bg-secondary hover:bg-secondary/80 text-foreground font-semibold rounded-lg transition-colors text-sm border border-border/50"
                    >
                      Adjust Balance
                    </button>
                  )}
                </div>
              </div>

            </div>
          </div>
        ))}
        {filteredWallets.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No wallets found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
