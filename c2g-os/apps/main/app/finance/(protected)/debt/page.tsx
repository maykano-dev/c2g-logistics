import { getCustomerDebts } from './actions';
import DebtManagementClient from './client';

export const metadata = {
  title: 'Customer Debt | C2G Finance ERP',
};

export default async function FinanceDebtPage() {
  const res = await getCustomerDebts();
  const debtors = res.success ? res.debtors : [];

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Customer Debt Management</h1>
        <p className="text-zinc-400">Track and manage customers with outstanding fees.</p>
      </div>
      
      <DebtManagementClient debtors={debtors || []} />
    </div>
  );
}
