import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { SignupForm } from "./signup-form";
import { ShieldCheck, PackageCheck, Zap } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AuthRightPanel } from "@/components/auth-right-panel";

export const metadata: Metadata = {
  title: "Signup | C2G",
  description: "Create your C2G Logistics account",
};

export default async function SignupPage(
  props: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
  }
) {
  const searchParams = await props.searchParams;
  
  if (searchParams?.code) {
    redirect(`/auth/callback?code=${searchParams.code}`);
  }

  const headersList = await headers();
  const authStatus = headersList.get('x-auth-status');
  
  if (authStatus === 'authenticated') {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-[100dvh] lg:h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[150px] rounded-full animate-drift" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 blur-[150px] rounded-full animate-drift-slow" />
      </div>
      
      {/* Card container — full height on desktop, scrollable form inside */}
      <div className="w-full flex z-10 max-w-6xl mx-auto h-auto lg:h-[92vh] sm:rounded-2xl sm:shadow-2xl sm:border border-border/50 bg-background/80 backdrop-blur-xl overflow-hidden">
        
        {/* Left Column: Form — scrollable so it never clips */}
        <div className="w-full lg:w-1/2 flex flex-col justify-start lg:justify-center px-5 py-8 sm:px-8 xl:px-10 overflow-y-auto">
          <div className="max-w-[400px] mx-auto w-full space-y-3 lg:space-y-4 xl:space-y-5">
            {/* Logo & Header */}
            <div className="flex flex-col animate-fade-in text-center sm:text-left">
              <div className="w-14 h-14 lg:w-16 lg:h-16 xl:w-20 xl:h-20 relative flex items-center justify-center sm:justify-start mb-2 mx-auto sm:mx-0">
                <Image src="/logo.png" alt="C2G Logistics Logo" fill className="object-contain" />
              </div>
              <h1 className="text-2xl lg:text-3xl xl:text-4xl font-black tracking-tight text-foreground mb-1">
                Join the C2G Family Today
              </h1>
              <p className="hidden sm:block text-muted-foreground text-sm">
                Join 450+ customers using C2G to source, ship, and grow.
              </p>
              <p className="block sm:hidden text-muted-foreground text-sm font-medium mt-1">
                Your China, our responsibility
              </p>
            </div>

            <SignupForm />

            <div className="text-center text-sm text-muted-foreground animate-slide-up-6">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:text-primary/80 font-bold transition-colors">
                Sign in
              </Link>
            </div>
            
            {/* Mobile Trust Badges (Only visible on small screens) */}
            <div className="flex lg:hidden pt-2 border-t border-border/50 flex-wrap justify-center gap-3 animate-slide-up-6">
              <span className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-[11px] font-bold uppercase tracking-wider leading-none h-7">
                <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Fast
              </span>
              <span className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-[11px] font-bold uppercase tracking-wider leading-none h-7">
                <PackageCheck className="w-3.5 h-3.5 text-primary" /> Reliable
              </span>
              <span className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-[11px] font-bold uppercase tracking-wider leading-none h-7">
                <Zap className="w-3.5 h-3.5 text-primary" /> Seamless
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Value Proposition (Hidden on mobile) */}
        <AuthRightPanel />

      </div>
    </div>
  );
}
