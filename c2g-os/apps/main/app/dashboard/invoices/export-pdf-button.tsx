'use client';

import { Download } from "lucide-react";

export default function ExportPdfButton() {
  return (
    <button 
      onClick={() => window.print()}
      className="h-11 px-5 bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 rounded-xl font-semibold transition-colors flex items-center gap-2 whitespace-nowrap w-full sm:w-auto justify-center cursor-pointer"
    >
      <Download className="w-4 h-4" /> Export PDF
    </button>
  );
}
