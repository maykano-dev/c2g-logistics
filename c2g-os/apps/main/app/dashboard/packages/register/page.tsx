import { PackagePlus, Info, Zap, Plane, Ship, Store } from "lucide-react";
import Link from "next/link";
import RegisterPackageForm from "./register-package-form";

export default function RegisterPackagePage() {
  return (
    <div className="space-y-8 animate-fade-in max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Link href="/dashboard/packages" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            Packages
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm font-medium">Register</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Register Incoming Package</h1>
        <p className="text-muted-foreground mt-1">Once your supplier ships your item to our China warehouse, add the tracking number here so we know it's coming.</p>
      </div>

      <div className="glass-panel p-6 md:p-8 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none" />

        <RegisterPackageForm />
      </div>
    </div>
  );
}
