import Link from "next/link";
import { Metadata } from "next";
import { SignupForm } from "./signup-form";

export const metadata: Metadata = {
  title: "Signup | C2G",
  description: "Create your C2G Logistics account",
};

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 sm:p-8 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 blur-[120px] rounded-full animate-pulse delay-700 pointer-events-none" />
      
      <div className="w-full max-w-[440px] z-10 animate-fade-in">
        <div className="glass-panel p-8 sm:p-10 shadow-2xl">
          {/* Logo & Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-primary/25">
              <span className="text-primary-foreground font-bold text-2xl">C</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Create an Account</h1>
            <p className="text-sm text-muted-foreground mt-2 text-center">
              Join C2G Logistics to manage your imports
            </p>
          </div>

          <SignupForm />

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
