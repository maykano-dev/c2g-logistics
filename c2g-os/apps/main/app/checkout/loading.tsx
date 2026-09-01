import { Loader2 } from "lucide-react";

export default function CheckoutLoading() {
  return (
    <div className="bg-background min-h-[80vh] flex flex-col items-center justify-center">
      <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
      <h2 className="text-xl font-bold tracking-tight">Preparing Checkout...</h2>
      <p className="text-muted-foreground mt-2 text-sm">Securely loading your details.</p>
    </div>
  );
}
