import { getPendingProcurementJobs } from "./actions";
import { PackageSearch, AlertTriangle, ShieldCheck, CheckCircle2, ShoppingCart, DollarSign } from "lucide-react";
import AlibabaJobCard from "./job-card";

export const metadata = {
  title: "Alibaba Procurement | C2G Admin",
};

export default async function AlibabaOrdersPage() {
  const { success, jobs, error } = await getPendingProcurementJobs();

  if (!success) {
    return (
      <div className="p-8 text-center text-destructive bg-destructive/10 rounded-xl">
        Error loading procurement jobs: {error}
      </div>
    );
  }

  const pendingCount = jobs?.length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <PackageSearch className="w-8 h-8 text-primary" />
            Alibaba Procurement
          </h1>
          <p className="text-muted-foreground mt-1">
            Manual approval queue for all Smart Gateway orders.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel p-5 border-l-4 border-l-primary rounded-l-none">
          <div className="flex items-center gap-3 mb-2">
            <ShoppingCart className="w-5 h-5 text-primary" />
            <h3 className="font-bold">Pending Jobs</h3>
          </div>
          <p className="text-3xl font-bold">{pendingCount}</p>
        </div>
        <div className="glass-panel p-5 border-l-4 border-l-green-500 rounded-l-none">
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck className="w-5 h-5 text-green-500" />
            <h3 className="font-bold">Risk Management</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            All orders below are locked in Cedis. You must approve them to trigger the Alibaba BuyNow API.
          </p>
        </div>
      </div>

      {/* Jobs List */}
      <div className="space-y-4 mt-8">
        <h2 className="text-xl font-bold flex items-center gap-2">
          Queue <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs rounded-full">{pendingCount}</span>
        </h2>
        
        {pendingCount === 0 ? (
          <div className="glass-panel p-12 text-center flex flex-col items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-green-500 mb-4" />
            <h3 className="text-lg font-bold">All caught up!</h3>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              There are no pending Alibaba orders waiting for procurement at this time.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {jobs?.map((job: any) => (
              <AlibabaJobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
