'use client';

import { useState, useEffect, useRef } from 'react';
import AdminLogin from '@/components/admin/admin-login';
import { Lock } from 'lucide-react';

export default function AdminSecretEntry() {
  const [unlocked, setUnlocked] = useState(false);
  const [pin, setPin] = useState('');
  const MASTER_PIN = process.env.NEXT_PUBLIC_ADMIN_PIN || '9999'; // Note: For true security, don't expose in NEXT_PUBLIC in production if possible, but this is a pre-auth layer.
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep focus on the hidden input to capture keystrokes
  useEffect(() => {
    const handleGlobalClick = () => {
      if (!unlocked && inputRef.current) {
        inputRef.current.focus();
      }
    };
    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, [unlocked]);

  useEffect(() => {
    if (pin === MASTER_PIN) {
      setUnlocked(true);
    }
  }, [pin, MASTER_PIN]);

  if (unlocked) {
    return <AdminLogin />;
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      {/* 
        This is purposefully designed to look like a broken or blank page.
        Only a subtle lock icon appears if they tap the screen.
      */}
      <input 
        ref={inputRef}
        type="password"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
        className="absolute opacity-0 w-1 h-1"
        autoFocus
        autoComplete="off"
      />
      
      {/* Easter egg: slightly visible lock icon that fades in if they interact */}
      <div className="opacity-0 hover:opacity-5 transition-opacity cursor-default select-none pointer-events-none">
        <Lock className="w-12 h-12 text-white/20" />
      </div>
    </div>
  );
}
