import { getFinancialHealthKPIs } from './actions';
import { 
  Banknote, 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Clock, 
  Receipt,
  Truck
} from 'lucide-react';

export const metadata = {
  title: 'Financial Health | C2G Finance ERP',
};

// Mock data for the ones not strictly calculated by the RPC yet
const mockData = {
  todaysRevenue: 12540,
  revenueGrowth: "+14%",
  todaysExpenses: 7220,
  todaysProfit: 5320,
  outstandingCustomerBalances: 4180,
  pendingProcurement: 18600, // CNY
  outstandingShippingFees: 9480,
  overdueShippingCustomers: 37
};

export default async function FinanceDashboard() {
  const res = await getFinancialHealthKPIs();
  const kpis = res.success && res.kpis ? res.kpis : {
    wallet_liabilities: 0,
    pending_withdrawals: 0,
    pending_refunds: 0,
    cash_available: 0
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Financial Health Dashboard</h1>
        <p className="text-zinc-400">Company overview, liabilities, and core metrics.</p>
      </div>

      {res.success === false && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg border border-destructive/20">
          Warning: Could not fetch real-time KPIs from database. Showing default/cached values.
        </div>
      )}

      {/* Primary KPI Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard 
          title="Cash Available" 
          amount={`₵${kpis.cash_available.toLocaleString(undefined, {minimumFractionDigits: 2})}`} 
          icon={Banknote} 
          trend="Healthy" 
          color="text-emerald-500"
          bg="bg-emerald-500/10"
        />
        <KpiCard 
          title="Wallet Liabilities" 
          amount={`₵${kpis.wallet_liabilities.toLocaleString(undefined, {minimumFractionDigits: 2})}`} 
          icon={Wallet} 
          subtitle="Total customer funds held"
          color="text-orange-500"
          bg="bg-orange-500/10"
        />
        <KpiCard 
          title="Today's Revenue" 
          amount={`₵${mockData.todaysRevenue.toLocaleString()}`} 
          icon={TrendingUp} 
          trend={mockData.revenueGrowth} 
          color="text-blue-500"
          bg="bg-blue-500/10"
        />
        <KpiCard 
          title="Today's Profit" 
          amount={`₵${mockData.todaysProfit.toLocaleString()}`} 
          icon={TrendingUp} 
          subtitle={`Expenses: ₵${mockData.todaysExpenses.toLocaleString()}`}
          color="text-emerald-400"
          bg="bg-emerald-400/10"
        />
      </div>

      {/* Secondary Warning Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <WarningCard 
          title="Pending Withdrawals"
          amount={`₵${kpis.pending_withdrawals.toLocaleString(undefined, {minimumFractionDigits: 2})}`}
          icon={Clock}
          color="text-amber-500"
        />
        <WarningCard 
          title="Pending Refunds"
          amount={`₵${kpis.pending_refunds.toLocaleString(undefined, {minimumFractionDigits: 2})}`}
          icon={Receipt}
          color="text-rose-500"
        />
        <WarningCard 
          title="Pending Procurement"
          amount={`¥${mockData.pendingProcurement.toLocaleString()}`}
          icon={TrendingDown}
          color="text-zinc-400"
        />
      </div>

      {/* Debt Metrics */}
      <div className="mt-8">
        <h2 className="text-xl font-bold tracking-tight text-white mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          Outstanding Debts
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-400 font-medium">Customer Balances</p>
              <h3 className="text-2xl font-bold text-white mt-1">₵{mockData.outstandingCustomerBalances.toLocaleString()}</h3>
            </div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-400 font-medium">Outstanding Shipping</p>
              <h3 className="text-2xl font-bold text-white mt-1">₵{mockData.outstandingShippingFees.toLocaleString()}</h3>
            </div>
            <Truck className="w-8 h-8 text-zinc-700" />
          </div>
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl flex items-center justify-between border-l-4 border-l-rose-500">
            <div>
              <p className="text-sm text-zinc-400 font-medium">Overdue Shipping</p>
              <h3 className="text-2xl font-bold text-rose-500 mt-1">{mockData.overdueShippingCustomers} Customers</h3>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

function KpiCard({ title, amount, icon: Icon, trend, subtitle, color, bg }: any) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 relative overflow-hidden group">
      <div className="flex justify-between items-start mb-4">
        <p className="text-sm font-medium text-zinc-400">{title}</p>
        <div className={`p-2 rounded-lg ${bg}`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
      </div>
      <div>
        <h3 className="text-3xl font-bold tracking-tight text-white">{amount}</h3>
        {trend && (
          <p className={`text-xs font-medium mt-2 ${trend.startsWith('+') || trend === 'Healthy' ? 'text-emerald-500' : 'text-rose-500'}`}>
            {trend}
          </p>
        )}
        {subtitle && (
          <p className="text-xs font-medium mt-2 text-zinc-500">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

function WarningCard({ title, amount, icon: Icon, color }: any) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex items-center gap-4">
      <div className={`p-3 rounded-full bg-zinc-950 border border-zinc-800`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <div>
        <p className="text-sm font-medium text-zinc-400">{title}</p>
        <h3 className="text-xl font-bold text-white mt-0.5">{amount}</h3>
      </div>
    </div>
  );
}
