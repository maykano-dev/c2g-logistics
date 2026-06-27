import { getWalletLedger } from './actions';
import WalletLedgerClient from './client';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Wallet Ledger | C2G Finance ERP',
};

export default async function WalletLedgerPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const res = await getWalletLedger(resolvedParams.id);

  if (!res.success || !res.wallet) {
    redirect('/finance/wallets');
  }

  return (
    <div className="space-y-6">
      <WalletLedgerClient wallet={res.wallet} transactions={res.transactions || []} />
    </div>
  );
}
