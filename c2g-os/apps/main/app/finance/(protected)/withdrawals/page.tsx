import { getWithdrawals } from './actions';
import WithdrawalsClient from './client';

export const metadata = {
  title: 'Withdrawals | C2G Finance ERP',
};

export default async function FinanceWithdrawalsPage() {
  const res = await getWithdrawals();
  const withdrawals = res.success ? res.withdrawals : [];

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Customer Withdrawals</h1>
        <p className="text-zinc-400">Review and approve requests for withdrawing funds from wallets.</p>
      </div>
      
      <WithdrawalsClient initialWithdrawals={withdrawals || []} />
    </div>
  );
}
