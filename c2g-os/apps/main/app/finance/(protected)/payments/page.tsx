export const dynamic = "force-dynamic";
import { getPayments } from './actions';
import PaymentsClient from './client';

export const metadata = {
  title: 'Payments | C2G Finance ERP',
};

export default async function FinancePaymentsPage() {
  const res = await getPayments();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Payment Records</h1>
        <p className="text-zinc-400">All completed payments from ecommerce orders.</p>
      </div>

      {!res.success ? (
        <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-xl">
          <h2 className="text-red-400 font-bold mb-2">Failed to load payments</h2>
          <p className="text-red-300 font-mono text-sm">{res.error}</p>
        </div>
      ) : (
        <PaymentsClient payments={res.payments || []} summary={res.summary} />
      )}
    </div>
  );
}
// force recompile
