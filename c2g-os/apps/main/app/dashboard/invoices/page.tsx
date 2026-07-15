import { getInvoices } from "./actions";
import Link from "next/link";
import { FileText, Download, CreditCard, ArrowRight, CheckCircle2 } from "lucide-react";
import { Metadata } from "next";
import ExportPdfButton from "./export-pdf-button";

export const metadata: Metadata = {
  title: "Invoices & Payments | C2G Logistics",
};

export default async function InvoicesPage() {
  const invoices = await getInvoices();

  const formatCurrency = (amount: number) => `₵${amount.toFixed(2)}`;
  const formatDate = (date: string) => new Date(date).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto pb-12 print:bg-white print:text-black print:p-0 print:m-0 print:space-y-6">
      <div className="print:border-b print:border-black print:pb-4">
        <h1 className="text-3xl font-bold tracking-tight print:text-black">Account Statement</h1>
        <p className="text-muted-foreground mt-1 print:text-gray-600">View your billing history and transactions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 print:mb-4 print:flex print:flex-col">
        <div className="glass-panel p-6 print:bg-transparent print:border-none print:shadow-none print:p-0">
          <p className="text-sm font-semibold text-muted-foreground mb-1 print:text-gray-600">Total Outstanding</p>
          <p className="text-3xl font-black text-destructive print:text-black">
            {formatCurrency(invoices.filter((i: any) => i.status === 'unpaid').reduce((acc: number, curr: any) => acc + curr.amount, 0))}
          </p>
        </div>
        <div className="print:hidden md:col-span-2">
          <div className="glass-panel p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 h-full">
            <div>
              <h3 className="font-bold text-lg">Download Account Statement</h3>
              <p className="text-sm text-muted-foreground">Get a consolidated PDF of all your transactions.</p>
            </div>
            <ExportPdfButton />
          </div>
        </div>
      </div>

      <div className="glass-panel overflow-hidden print:bg-transparent print:border-none print:shadow-none print:overflow-visible">
        {/* Mobile View */}
        <div className="md:hidden divide-y divide-border/50 print:hidden">
          {invoices.length > 0 ? (
            invoices.map((invoice: any) => (
              <div key={invoice.id} className="p-4 flex flex-col gap-3 relative">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-muted-foreground" />
                    <span className="font-mono text-sm font-semibold">{invoice.reference}</span>
                  </div>
                  <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    invoice.status === 'paid' 
                      ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                      : 'bg-destructive/10 text-destructive border-destructive/20 animate-pulse'
                  }`}>
                    {invoice.status === 'paid' ? 'PAID' : 'UNPAID'}
                  </span>
                </div>
                
                <div>
                  <p className="font-medium text-sm">{invoice.type}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1" title={invoice.description}>{invoice.description}</p>
                </div>

                <div className="flex justify-between items-end mt-1">
                  <div>
                    <p className="text-xs text-muted-foreground">{formatDate(invoice.date)}</p>
                    <p className="text-lg font-bold text-foreground mt-0.5">{formatCurrency(invoice.amount)}</p>
                  </div>
                  <div>
                    {invoice.status === 'paid' ? (
                      <Link 
                        href={invoice.url}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-secondary/50 hover:bg-secondary text-xs font-medium transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" /> View
                      </Link>
                    ) : (
                      <Link 
                        href={invoice.url}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-semibold shadow-sm transition-transform active:scale-95"
                      >
                        Pay Now <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              No invoices found.
            </div>
          )}
        </div>

        {/* Desktop View (Also used for Print) */}
        <div className="hidden md:block overflow-x-auto print:block print:w-full print:overflow-visible">
          <table className="w-full text-left border-collapse print:table-fixed">
            <thead>
              <tr className="border-b border-border/50 text-sm text-muted-foreground bg-secondary/20 print:bg-gray-100 print:text-black print:border-black">
                <th className="p-4 font-semibold w-12 print:hidden"></th>
                <th className="p-4 font-semibold print:p-2">Reference</th>
                <th className="p-4 font-semibold print:p-2">Description</th>
                <th className="p-4 font-semibold print:p-2">Date</th>
                <th className="p-4 font-semibold text-right print:p-2">Amount</th>
                <th className="p-4 font-semibold text-center print:p-2">Status</th>
                <th className="p-4 font-semibold text-right print:hidden">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50 print:divide-gray-300">
              {invoices.length > 0 ? (
                invoices.map((invoice: any) => (
                  <tr key={invoice.id} className="hover:bg-secondary/10 transition-colors group print:text-black print:border-b print:border-gray-200">
                    <td className="p-4 text-center print:hidden">
                      <FileText className="w-5 h-5 text-muted-foreground inline-block" />
                    </td>
                    <td className="p-4 font-mono text-sm font-semibold print:p-2 print:text-xs">{invoice.reference}</td>
                    <td className="p-4 print:p-2">
                      <p className="font-medium print:text-sm">{invoice.type}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[200px] print:text-gray-600 print:max-w-none print:whitespace-normal" title={invoice.description}>
                        {invoice.description}
                      </p>
                    </td>
                    <td className="p-4 text-sm whitespace-nowrap print:p-2 print:text-xs">{formatDate(invoice.date)}</td>
                    <td className="p-4 text-right font-bold text-foreground print:p-2 print:text-sm print:text-black">
                      {formatCurrency(invoice.amount)}
                    </td>
                    <td className="p-4 text-center print:p-2">
                      <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-bold border print:border-none print:px-0 print:py-0 ${
                        invoice.status === 'paid' 
                          ? 'bg-green-500/10 text-green-500 border-green-500/20 print:bg-transparent print:text-black' 
                          : 'bg-destructive/10 text-destructive border-destructive/20 animate-pulse print:bg-transparent print:text-black print:animate-none'
                      }`}>
                        {invoice.status === 'paid' ? 'PAID' : 'UNPAID'}
                      </span>
                    </td>
                    <td className="p-4 text-right whitespace-nowrap print:hidden">
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
                  <td colSpan={7} className="p-12 text-center text-muted-foreground print:p-4 print:text-black">
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

