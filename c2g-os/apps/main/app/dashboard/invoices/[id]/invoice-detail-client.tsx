'use client';

import { Printer, ArrowLeft, CreditCard, Download, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useModal } from "@/components/providers/modal-provider";
import { payMallOrder } from "../../mall-orders/actions";
import { payLinkOrder } from "../../orders/actions";
import { payPackageRegistrationFee } from "../../packages/actions";

export default function InvoiceDetailClient({ invoice, companyInfo }: { invoice: any, companyInfo: any }) {
  const router = useRouter();
  const [isPaying, setIsPaying] = useState(false);
  const { showAlert, showConfirm } = useModal();

  const formatCurrency = (amount: number) => `₵${parseFloat(amount.toString()).toFixed(2)}`;
  const formatDate = (date: string) => new Date(date).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' });

  const handlePrint = () => {
    window.print();
  };

  const handlePay = async () => {
    // Confirm before payment
    const confirmed = await showConfirm({
      title: "Confirm Payment",
      message: `You are about to pay ₵${parseFloat(invoice.total.toString()).toFixed(2)} from your wallet for invoice ${invoice.reference}.\n\nThis action cannot be undone.`,
      type: "warning",
      confirmText: `Pay ₵${parseFloat(invoice.total.toString()).toFixed(2)}`,
      cancelText: "Cancel",
    });
    if (!confirmed) return;

    setIsPaying(true);
    try {
      let res: { success?: boolean; error?: string } = {};

      if (invoice.payType === 'mall_order') {
        res = await payMallOrder(invoice.payId);
      } else if (invoice.payType === 'link_order') {
        res = await payLinkOrder(invoice.payId);
      } else if (invoice.payType === 'package_registration') {
        res = await payPackageRegistrationFee(invoice.payId);
      } else {
        res = { success: false, error: 'Unsupported payment type.' };
      }

      if (res.success) {
        showAlert({ title: 'Payment Successful', message: 'Invoice paid successfully from wallet.', type: 'success' });
        router.refresh();
      } else {
        showAlert({ title: 'Payment Error', message: res.error || 'Failed to process payment.', type: 'danger' });
      }
    } catch (err) {
      showAlert({ title: 'System Error', message: 'An unexpected error occurred.', type: 'danger' });
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <>
      {/* Screen-only Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 print:hidden">
        <button 
          onClick={() => router.push("/dashboard/invoices")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Invoices
        </button>
        <div className="flex gap-3 w-full sm:w-auto">
          <button 
            onClick={handlePrint}
            className="flex-1 sm:flex-none h-11 px-6 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Printer className="w-4 h-4" /> Print / PDF
          </button>
          {invoice.status === 'unpaid' && (
            <button 
              onClick={handlePay}
              disabled={isPaying}
              className="flex-1 sm:flex-none h-11 px-8 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-bold transition-all shadow-lg shadow-primary/25 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <CreditCard className="w-5 h-5" />
              {isPaying ? 'Redirecting...' : 'Pay Now'}
            </button>
          )}
        </div>
      </div>

      {/* Printable Invoice Container */}
      <div className="bg-white text-black p-8 sm:p-12 rounded-2xl shadow-sm border border-gray-200 print:p-0 print:border-none print:shadow-none">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12 border-b border-gray-200 pb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#FF6A00] rounded-lg flex items-center justify-center print:bg-[#FF6A00] print:print-color-adjust-exact">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <h1 className="text-3xl font-black tracking-tight text-gray-900">INVOICE</h1>
            </div>
            <div className="text-gray-500 text-sm space-y-1">
              <p className="font-bold text-gray-900">{companyInfo.name}</p>
              <p>{companyInfo.address}</p>
              <p>{companyInfo.email}</p>
              <p>{companyInfo.phone}</p>
            </div>
          </div>
          <div className="text-left md:text-right w-full md:w-auto">
            <div className="grid grid-cols-2 md:block gap-4 mb-4 md:space-y-4">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Invoice Number</p>
                <p className="text-lg font-mono font-bold text-gray-900">{invoice.reference}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Date Issued</p>
                <p className="text-base font-semibold text-gray-700">{formatDate(invoice.date)}</p>
              </div>
            </div>
            
            <div className={`inline-flex items-center justify-center px-4 py-1.5 rounded-full text-sm font-black uppercase tracking-widest border-2 print:border-2 ${
              invoice.status === 'paid' 
                ? 'bg-green-50 text-green-600 border-green-200 print:border-green-600' 
                : 'bg-red-50 text-red-600 border-red-200 print:border-red-600'
            }`}>
              {invoice.status === 'paid' ? 'PAID IN FULL' : 'UNPAID BALANCE'}
            </div>
          </div>
        </div>

        {/* Bill To */}
        <div className="mb-12">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Billed To</p>
          <p className="text-lg font-bold text-gray-900">{invoice.type}</p>
          <p className="text-gray-500 mt-1">Customer ID: {invoice.customer_id}</p>
        </div>

        {/* Items Table */}
        <div className="mb-12">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-900">
                <th className="py-3 px-2 font-bold text-gray-900">Description</th>
                <th className="py-3 px-2 font-bold text-gray-900 text-center w-24">Qty</th>
                <th className="py-3 px-2 font-bold text-gray-900 text-right w-32">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {invoice.items.map((item: any, i: number) => (
                <tr key={i}>
                  <td className="py-4 px-2 text-gray-700 font-medium">{item.description}</td>
                  <td className="py-4 px-2 text-center text-gray-600">{item.quantity}</td>
                  <td className="py-4 px-2 text-right font-semibold text-gray-900">{formatCurrency(item.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="w-full md:w-1/2 text-gray-500 text-sm">
            <p className="font-bold text-gray-900 mb-1 flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-green-600" /> Secure Internal Wallet Payment</p>
            <p>If you have any questions concerning this invoice, contact our support team at support@c2g-logistics.com.</p>
          </div>
          <div className="w-full md:w-80 space-y-3">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-medium">{formatCurrency(invoice.subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Service Fee</span>
              <span className="font-medium">{formatCurrency(invoice.fee)}</span>
            </div>
            <div className="flex justify-between border-t-2 border-gray-900 pt-3 mt-3">
              <span className="text-lg font-black text-gray-900">Total Due</span>
              <span className="text-2xl font-black text-[#FF6A00]">{formatCurrency(invoice.total)}</span>
            </div>
          </div>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body { background: white !important; }
          .print\\:hidden { display: none !important; }
          .print\\:p-0 { padding: 0 !important; }
          .print\\:border-none { border: none !important; }
          .print\\:shadow-none { box-shadow: none !important; }
        }
      `}} />
    </>
  );
}
