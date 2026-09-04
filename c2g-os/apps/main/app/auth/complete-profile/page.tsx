import { CompleteProfileForm } from "./complete-profile-form";
import Link from "next/link";
import { PackageSearch } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Complete Your Profile | C2G Logistics",
  description: "Complete your C2G profile to get started.",
};

export default function CompleteProfilePage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background">
      {/* Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[40%] -left-[20%] w-[80%] h-[80%] rounded-full bg-primary/20 blur-[120px] mix-blend-screen opacity-50 animate-pulse-slow" />
        <div className="absolute -bottom-[40%] -right-[20%] w-[80%] h-[80%] rounded-full bg-primary/20 blur-[120px] mix-blend-screen opacity-50 animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="flex flex-col items-center justify-center space-y-6 text-center mb-8 animate-fade-in">
          <Link href="/" className="inline-flex items-center justify-center bg-background/50 backdrop-blur-sm p-4 rounded-full border border-primary/20 shadow-lg shadow-primary/10 hover:scale-105 transition-transform">
            <PackageSearch className="w-8 h-8 text-primary" />
          </Link>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Almost there!</h1>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto">
              You've successfully connected with Google. Just provide your active phone number to finish setting up your account.
            </p>
          </div>
        </div>

        <CompleteProfileForm />
      </div>
    </main>
  );
}
