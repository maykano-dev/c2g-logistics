import { getWallets } from './actions';
import WalletSearchClient from './client';

export const metadata = {
  title: 'Wallets | C2G Finance ERP',
};

export default async function FinanceWalletsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const resolvedParams = await searchParams;
  const q = resolvedParams.q || '';
  
  const res = await getWallets(q);
  const wallets = res.wallets || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Wallet Management</h1>
        <p className="text-zinc-400">Search, view, and manage customer wallet balances.</p>
      </div>
      
      <WalletSearchClient initialWallets={wallets} initialQuery={q} />
    </div>
  );
}
