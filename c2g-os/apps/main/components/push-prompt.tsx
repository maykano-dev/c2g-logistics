'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { BellRing, X } from 'lucide-react';

// Replace with your VAPID public key
const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function PushPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') return;

    // Check if push notifications are supported
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      return;
    }

    // Register service worker if not already
    navigator.serviceWorker.register('/sw.js').then((registration) => {
      console.log('Service Worker registered with scope:', registration.scope);
      
      const dismissed = localStorage.getItem('pushPromptResponded');
      
      // Check current permission state
      if (Notification.permission === 'default') {
        if (!dismissed) {
          setShowPrompt(true);
        }
      } else if (Notification.permission === 'granted') {
        // If granted but we haven't saved their preference as 'responded', do it now
        if (!dismissed) localStorage.setItem('pushPromptResponded', 'true');
        // Ensure we have a subscription and it's saved in DB
        subscribeUser(registration);
      } else if (Notification.permission === 'denied') {
        if (!dismissed) localStorage.setItem('pushPromptResponded', 'true');
      }
    }).catch(err => {
      console.error('Service worker registration failed:', err);
    });
  }, []);

  const subscribeUser = async (registration?: ServiceWorkerRegistration) => {
    try {
      const reg = registration || await navigator.serviceWorker.ready;
      
      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
      });

      // Save to Supabase
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const subJSON = subscription.toJSON();

      await supabase.from('push_subscriptions').upsert({
        user_id: user.id,
        endpoint: subJSON.endpoint,
        p256dh: subJSON.keys?.p256dh,
        auth: subJSON.keys?.auth
      }, { onConflict: 'endpoint' });

      console.log('Push subscription saved successfully');
    } catch (error) {
      console.error('Failed to subscribe user:', error);
    }
  };

  const handleEnable = async () => {
    const permission = await Notification.requestPermission();
    localStorage.setItem('pushPromptResponded', 'true');
    if (permission === 'granted') {
      await subscribeUser();
      setShowPrompt(false);
    } else {
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem('pushPromptResponded', 'true');
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-primary text-primary-foreground p-4 rounded-xl shadow-2xl z-50 animate-fade-in flex flex-col gap-3">
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-3">
          <div className="bg-white/20 p-2 rounded-full shrink-0">
            <BellRing className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold">Enable Notifications</h4>
            <p className="text-sm opacity-90 leading-tight mt-0.5">
              Get instantly notified when your packages arrive or orders are updated.
            </p>
          </div>
        </div>
        <button onClick={handleDismiss} className="text-white/70 hover:text-white transition-colors shrink-0">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="flex gap-2">
        <button onClick={handleEnable} className="flex-1 bg-white text-primary hover:bg-white/90 font-bold py-2 rounded-lg transition-colors text-sm">
          Enable
        </button>
      </div>
    </div>
  );
}
