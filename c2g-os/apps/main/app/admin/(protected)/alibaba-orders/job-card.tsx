"use client";

import { useState } from "react";
import { triggerManualProcurement, cancelProcurementJob } from "./actions";
import { CheckCircle2, XCircle, Loader2, DollarSign, Package, AlertTriangle } from "lucide-react";
import { useModal } from "@/components/providers/modal-provider";

export default function AlibabaJobCard({ job }: { job: any }) {
  const [loading, setLoading] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const { showAlert } = useModal();

  const order = job.ecom_orders;
  const items = order?.items || [];
  
  // Calculate Profit
  const profitGhs = (order.total_amount || 0) - (order.total_cost_ghs || 0);
  const profitMargin = (profitGhs / (order.total_amount || 1)) * 100;
  
  // Danger check: If snapshot USD cost is different from current, etc.
  // (In a full app we'd fetch live price again here to compare, but this is a dashboard display)

  const handleProcure = async () => {
    setLoading(true);
    try {
      const res = await triggerManualProcurement(job.id);
      if (res.success) {
        showAlert({ 
          title: "Success", 
          message: `Order procured successfully! Alibaba Trade ID: ${res.alibabaOrderId}`, 
          type: "success" 
        });
      } else {
        showAlert({ 
          title: "Procurement Failed", 
          message: res.error || "Unknown error occurred.", 
          type: "danger" 
        });
      }
    } catch (err: any) {
      showAlert({ title: "Error", message: err.message, type: "danger" });
    }
    setLoading(false);
  };

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this procurement? The customer will need to be refunded.")) return;
    
    setCancelling(true);
    const res = await cancelProcurementJob(job.id);
    if (!res.success) {
      showAlert({ title: "Error", message: res.error || "Failed to cancel", type: "danger" });
    }
    setCancelling(false);
  };

  if (!order) return null;

  return (
    <div className="glass-panel p-6 border-l-4 border-l-orange-500 overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
        <Package className="w-48 h-48" />
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:items-center justify-between relative z-10">
        
        {/* Left: Customer Info */}
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono bg-secondary px-2 py-0.5 rounded text-xs">
              {order.order_id}
            </span>
            <span className="text-xs text-muted-foreground">
              {new Date(job.created_at).toLocaleString()}
            </span>
          </div>
          <h3 className="font-bold text-lg">{order.customer_name}</h3>
          <p className="text-sm text-muted-foreground">{order.customer_phone}</p>
          
          <div className="mt-4 space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Items to Procure:</p>
            {items.map((item: any, idx: number) => (
              <div key={idx} className="flex items-center gap-2 text-sm bg-secondary/50 p-2 rounded">
                <img src={item.image_url} alt="" className="w-8 h-8 rounded object-cover" />
                <span className="font-medium line-clamp-1">{item.name}</span>
                <span className="text-xs ml-auto shrink-0 bg-background px-2 py-1 rounded">Qty: {item.quantity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Middle: Financials */}
        <div className="bg-background rounded-xl p-4 border border-border min-w-[250px] shadow-sm">
          <h4 className="font-bold flex items-center gap-2 mb-4 border-b border-border pb-2">
            <DollarSign className="w-4 h-4 text-green-500" /> Financials
          </h4>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Customer Paid:</span>
              <span className="font-bold">₵{order.total_amount?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Alibaba Cost (GHS):</span>
              <span className="font-medium">₵{order.total_cost_ghs?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Snapshot USD:</span>
              <span className="font-medium text-blue-500">${order.snapshot_price_usd?.toFixed(2)}</span>
            </div>
            
            <div className="border-t border-border mt-2 pt-2 flex justify-between items-center">
              <span className="text-muted-foreground font-medium">Est. Profit:</span>
              <span className={`font-bold text-lg ${profitGhs > 0 ? 'text-green-500' : 'text-red-500'}`}>
                ₵{profitGhs.toFixed(2)}
              </span>
            </div>
            <div className="text-right text-[10px] text-muted-foreground">
              Margin: {profitMargin.toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex flex-col gap-3 min-w-[200px]">
          {job.error_log && (
            <div className="text-xs bg-red-500/10 text-red-500 p-2 rounded border border-red-500/20 flex items-start gap-1">
              <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" />
              <span>{job.error_log}</span>
            </div>
          )}

          <button
            onClick={handleProcure}
            disabled={loading || cancelling}
            className="w-full flex items-center justify-center gap-2 bg-green-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:bg-green-600 transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
            {loading ? "Procuring..." : "Procure Now"}
          </button>
          
          <button
            onClick={handleCancel}
            disabled={loading || cancelling}
            className="w-full flex items-center justify-center gap-2 bg-secondary text-muted-foreground font-bold py-3 px-4 rounded-xl hover:bg-secondary/80 transition-colors disabled:opacity-50 border border-border"
          >
            {cancelling ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
            Cancel Order
          </button>
        </div>

      </div>
    </div>
  );
}
