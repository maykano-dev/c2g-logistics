import { getFinancialHealthKPIs } from './actions';
import { 
  Banknote, 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Clock, 
  Receipt,
  Truck,
  BarChart3,
  RefreshCcw
} from 'lucide-react';
import { RevenueBarChart, ProfitAreaChart } from './chart-client';
import { ReconcileButton } from './reconcile-client';

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
  overdueShippingCustomers: 37,
  revenueByDay: [
    { name: 'Mon', revenue: 4000 },
    { name: 'Tue', revenue: 3000 },
    { name: 'Wed', revenue: 2000 },
    { name: 'Thu', revenue: 2780 },
    { name: 'Fri', revenue: 1890 },
    { name: 'Sat', revenue: 2390 },
    { name: 'Sun', revenue: 3490 },
  ],
  profitByMonth: [
    { name: 'Jan', profit: 4000 },
    { name: 'Feb', profit: 3000 },
    { name: 'Mar', profit: 2000 },
    { name: 'Apr', profit: 2780 },
    { name: 'May', profit: 1890 },
    { name: 'Jun', profit: 2390 },
    { name: 'Jul', profit: 3490 },
  ]
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Financial Health Dashboard</h1>
          <p className="text-zinc-400">Company overview, liabilities, and core metrics.</p>
        </div>
        <ReconcileButton />
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

      {/* Analytics Charts */}
      <div className="grid gap-4 md:grid-cols-2 mt-8">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-400" /> Revenue by Day
            </h2>
          </div>
          <div className="h-[300px]">
            <RevenueBarChart data={mockData.revenueByDay} />
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" /> Profit by Month
            </h2>
          </div>
          <div className="h-[300px]">
            <ProfitAreaChart data={mockData.profitByMonth} />
          </div>
        </div>
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
