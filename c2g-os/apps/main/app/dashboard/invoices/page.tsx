import { getInvoices } from "./actions";
import Link from "next/link";
import { FileText, Download, CreditCard, ArrowRight, CheckCircle2 } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Invoices & Payments | C2G Logistics",
};

export default async function InvoicesPage() {
  const invoices = await getInvoices();

  const formatCurrency = (amount: number) => `₵${amount.toFixed(2)}`;
  const formatDate = (date: string) => new Date(date).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Invoices & Payments</h1>
        <p className="text-muted-foreground mt-1">View your billing history and manage unpaid invoices.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-panel p-6">
          <p className="text-sm font-semibold text-muted-foreground mb-1">Total Outstanding</p>
          <p className="text-3xl font-black text-destructive">
            {formatCurrency(invoices.filter(i => i.status === 'unpaid').reduce((acc, curr) => acc + curr.amount, 0))}
          </p>
        </div>
        <div className="glass-panel p-6 md:col-span-2 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg">Download Account Statement</h3>
            <p className="text-sm text-muted-foreground">Get a consolidated PDF of all your transactions.</p>
          </div>
          <button disabled className="h-11 px-4 bg-secondary text-secondary-foreground rounded-lg font-medium opacity-50 cursor-not-allowed">
            Export PDF
          </button>
        </div>
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/50 text-sm text-muted-foreground bg-secondary/20">
                <th className="p-4 font-semibold w-12"></th>
                <th className="p-4 font-semibold">Reference</th>
                <th className="p-4 font-semibold">Description</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold text-right">Amount</th>
                <th className="p-4 font-semibold text-center">Status</th>
                <th className="p-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {invoices.length > 0 ? (
                invoices.map((invoice: any) => (
                  <tr key={invoice.id} className="hover:bg-secondary/10 transition-colors group">
                    <td className="p-4 text-center">
                      <FileText className="w-5 h-5 text-muted-foreground inline-block" />
                    </td>
                    <td className="p-4 font-mono text-sm font-semibold">{invoice.reference}</td>
                    <td className="p-4">
                      <p className="font-medium">{invoice.type}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[200px]" title={invoice.description}>
                        {invoice.description}
                      </p>
                    </td>
                    <td className="p-4 text-sm whitespace-nowrap">{formatDate(invoice.date)}</td>
                    <td className="p-4 text-right font-bold text-foreground">
                      {formatCurrency(invoice.amount)}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-bold border ${
                        invoice.status === 'paid' 
                          ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                          : 'bg-destructive/10 text-destructive border-destructive/20 animate-pulse'
                      }`}>
                        {invoice.status === 'paid' ? 'PAID' : 'UNPAID'}
                      </span>
                    </td>
                    <td className="p-4 text-right whitespace-nowrap">
                      {invoice.status === 'paid' ? (
                        <Link 
                          href={invoice.url}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-secondary text-sm font-medium transition-colors"
                        >
                          <Download className="w-4 h-4" /> View PDF
                        </Link>
                      ) : (
                        <Link 
                          href={invoice.url}
                          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium shadow-sm transition-transform hover:scale-105"
                        >
                          Pay Now <ArrowRight className="w-4 h-4" />
                        </Link>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-muted-foreground">
                    No invoices found.
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
