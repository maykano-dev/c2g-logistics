import MfaVerifyForm from './mfa-verify-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Two-Factor Authentication | C2G Logistics',
  description: 'Verify your identity to access C2G Logistics.',
};

export default function MfaLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[150px] rounded-full animate-pulse -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 blur-[120px] rounded-full animate-pulse delay-1000 -z-10" />

      <div className="w-full max-w-md bg-secondary/30 backdrop-blur-xl border border-border/50 rounded-3xl p-8 shadow-2xl relative z-10 animate-fade-in">
        <MfaVerifyForm />
      </div>
    </div>
  );
}
