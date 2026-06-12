import ImporterRegisterClient from "./register-client";
import { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Become a C2G Importer | Start Your Business",
  description: "Join the C2G Importer Platform. We handle the procurement and logistics, you handle the sales.",
};

export default async function ImporterRegistrationPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // If not logged in, force login but redirect back here
  if (!user) {
    redirect("/login?next=/importers/register");
  }

  // Check if they are already an approved importer
  const { data: existingApp } = await supabase
    .from('importers')
    .select('status')
    .eq('user_id', user.id)
    .single();

  if (existingApp?.status === 'approved') {
    redirect("/importer-dashboard");
  }

  return (
    <div className="min-h-screen bg-background relative flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[1000px] h-[1000px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[100px] translate-y-1/2" />
      </div>

      <div className="relative z-10 w-full">
        <ImporterRegisterClient />
      </div>
    </div>
  );
}
