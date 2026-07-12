"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { createClient } from '@/utils/supabase/client';
import { Loader2, Camera, History, Keyboard, CheckCircle2, XCircle, AlertCircle, ShoppingCart } from 'lucide-react';


type ScanLog = {
  id: string;
  trackingNumber: string;
  customerName: string;
  status: 'updated' | 'already_processed' | 'not_found' | 'error';
  message: string;
  timestamp: Date;
};

export default function ScannerClient() {
  const [isScanning, setIsScanning] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [scanLogs, setScanLogs] = useState<ScanLog[]>([]);
  const [manualInput, setManualInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const supabase = createClient();

  const handleScan = useCallback(async (decodedText: string) => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      // Clean up tracking number
      const trackingRaw = decodedText.replace(/\s+/g, '').toUpperCase();
      
      // Basic formatting cleanup, removing YT, JT prefixes if needed for DB matching
      // but the process_scanned_package_bulk RPC handles candidates.
      const match = trackingRaw.match(/\d{8,}/);
      const candidates = [trackingRaw];
      if (match && match[0] !== trackingRaw) {
        candidates.push(match[0]);
      }

      // Call the optimized RPC
      const { data, error } = await supabase.rpc('process_scanned_package_bulk', {
        candidates
      });

      if (error) throw error;

      const newLog: ScanLog = {
        id: crypto.randomUUID(),
        trackingNumber: trackingRaw,
        customerName: data?.customer_name || 'Unknown',
        status: data?.status === 'updated' ? 'updated' : data?.status === 'already_processed' ? 'already_processed' : 'not_found',
        message: data?.status === 'updated' ? 'Package marked as IN WAREHOUSE' : data?.status === 'already_processed' ? `Already processed (${data.current_status})` : 'Package not found in database',
        timestamp: new Date(),
      };

      setScanLogs(prev => [newLog, ...prev]);

      // Play audio feedback
      if (newLog.status === 'updated') {
        new Audio('/sounds/success.mp3').play().catch(() => {});
        navigator.vibrate?.([100, 50, 100]);
      } else if (newLog.status === 'already_processed') {
        new Audio('/sounds/info.mp3').play().catch(() => {});
        navigator.vibrate?.([50]);
      } else {
        new Audio('/sounds/error.mp3').play().catch(() => {});
        navigator.vibrate?.([200, 100, 200]);
      }

    } catch (err) {
      console.error(err);
      setScanLogs(prev => [{
        id: crypto.randomUUID(),
        trackingNumber: decodedText,
        customerName: 'Error',
        status: 'error',
        message: 'Database connection failed',
        timestamp: new Date(),
      }, ...prev]);
    } finally {
      // Debounce slightly to prevent double scans
      setTimeout(() => setIsProcessing(false), 2000);
    }
  }, [isProcessing, supabase]);

  const startScanner = async () => {
    try {
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode("reader");
      }
      await scannerRef.current.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 },
        (decodedText) => handleScan(decodedText),
        () => {} // Ignore frame errors
      );
      setIsScanning(true);
      setHasCameraPermission(true);
    } catch (err) {
      console.error(err);
      setHasCameraPermission(false);
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current && isScanning) {
      try {
        await scannerRef.current.stop();
        setIsScanning(false);
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    startScanner();
    return () => {
      stopScanner();
    };
  }, []);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    handleScan(manualInput.trim());
    setManualInput('');
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-zinc-950 text-zinc-50 overflow-hidden font-sans">
      {/* Header */}
      <header className="px-4 py-3 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between z-10 shrink-0 shadow-md">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Camera className="w-5 h-5 text-blue-500" />
            Scanner
          </h1>
          <p className="text-xs text-zinc-400">Warehouse Arrival Processing</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <div className="text-sm font-bold text-green-400">{scanLogs.filter(l => l.status === 'updated').length}</div>
            <div className="text-[10px] uppercase tracking-wider text-zinc-500">Scanned</div>
          </div>
        </div>
      </header>

      {/* Main Scanner Area */}
      <main className="flex-1 relative bg-black flex flex-col">
        {/* Camera Viewfinder */}
        <div className="absolute inset-0 z-0">
          <div id="reader" className="w-full h-full object-cover [&>video]:object-cover [&>video]:w-full [&>video]:h-full border-none"></div>
          
          {hasCameraPermission === false && (
            <div className="absolute inset-0 bg-zinc-900 flex flex-col items-center justify-center p-6 text-center">
              <Camera className="w-12 h-12 text-zinc-500 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Camera Access Denied</h3>
              <p className="text-zinc-400 mb-6">Please enable camera permissions in your browser settings to use the scanner.</p>
              <button onClick={startScanner} className="px-6 py-3 bg-blue-600 rounded-full font-bold">
                Try Again
              </button>
            </div>
          )}
        </div>

        {/* HUD Overlay */}
        <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between pb-24">
          <div className="p-4 flex justify-center">
            {isProcessing && (
              <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 border border-white/10 animate-fade-in">
                <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                <span className="text-sm font-bold">Processing...</span>
              </div>
            )}
          </div>
          
          {/* Latest Scan Result Toast */}
          <div className="p-4 flex flex-col gap-2 pointer-events-auto">
            {scanLogs[0] && (
              <div className={`p-4 rounded-2xl shadow-2xl backdrop-blur-md border animate-slide-up transition-all ${
                scanLogs[0].status === 'updated' ? "bg-green-500/20 border-green-500/50" : 
                scanLogs[0].status === 'already_processed' ? "bg-blue-500/20 border-blue-500/50" :
                "bg-red-500/20 border-red-500/50"
              }`}>
                <div className="flex items-start gap-3">
                  {scanLogs[0].status === 'updated' ? <CheckCircle2 className="w-6 h-6 text-green-400 shrink-0 mt-0.5" /> :
                   scanLogs[0].status === 'already_processed' ? <AlertCircle className="w-6 h-6 text-blue-400 shrink-0 mt-0.5" /> :
                   <XCircle className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-lg leading-tight break-all">{scanLogs[0].trackingNumber}</h3>
                      <span className="text-[10px] text-zinc-400 whitespace-nowrap ml-2">Just now</span>
                    </div>
                    {scanLogs[0].customerName !== 'Unknown' && (
                      <div className="text-sm font-bold text-white mt-1 bg-white/10 inline-block px-2 py-0.5 rounded">
                        {scanLogs[0].customerName}
                      </div>
                    )}
                    <p className={`text-sm mt-1 ${
                      scanLogs[0].status === 'updated' ? "text-green-300" : 
                      scanLogs[0].status === 'already_processed' ? "text-blue-300" :
                      "text-red-300"
                    }`}>
                      {scanLogs[0].message}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Bottom Sheet - Manual Entry & History */}
      <div className={`absolute bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 rounded-t-[2rem] transition-transform duration-300 ease-in-out z-50 flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.5)] ${
        showHistory ? "h-[85dvh] translate-y-0" : "h-[90px] translate-y-0"
      }`}>
        {/* Drag Handle */}
        <div 
          className="w-full flex justify-center py-3 cursor-pointer shrink-0"
          onClick={() => setShowHistory(!showHistory)}
        >
          <div className="w-12 h-1.5 bg-zinc-700 rounded-full" />
        </div>

        {/* Collapsed View (Manual Input) */}
        <div className="px-6 pb-6 shrink-0 flex gap-2">
          <form onSubmit={handleManualSubmit} className="flex-1 relative flex items-center">
            <Keyboard className="absolute left-4 w-5 h-5 text-zinc-500" />
            <input 
              type="text" 
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              placeholder="Manual entry..."
              className="w-full h-12 bg-zinc-800 rounded-full pl-12 pr-4 border border-zinc-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </form>
          {!showHistory && (
            <button 
              onClick={() => setShowHistory(true)}
              className="w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0 hover:bg-zinc-700 transition-colors"
            >
              <History className="w-5 h-5 text-zinc-300" />
            </button>
          )}
        </div>

        {/* Expanded View (History) */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold flex items-center gap-2">
              <History className="w-4 h-4 text-blue-400" />
              Scan History
            </h3>
            <button 
              onClick={() => setScanLogs([])}
              className="text-xs font-bold text-zinc-500 hover:text-zinc-300"
            >
              CLEAR
            </button>
          </div>

          {scanLogs.length === 0 ? (
            <div className="text-center py-10 text-zinc-500 flex flex-col items-center">
              <ShoppingCart className="w-10 h-10 mb-2 opacity-20" />
              <p className="text-sm">No scans in this session.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {scanLogs.map((log) => (
                <div key={log.id} className="p-3 bg-zinc-800/50 rounded-xl border border-zinc-800 flex items-center gap-3">
                  <div className={`w-2 h-10 rounded-full shrink-0 ${
                    log.status === 'updated' ? "bg-green-500" : 
                    log.status === 'already_processed' ? "bg-blue-500" : "bg-red-500"
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <p className="font-mono text-sm font-bold truncate">{log.trackingNumber}</p>
                      <span className="text-[10px] text-zinc-500 ml-2 shrink-0">
                        {log.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="flex justify-between items-end">
                      <p className="text-xs text-zinc-400 truncate">{log.message}</p>
                      {log.customerName !== 'Unknown' && (
                        <span className="text-[10px] font-bold bg-zinc-700 px-1.5 py-0.5 rounded ml-2 shrink-0">
                          {log.customerName}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
