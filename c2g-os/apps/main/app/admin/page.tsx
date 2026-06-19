'use client';

import { useState, useEffect, useRef, useTransition } from 'react';
import AdminLogin from '@/components/admin/admin-login';
import { verifyAdminPin } from './actions';

export default function AdminSecretEntry() {
  const [unlocked, setUnlocked] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep focus on hidden input
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
    if (pin.length >= 4) {
      startTransition(async () => {
        const result = await verifyAdminPin(pin);
        if (result.success) {
          setUnlocked(true);
          setError('');
        } else {
          // Wrong PIN — clear after brief delay so the user doesn't know exactly when it checked
          setTimeout(() => setPin(''), 300);
          setError('');
        }
      });
    }
  }, [pin]);

  if (unlocked) {
    return <AdminLogin />;
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      {/* 
        Purposefully designed to look like a broken or blank page.
        Only a subtle lock icon appears if they interact.
        PIN is now verified server-side — no credentials in browser bundle.
      */}
      <input 
        ref={inputRef}
        type="password"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
        className="absolute opacity-0 w-1 h-1"
        autoFocus
        autoComplete="off"
        disabled={isPending}
      />
    </div>
  );
}
