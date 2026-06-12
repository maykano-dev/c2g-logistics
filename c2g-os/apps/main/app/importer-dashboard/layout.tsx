import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { Metadata } from "next";
import ImporterDashboardClientLayout from "./importer-client-layout";
import { Store, Package, ShoppingBag, Users, Wallet, Truck, CreditCard, Settings, LifeBuoy } from "lucide-react";

export const metadata: Metadata = {
  title: "Importer Dashboard | C2G Logistics",
  description: "Manage your importer store, products, and profits.",
};

export default async function ImporterDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    redirect("/login");
  }

  // Strict Guard: Must be an approved importer
  const { data: importer } = await supabase
    .from('importers')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (!importer) {
    redirect("/importers/register");
  }

  if (importer.status !== 'approved') {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
        <div className="w-20 h-20 bg-amber-500/20 text-amber-500 rounded-full flex items-center justify-center mb-6">
          <Store className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Account Pending Approval</h1>
        <p className="text-muted-foreground max-w-md">
          Your importer application is currently under review. We will notify you via WhatsApp or Email once your account is activated.
        </p>
      </div>
    );
  }

  const navLinks = [
    { name: "Overview", href: "/importer-dashboard", icon: Store },
    { name: "Products", href: "/importer-dashboard/products", icon: Package },
    { name: "Orders", href: "/importer-dashboard/orders", icon: ShoppingBag },
    { name: "Profits & Wallet", href: "/importer-dashboard/wallet", icon: Wallet },
  ];

  return (
    <ImporterDashboardClientLayout user={user} importer={importer} navLinks={navLinks}>
      {children}
    </ImporterDashboardClientLayout>
  );
}
