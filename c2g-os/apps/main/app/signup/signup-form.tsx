"use client";

import { useState, useActionState, useRef, useEffect } from "react";
import { signup, verifySignupOtp, resendSignupOtp } from "../auth/actions";
import { PhoneInput } from "../../components/phone-input";
import { Loader2, Eye, EyeOff, User, Mail, Lock, ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

export function SignupForm() {
  const router = useRouter();
  const [state, action, isPending] = useActionState(signup, null);
  const [verifyState, verifyAction, isVerifyPending] = useActionState(verifySignupOtp, null);
  
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto-focus first field on mount
    if (nameRef.current) {
      nameRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (verifyState?.success) {
      // Redirect to login or dashboard after successful verification
      setTimeout(() => {
        router.push("/login?verified=true");
      }, 1500);
    }
  }, [verifyState, router]);

  // Password strength checks
  const hasLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const strengthScore = [hasLength, hasUpper, hasNumber].filter(Boolean).length;
  
  const getStrengthColor = () => {
    if (strengthScore === 0) return "bg-border";
    if (strengthScore === 1) return "bg-red-500";
    if (strengthScore === 2) return "bg-yellow-500";
    return "bg-green-500";
  };

  const handleResend = async () => {
    if (!state?.email) return;
    setResending(true);
    setResendMessage("");
    const result = await resendSignupOtp(state.email);
    setResending(false);
    if (result.error) {
      setResendMessage(result.error);
    } else {
      setResendMessage("Code resent successfully!");
    }
  };

  // OTP Verification View
  if (state?.success && !verifyState?.success) {
    return (
      <div className="space-y-6 animate-scale-in">
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-bold">Check your email</h3>
          <p className="text-muted-foreground text-sm">
            We've sent a verification code to <br/>
            <span className="font-bold text-foreground">{state.email}</span>
          </p>
        </div>

        <form action={verifyAction} className="space-y-4">
          <input type="hidden" name="email" value={state.email} />
          
          {verifyState?.error && (
            <div className="p-3 text-sm font-medium bg-destructive/10 text-destructive rounded-md border border-destructive/20 animate-fade-in">
              {verifyState.error}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="token" className="text-sm font-medium">Verification Code</label>
            <input
              id="token"
              name="token"
              type="text"
              placeholder="Enter code"
              required
              className="flex h-12 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-center text-lg tracking-widest ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 backdrop-blur-sm transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isVerifyPending}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-bold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] h-12 px-8 w-full shadow-lg shadow-primary/25"
          >
            {isVerifyPending ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              "Verify Account"
            )}
          </button>
        </form>

        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">Didn't receive the code?</p>
          <button 
            onClick={handleResend}
            disabled={resending}
            className="text-sm font-bold text-primary hover:text-primary/80 transition-colors disabled:opacity-50"
          >
            {resending ? "Resending..." : "Resend Code"}
          </button>
          {resendMessage && (
            <p className={`text-xs mt-1 ${resendMessage.includes("success") ? "text-green-500" : "text-destructive"}`}>
              {resendMessage}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Success verified view
  if (verifyState?.success) {
    return (
      <div className="text-center space-y-4 animate-scale-in py-8">
        <div className="mx-auto w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        <h3 className="text-2xl font-bold">Account Verified!</h3>
        <p className="text-muted-foreground">Redirecting you to login...</p>
        <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto mt-4" />
      </div>
    );
  }

  // Initial Signup Form
  return (
    <form action={action} className="space-y-4 w-full max-w-sm mx-auto">
      {state?.error && (
        <div className="p-3 text-sm font-medium bg-destructive/10 text-destructive rounded-md border border-destructive/20 animate-fade-in flex items-start gap-2">
          <ShieldCheck className="w-5 h-5 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      <div className="space-y-2 animate-slide-up-1">
        <label htmlFor="name" className="text-sm font-medium leading-none">
          Full Name
        </label>
        <div className="relative group">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
            <User className="w-4 h-4" />
          </div>
          <input
            ref={nameRef}
            id="name"
            name="name"
            type="text"
            placeholder="Kwame Mensah"
            required
            className="flex h-11 w-full rounded-md border border-input bg-background/50 pl-10 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-all backdrop-blur-sm"
          />
        </div>
      </div>

      <div className="space-y-2 animate-slide-up-2">
        <label className="text-sm font-medium leading-none">
          Phone Number
        </label>
        <PhoneInput />
      </div>

      <div className="space-y-2 animate-slide-up-3">
        <label htmlFor="email" className="text-sm font-medium leading-none">
          Email Address
        </label>
        <div className="relative group">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
            <Mail className="w-4 h-4" />
          </div>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="kwame@example.com"
            required
            className="flex h-11 w-full rounded-md border border-input bg-background/50 pl-10 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-all backdrop-blur-sm"
          />
        </div>
      </div>
      
      <div className="space-y-2 animate-slide-up-4">
        <label htmlFor="password" className="text-sm font-medium leading-none">
          Password
        </label>
        <div className="relative group">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
            <Lock className="w-4 h-4" />
          </div>
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a strong password"
            className="flex h-11 w-full rounded-md border border-input bg-background/50 pl-10 pr-10 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-all backdrop-blur-sm"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        {/* Password Strength Indicator */}
        {password.length > 0 && (
          <div className="pt-2 space-y-2 animate-fade-in">
            <div className="flex gap-1 h-1.5 w-full">
              {[1, 2, 3].map((step) => (
                <div 
                  key={step} 
                  className={`flex-1 rounded-full transition-colors duration-300 ${strengthScore >= step ? getStrengthColor() : "bg-border"}`} 
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className={`flex items-center gap-1 ${hasLength ? "text-green-500" : ""}`}>
                {hasLength && <CheckCircle2 className="w-3 h-3" />} 8+ chars
              </span>
              <span className={`flex items-center gap-1 ${hasUpper ? "text-green-500" : ""}`}>
                {hasUpper && <CheckCircle2 className="w-3 h-3" />} Uppercase
              </span>
              <span className={`flex items-center gap-1 ${hasNumber ? "text-green-500" : ""}`}>
                {hasNumber && <CheckCircle2 className="w-3 h-3" />} Number
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="pt-4 animate-slide-up-5">
        <button
          type="submit"
          disabled={isPending || strengthScore < 3}
          className="group inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-bold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] h-12 px-8 w-full shadow-lg shadow-primary/25"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Creating Account...
            </>
          ) : (
            <>
              Create My Free Account
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </div>
      
      <p className="text-xs text-center text-muted-foreground mt-4 animate-slide-up-6">
        By signing up, you agree to our Terms of Service and Privacy Policy.
      </p>
    </form>
  );
}
