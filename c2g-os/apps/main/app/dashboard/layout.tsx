import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { Metadata } from "next";
import DashboardClientLayout from "./dashboard-client-layout";
import { PushPrompt } from "../../components/push-prompt";
import { WelcomeModal } from "../../components/welcome-modal";
import { getDashboardStats } from "./actions";
import { getSecureWalletBalance } from "./wallet/shared-actions";

import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "Dashboard | C2G Logistics",
  description: "Manage your shipments, link orders, and mall purchases.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();

  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (!user || error) {
    redirect("/login");
  }

  const [stats, walletRes] = await Promise.all([
    getDashboardStats(),
    getSecureWalletBalance()
  ]);

  // Pass children to the client layout for navigation and framer-motion animations
  return (
    <>
      <DashboardClientLayout stats={stats} walletBalance={walletRes.available_balance}>
        {children}
      </DashboardClientLayout>
      <PushPrompt />
      <WelcomeModal createdAt={user.created_at} userId={user.id} />
    </>
  );
}
