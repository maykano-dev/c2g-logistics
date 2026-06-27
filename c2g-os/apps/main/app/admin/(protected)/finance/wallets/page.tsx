import { getAllWallets } from './actions';
import AdminWalletsClient from './client';

export const metadata = {
  title: 'Customer Wallets | C2G Admin',
};

export default async function AdminWalletsPage() {
  const res = await getAllWallets();
  const wallets = res.success ? (res.wallets || []) : [];

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2 mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Customer Wallets</h2>
      </div>
      
      {res.success === false && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-4">
          Error loading wallets: {res.error}
        </div>
      )}

      <AdminWalletsClient wallets={wallets} />
    </div>
  );
}
