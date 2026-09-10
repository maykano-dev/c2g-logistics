'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function ClientRedirect({ to }: { to: string }) {
  const router = useRouter();

  useEffect(() => {
    // A slight delay prevents the Turbopack performance measurement bug from firing
    const timeout = setTimeout(() => {
      router.replace(to);
    }, 10);
    return () => clearTimeout(timeout);
  }, [router, to]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="animate-pulse flex items-center gap-2">
        <div className="w-4 h-4 rounded-full bg-indigo-500"></div>
        <div className="text-sm font-medium text-zinc-400">Loading terminal...</div>
      </div>
    </div>
  );
}
