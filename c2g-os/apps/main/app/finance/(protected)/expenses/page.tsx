import { getExpenses } from './actions';
import ExpensesClient from './client';

export const metadata = {
  title: 'Company Expenses | C2G Finance ERP',
};

export default async function FinanceExpensesPage() {
  const res = await getExpenses();
  const expenses = res.success ? res.expenses : [];

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Operational Expenses</h1>
        <p className="text-zinc-400">Track, approve, and manage company expenditures and procurements.</p>
      </div>
      
      <ExpensesClient initialExpenses={expenses || []} />
    </div>
  );
}
