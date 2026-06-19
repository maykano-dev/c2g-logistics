'use client';

import { Package, Plane, Ship, MapPin, Clock, ArrowLeft, CheckCircle2, Lock } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { updatePackageStatus } from "../actions";
import PackagePayButton from "../package-pay-button";

// Dynamically import the map component with SSR disabled to prevent Leaflet 'window is not defined' errors
const TrackingMap = dynamic(() => import('./tracking-map'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-secondary/20 rounded-xl border border-border/50 animate-pulse">
      <div className="flex flex-col items-center gap-2 text-muted-foreground">
        <MapPin className="w-8 h-8 animate-bounce" />
        <p className="font-medium">Loading Map Data...</p>
      </div>
    </div>
  )
});

interface TrackerClientProps {
  pkg: any;
}

export default function TrackerClient({ pkg }: TrackerClientProps) {
  const [progress, setProgress] = useState(0);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  const [statusLabel, setStatusLabel] = useState('Calculating...');

  const modeLower = (pkg.method || 'pending').toLowerCase();
  const isAir = modeLower.includes('air') || modeLower.includes('express') || modeLower.includes('normal');
  const durationDays = isAir ? (modeLower.includes('express') ? 7 : 16) : 60;
  
  // Only start the journey if shipment_start_date is set (meaning admin has dispatched it)
  const hasStarted = !!pkg.shipment_start_date;
  const startDateMs = hasStarted ? new Date(pkg.shipment_start_date).getTime() : 0;
  const totalMs = durationDays * 24 * 60 * 60 * 1000;
  const arrivalMs = hasStarted ? startDateMs + totalMs : 0;

  useEffect(() => {
    const updateProgress = () => {
      if (!hasStarted) {
        setProgress(0);
        setCountdown({ days: durationDays, hours: 0, mins: 0, secs: 0 });
        setStatusLabel(isAir ? 'Waiting for Flight Departure' : 'Waiting for Vessel Departure');
        return;
      }

      const elapsed = Date.now() - startDateMs;
      const calcProgress = Math.min(1, Math.max(0, elapsed / totalMs));
      setProgress(calcProgress);

      const remaining = arrivalMs - Date.now();
      if (remaining <= 0) {
        setCountdown({ days: 0, hours: 0, mins: 0, secs: 0 });
        setStatusLabel('Clearing Customs');

        // Automatically update DB if it's still marked as in transit or pending
        if (pkg.status && !['clearing_customs', 'cleared', 'delivered', 'ready_for_pickup'].includes(pkg.status)) {
          updatePackageStatus(pkg.id, 'clearing_customs').catch(console.error);
          pkg.status = 'clearing_customs'; // Prevent multiple calls
        }
      } else {
        const totalSecs = Math.floor(remaining / 1000);
        setCountdown({
          days: Math.floor(totalSecs / 86400),
          hours: Math.floor((totalSecs % 86400) / 3600),
          mins: Math.floor((totalSecs % 3600) / 60),
          secs: totalSecs % 60
        });

        if (calcProgress < 0.2) setStatusLabel(isAir ? 'Flight Departure' : 'In transit to Guangzhou Port');
        else if (calcProgress < 0.8) setStatusLabel(isAir ? 'In Air Transit' : 'Ocean Transit');
        else if (calcProgress < 0.95) setStatusLabel(isAir ? 'Approaching Accra' : 'Approaching Tema');
        else setStatusLabel('Final Clearance');
      }
    };

    updateProgress();
    const interval = setInterval(updateProgress, 1000);
    return () => clearInterval(interval);
  }, [startDateMs, totalMs, arrivalMs, isAir, hasStarted, durationDays]);

  const progressPct = Math.round(progress * 100);
  const isDelivered = progress >= 1;

  const getShippingModeDisplay = () => {
    if (modeLower.includes('express')) return { label: 'Air Express', icon: <Plane className="w-5 h-5 text-blue-500" /> };
    if (modeLower.includes('normal') || isAir) return { label: 'Air Normal', icon: <Plane className="w-5 h-5 text-blue-400" /> };
    return { label: 'Sea Freight', icon: <Ship className="w-5 h-5 text-green-500" /> };
  };

  const modeDisplay = getShippingModeDisplay();

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Link href="/dashboard/packages" className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Back to Packages
          </Link>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              {modeDisplay.icon}
              Tracking: {pkg.tracking_number}
            </h1>
            <p className="text-muted-foreground mt-1 max-w-2xl line-clamp-1">{pkg.items_description}</p>
          </div>
          <div className="bg-primary/10 text-primary border border-primary/20 px-4 py-2 rounded-lg font-mono font-bold text-sm">
            {modeDisplay.label} &middot; {isAir ? (modeLower.includes('express') ? '3-7' : '12-16') : '50-60'} Days
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6 lg:gap-8 max-w-3xl mx-auto relative">
        {pkg.registration_fee_paid === false && (
          <div className="absolute inset-0 z-[9999] flex flex-col items-center justify-center bg-background/60 backdrop-blur-xl rounded-2xl border border-border/50">
            <div className="glass-panel p-6 flex flex-col items-center max-w-xs text-center shadow-2xl animate-in zoom-in-95 duration-500">
              <div className="w-12 h-12 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(249,115,22,0.3)]">
                <Lock className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold mb-2">Registration Required</h2>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                Please pay the ₵5 package registration fee to unlock live satellite tracking, journey history, and status updates.
              </p>
              <div className="w-full transform transition hover:scale-[1.02]">
                <PackagePayButton packageId={pkg.id} />
              </div>
            </div>
          </div>
        )}

        <div className={`space-y-6 lg:space-y-8 ${pkg.registration_fee_paid === false ? 'pointer-events-none opacity-30 select-none blur-[10px] max-h-[450px] overflow-hidden transition-all duration-1000' : ''}`}>
          {/* Progress Card */}
        <div className="glass-panel p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[40px] -mr-10 -mt-10 pointer-events-none" />
          
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isDelivered ? 'bg-green-500/20 text-green-500' : 'bg-primary/20 text-primary'}`}>
              {isDelivered ? <CheckCircle2 className="w-6 h-6" /> : <Clock className="w-6 h-6 animate-pulse" />}
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Current Status</p>
              <p className={`text-lg font-bold ${isDelivered ? 'text-green-500' : 'text-foreground'}`}>{statusLabel}</p>
            </div>
          </div>

          <div className="space-y-2 mb-6">
            <div className="flex justify-between text-sm font-medium">
              <span>Journey Progress</span>
              <span className="text-primary">{progressPct}%</span>
            </div>
            <div className="h-3 w-full bg-secondary/50 rounded-full overflow-hidden border border-border/50">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ease-out relative ${isDelivered ? 'bg-green-500' : 'bg-primary'}`}
                style={{ width: `${progressPct}%` }}
              >
                {!isDelivered && (
                  <>
                    <div className="absolute inset-0 w-full h-full" style={{
                      backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent)',
                      backgroundSize: '1rem 1rem',
                      animation: 'progressBarStripes 1s linear infinite'
                    }} />
                    <style>{`
                      @keyframes progressBarStripes {
                        from { background-position: 1rem 0; }
                        to { background-position: 0 0; }
                      }
                    `}</style>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center bg-secondary/20 p-3 rounded-lg border border-border/50">
            <div className="flex flex-col">
              <span className="text-xl font-bold text-foreground">{String(countdown.days).padStart(2, '0')}</span>
              <span className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">Days</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-foreground">{String(countdown.hours).padStart(2, '0')}</span>
              <span className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">Hrs</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-foreground">{String(countdown.mins).padStart(2, '0')}</span>
              <span className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">Mins</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-foreground">{String(countdown.secs).padStart(2, '0')}</span>
              <span className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">Secs</span>
            </div>
          </div>
        </div>

        {/* Main Area: Interactive Map (Square) */}
        <div className="w-full aspect-square flex flex-col">
          <div className="glass-panel p-2 flex-1 relative overflow-hidden flex flex-col">
            <TrackingMap isAir={isAir} progress={progress} />
          </div>
        </div>

        {/* Details Card */}
        <div className="glass-panel p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-muted-foreground" /> Package Details
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-border/50 last:border-0 last:pb-0">
              <span className="text-sm text-muted-foreground font-medium">Registration Fee</span>
              {pkg.registration_fee_paid ? (
                <span className="text-xs font-bold px-2 py-1 bg-green-500/10 text-green-500 rounded-md">Paid</span>
              ) : (
                <span className="text-xs font-bold px-2 py-1 bg-orange-500/10 text-orange-500 rounded-md">Unpaid</span>
              )}
            </div>
            <div className="flex justify-between items-center py-3 border-b border-border/50 last:border-0 last:pb-0">
              <span className="text-sm text-muted-foreground font-medium">Registered On</span>
              <span className="text-sm font-semibold">{new Date(pkg.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-border/50 last:border-0 last:pb-0">
              <span className="text-sm text-muted-foreground font-medium">Est. Arrival</span>
              <span className="text-sm font-semibold">{hasStarted ? new Date(arrivalMs).toLocaleDateString() : 'Pending Departure'}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-border/50 last:border-0 last:pb-0">
              <span className="text-sm text-muted-foreground font-medium">Weight</span>
              <span className="text-sm font-semibold">{pkg.weight || 'Not set'}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-border/50 last:border-0 last:pb-0">
              <span className="text-sm text-muted-foreground font-medium">CBM</span>
              <span className="text-sm font-semibold">{pkg.cbm || 'Not set'}</span>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
