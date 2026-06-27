import { getRefunds } from './actions';
import RefundsClient from './client';

export const metadata = {
  title: 'Refund Center | C2G Finance ERP',
};

export default async function FinanceRefundsPage() {
  const res = await getRefunds();
  const refunds = res.success ? res.refunds : [];

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Refund Center</h1>
        <p className="text-zinc-400">Review refund requests and process refunds back to customer wallets.</p>
      </div>
      
      <RefundsClient initialRefunds={refunds || []} />
    </div>
  );
}
