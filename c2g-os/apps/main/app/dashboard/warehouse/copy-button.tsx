'use client';

import { Copy, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export function CopyAddressButton({ addressText }: { addressText: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(addressText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button 
      onClick={handleCopy}
      className="w-full mt-4 bg-primary text-primary-foreground py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
    >
      {copied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
      {copied ? "Copied!" : "Copy Address"}
    </button>
  );
}
