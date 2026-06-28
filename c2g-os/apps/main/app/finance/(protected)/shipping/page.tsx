export const dynamic = "force-dynamic";
import { getShippingFees } from './actions';
import ShippingClient from './client';

export const metadata = {
  title: 'Shipping Fees | C2G Finance ERP',
};

export default async function FinanceShippingPage() {
  const res = await getShippingFees();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Shipping Fees</h1>
        <p className="text-zinc-400">Track outstanding and collected shipping fees across all orders.</p>
      </div>

      {!res.success ? (
        <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-xl">
          <h2 className="text-red-400 font-bold mb-2">Failed to load shipping data</h2>
          <p className="text-red-300 font-mono text-sm">{res.error}</p>
        </div>
      ) : (
        <ShippingClient unpaid={res.unpaid || []} paid={res.paid || []} summary={res.summary} />
      )}
    </div>
  );
}
