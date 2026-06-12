import { Package, PlusCircle, Search, Filter } from "lucide-react";
import Link from "next/link";
import { getPackages } from "./actions";
import PackagePayButton from "./package-pay-button";

export default async function PackagesPage() {
  const packages = await getPackages();

  const getStatusDisplay = (status: string, registrationFeePaid: boolean) => {
    if (status === 'pending_payment' && !registrationFeePaid) {
      return { label: 'Pending Payment', className: 'bg-orange-500/10 text-orange-500 border-orange-500/20' };
    }
    if (status === 'pending' || status === 'awaiting_arrival') {
      return { label: 'Awaiting Arrival', className: 'bg-blue-500/10 text-blue-500 border-blue-500/20' };
    }
    if (status === 'in_warehouse') {
      return { label: 'In Warehouse', className: 'bg-purple-500/10 text-purple-500 border-purple-500/20' };
    }
    return { label: status, className: 'bg-gray-500/10 text-gray-500 border-gray-500/20' };
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Packages</h1>
          <p className="text-muted-foreground mt-1">Track and manage your registered warehouse packages.</p>
        </div>
        <Link 
          href="/dashboard/packages/register" 
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 gap-2 shadow-lg shadow-primary/25 hover:scale-[1.02]"
        >
          <PlusCircle className="w-4 h-4" />
          Register Package
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="glass-panel p-4 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search by Tracking Number or Description..." 
            className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 pl-9 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors backdrop-blur-sm"
          />
        </div>
        <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 gap-2">
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>

      {/* Packages Grid */}
      {packages.length === 0 ? (
        <div className="glass-panel p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Package className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-bold mb-2">No Packages Yet</h3>
          <p className="text-muted-foreground mb-6 max-w-sm">You haven't registered any packages yet. Add your tracking numbers once your supplier ships your items.</p>
          <Link 
            href="/dashboard/packages/register" 
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            Register Your First Package
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {packages.map((pkg: any) => {
            const statusDisplay = getStatusDisplay(pkg.status, pkg.registration_fee_paid);
            const needsPayment = pkg.status === 'pending_payment' && !pkg.registration_fee_paid;

            return (
              <div key={pkg.id} className="glass-panel p-6 flex flex-col group hover:border-primary/50 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-primary/10 rounded-lg text-primary">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <Link href={`/dashboard/packages/${pkg.id}`} className="font-bold text-foreground font-mono text-sm hover:text-primary hover:underline transition-colors block">
                        {pkg.tracking_number}
                      </Link>
                      <p className="text-xs text-muted-foreground">{new Date(pkg.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusDisplay.className}`}>
                    {statusDisplay.label}
                  </span>
                </div>

                <p className="font-medium mb-4 text-sm line-clamp-2">{pkg.items_description}</p>

                <div className="grid grid-cols-2 gap-4 mt-auto pt-4 border-t border-border/50">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Weight</p>
                    <p className="font-semibold text-sm">{pkg.weight || 'TBD'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">CBM (Vol)</p>
                    <p className="font-semibold text-sm">{pkg.cbm || 'TBD'}</p>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Link 
                    href={`/dashboard/packages/${pkg.id}`}
                    className="flex-1 inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs font-medium transition-colors bg-secondary text-secondary-foreground hover:bg-secondary/80 h-8 px-3"
                  >
                    View Tracker
                  </Link>
                  {needsPayment && (
                    <div className="flex-1">
                      <PackagePayButton packageId={pkg.id} />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
