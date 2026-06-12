import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { Metadata } from "next";
import DashboardClientLayout from "./dashboard-client-layout";
import { PushPrompt } from "../../components/push-prompt";

export const metadata: Metadata = {
  title: "Dashboard | C2G Logistics",
  description: "Manage your shipments, link orders, and mall purchases.",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // Strict Auth Guard: If no valid session exists, immediately redirect to login
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    redirect("/login");
  }

  // Pass children to the client layout for navigation and framer-motion animations
  return (
    <>
      <DashboardClientLayout>
        {children}
      </DashboardClientLayout>
      <PushPrompt />
    </>
  );
}
