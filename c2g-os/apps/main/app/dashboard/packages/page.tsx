import { Package, PlusCircle, Search, Filter } from "lucide-react";
import Link from "next/link";

export default function PackagesPage() {
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
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[
          { tracking: "YT89938221123", desc: "Running Shoes", weight: "1.2kg", cbm: "0.01", status: "In Warehouse", date: "2026-06-09" },
          { tracking: "SF1003445521", desc: "Laptop Case", weight: "0.5kg", cbm: "0.005", status: "Shipped", date: "2026-06-08" },
          { tracking: "ZT334411123", desc: "Mechanical Keyboard", weight: "1.8kg", cbm: "0.02", status: "Awaiting Arrival", date: "2026-06-11" },
          { tracking: "JD88833111", desc: "Water Bottle", weight: "0.4kg", cbm: "0.002", status: "Delivered", date: "2026-06-01" },
        ].map((pkg, idx) => (
          <div key={idx} className="glass-panel p-6 flex flex-col group hover:border-primary/50 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-primary/10 rounded-lg text-primary">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground font-mono text-sm">{pkg.tracking}</h3>
                  <p className="text-xs text-muted-foreground">{pkg.date}</p>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                pkg.status === 'In Warehouse' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' :
                pkg.status === 'Shipped' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                pkg.status === 'Delivered' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                'bg-orange-500/10 text-orange-500 border-orange-500/20'
              }`}>
                {pkg.status}
              </span>
            </div>

            <p className="font-medium mb-4">{pkg.desc}</p>

            <div className="grid grid-cols-2 gap-4 mt-auto pt-4 border-t border-border/50">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Weight</p>
                <p className="font-semibold text-sm">{pkg.weight}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">CBM (Vol)</p>
                <p className="font-semibold text-sm">{pkg.cbm}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
