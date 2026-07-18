"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { createClient } from '@/utils/supabase/client';
import { Loader2, Camera, CheckCircle2, XCircle, AlertCircle, ScanLine, Keyboard, LogOut } from 'lucide-react';

import { ScanLog } from './scanner-client';
import { processScannedPackage } from './actions';

export default function ScannerTab({ onScanLog, sessionCount }: { onScanLog: (log: ScanLog) => void, sessionCount: number }) {
  const [isScanning, setIsScanning] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [scanLog, setScanLog] = useState<ScanLog | null>(null); // Only keep the latest for toast
  const [manualInput, setManualInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isProcessingRef = useRef(false);
  const lastScannedCodeRef = useRef<string>('');
  const lastScannedTimeRef = useRef<number>(0);
  const isInitializingRef = useRef(false);
  const supabase = createClient();

  const handleScan = useCallback(async (decodedText: string) => {
    const now = Date.now();
    // Debounce exact same barcode for 3 seconds to prevent duplicate logs
    if (lastScannedCodeRef.current === decodedText && (now - lastScannedTimeRef.current) < 3000) {
      return;
    }
    
    // Global processing lock
    if (isProcessingRef.current) return;
    
    lastScannedCodeRef.current = decodedText;
    lastScannedTimeRef.current = now;
    
    isProcessingRef.current = true;
    setIsProcessing(true);

    try {
      const candidatesArray = extractAllDigitSequences(decodedText);

      const { success, data, error } = await processScannedPackage(candidatesArray);

      if (!success || !data) {
        throw new Error(error || 'Failed to process scan');
      }

      const newLog: ScanLog = {
        id: crypto.randomUUID(),
        trackingNumber: data.tracking_number || decodedText,
        customerName: data.customer_name || 'Unknown',
        status: data.status as 'updated' | 'already_processed' | 'not_found' | 'error',
        message: data.status === 'updated' ? 'Package marked as IN WAREHOUSE' : 
                 data.status === 'already_processed' ? `Already processed (${data.current_status})` : 
                 'Package not found in database',
        timestamp: new Date(),
      };

      setScanLog(newLog);
      onScanLog(newLog); // Add to global session history
      
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
      const errLog: ScanLog = {
        id: crypto.randomUUID(),
        trackingNumber: decodedText,
        customerName: 'Error',
        status: 'error',
        message: 'Database connection failed',
        timestamp: new Date(),
      };
      setScanLog(errLog);
      onScanLog(errLog);
    } finally {
      isProcessingRef.current = false;
      setTimeout(() => setIsProcessing(false), 2000);
      setTimeout(() => setScanLog(null), 4000); // Hide toast after 4s
    }
  }, [supabase]);

  const startScanner = async (isManualClick = false) => {
    if (isInitializingRef.current || isScanning) return;
    
    try {
      isInitializingRef.current = true;
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode("reader", {
          useBarCodeDetectorIfSupported: true,
          verbose: false
        });
      }

      await scannerRef.current.start(
        { facingMode: "environment" },
        { 
          fps: 20, 
          aspectRatio: 1.0,
          videoConstraints: {
            facingMode: "environment",
            width: { ideal: 1920 }, 
            height: { ideal: 1080 }
          }
        },
        (decodedText) => handleScan(decodedText),
        () => {} // ignore scan failures (happens every frame when no code is found)
      );
      
      setIsScanning(true);
      setHasCameraPermission(true);
    } catch (err: any) {
      console.error("Error starting scanner, error =", err);
      // Only set to false if it's explicitly a NotAllowedError (permission denied)
      // Otherwise it might be a hardware issue or "already in use" error
      if (err?.name === 'NotAllowedError' || err?.message?.includes('permission')) {
        setHasCameraPermission(false);
      }
      
      if (isManualClick) {
        alert("Camera Error: " + (err?.message || err));
      }
    } finally {
      isInitializingRef.current = false;
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current && isScanning && !isInitializingRef.current) {
      try {
        await scannerRef.current.stop();
        setIsScanning(false);
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    startScanner(false);
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/scanner/login';
  };

  return (
    <div className="absolute inset-0 flex flex-col bg-black">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 p-4 z-20 bg-gradient-to-b from-black/80 to-transparent pt-8 sm:pt-10 pb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ScanLine className="w-6 h-6 text-blue-500" />
            <h1 className="text-xl font-bold text-white tracking-tight">C2G Scanner</h1>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-1.5 bg-red-500/20 hover:bg-red-500/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-red-500/30 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5 text-red-400" />
            <span className="text-[11px] font-bold text-red-400 tracking-wider">LOGOUT</span>
          </button>
        </div>

        {/* Manual Input overlaying top */}
        <form onSubmit={handleManualSubmit} className="relative flex items-center shadow-2xl">
          <Keyboard className="absolute left-4 w-5 h-5 text-zinc-400" />
          <input 
            type="text" 
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            placeholder="Type tracking number manually..."
            className="w-full h-12 bg-white/10 backdrop-blur-xl rounded-2xl pl-12 pr-4 border border-white/20 text-white placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
        </form>
      </header>

      {/* Camera Viewfinder */}
      <div className="absolute inset-0 z-0">
        <div id="reader" className="w-full h-full object-cover [&>video]:object-cover [&>video]:w-full [&>video]:h-full border-none"></div>
        
        {/* Viewfinder Target Box overlay */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-[300px] h-[180px] border-2 border-white/50 rounded-2xl relative shadow-[0_0_0_4000px_rgba(0,0,0,0.6)]">
            <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-blue-500 rounded-tl-2xl"></div>
            <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-blue-500 rounded-tr-2xl"></div>
            <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-blue-500 rounded-bl-2xl"></div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-blue-500 rounded-br-2xl"></div>
            
            {isProcessing && (
              <div className="absolute inset-0 flex items-center justify-center bg-blue-500/20 backdrop-blur-sm rounded-xl">
                <Loader2 className="w-10 h-10 animate-spin text-white" />
              </div>
            )}
          </div>
        </div>

        {hasCameraPermission === false && (
          <div className="absolute inset-0 bg-zinc-950 flex flex-col items-center justify-center p-6 text-center z-30">
            <Camera className="w-16 h-16 text-zinc-600 mb-6" />
            <h2 className="text-2xl font-bold text-white mb-3">Camera Denied</h2>
            <p className="text-zinc-400 text-center max-w-xs mb-8">
              Please enable camera permissions in your browser settings to use the scanner.
            </p>
            <div className="flex flex-col gap-3 w-full max-w-xs">
              <button 
                onClick={() => startScanner(true)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors shadow-lg shadow-blue-500/20 w-full"
              >
                Request Permission
              </button>
              <div className="relative w-full">
                <input 
                  type="file" 
                  accept="image/*"
                  capture="environment"
                  onChange={async (e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setIsProcessing(true);
                      try {
                        const html5QrCode = new Html5Qrcode("reader");
                        const decodedText = await html5QrCode.scanFile(e.target.files[0]!, true);
                        await handleScan(decodedText);
                      } catch (err) {
                        alert("Could not find a barcode in this image. Please try again.");
                      } finally {
                        setIsProcessing(false);
                        e.target.value = '';
                      }
                    }
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                />
                <button className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl transition-colors border border-zinc-700 w-full">
                  Upload Barcode Image
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Toast Overlay */}
      <div className="absolute bottom-28 left-0 right-0 px-4 z-20 pointer-events-none flex flex-col justify-end">
        {scanLog && (
          <div className={`p-4 rounded-2xl shadow-2xl backdrop-blur-xl border animate-slide-up transition-all ${
            scanLog.status === 'updated' ? "bg-green-500/20 border-green-500/50" : 
            scanLog.status === 'already_processed' ? "bg-blue-500/20 border-blue-500/50" :
            "bg-red-500/20 border-red-500/50"
          }`}>
            <div className="flex items-start gap-3">
              {scanLog.status === 'updated' ? <CheckCircle2 className="w-8 h-8 text-green-400 shrink-0 mt-0.5" /> :
               scanLog.status === 'already_processed' ? <AlertCircle className="w-8 h-8 text-blue-400 shrink-0 mt-0.5" /> :
               <XCircle className="w-8 h-8 text-red-400 shrink-0 mt-0.5" />}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xl leading-tight text-white truncate">{scanLog.trackingNumber}</h3>
                {scanLog.customerName !== 'Unknown' && (
                  <div className="text-xs font-bold text-white mt-1 bg-white/20 inline-block px-2 py-0.5 rounded shadow-sm">
                    {scanLog.customerName}
                  </div>
                )}
                <p className={`text-sm mt-1.5 font-medium ${
                  scanLog.status === 'updated' ? "text-green-300" : 
                  scanLog.status === 'already_processed' ? "text-blue-300" :
                  "text-red-300"
                }`}>
                  {scanLog.message}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// Robust Tracking Number Extraction Utilities
// ----------------------------------------------------------------------
function extractAllDigitSequences(text: string): string[] {
  if (!text) return [];
  const results: string[] = [];

  // Keep the raw original text (without hyphens, spaces, custom symbols)
  const rawTrimmed = text.trim();
  if (rawTrimmed.length >= 4) {
      results.push(rawTrimmed);
      results.push(rawTrimmed.toUpperCase());
  }

  // Jingdong/JDL multi-package suffix slicer (e.g., JDVC36161125581-1-1- -> JDVC36161125581)
  const segments = text.split(/[-_ ]+/);
  if (segments.length > 0 && segments[0]) {
      const firstSegment = segments[0].trim();
      if (firstSegment.length >= 4 && firstSegment !== rawTrimmed) {
          results.push(firstSegment);
          results.push(firstSegment.toUpperCase());
      }
  }

  // QR tracking URL path segment parser
  try {
      if (text.includes('/') || text.includes('?')) {
          const urlObj = new URL(text.includes('://') ? text : 'https://' + text);
          const pathParts = urlObj.pathname.split('/').filter(Boolean);
          if (pathParts.length > 0) {
              const lastPart = pathParts[pathParts.length - 1];
              if (lastPart && lastPart.length >= 4) results.push(lastPart);
          }
          urlObj.searchParams.forEach((val) => {
              if (val && val.length >= 4) results.push(val);
          });
      }
  } catch (e) { }

  // Extract digits sequence fallback
  const clean = text.replace(/\s+/g, '');
  const match = clean.match(/\d{4,30}/g) || [];
  for (const m of match) {
      results.push(m);
  }

  // Alphanumeric variations (Strip ALL special characters including hyphens for direct matches)
  const finalCandidates: string[] = [];
  for (const cand of results) {
      finalCandidates.push(cand);
      const cleanCand = cand.replace(/[^A-Za-z0-9]/g, '');
      if (cleanCand && cleanCand !== cand) {
          finalCandidates.push(cleanCand);
      }
  }

  // Dynamic Prefix Stripping (Handles ANY unknown carrier letters)
  const primaryTarget = finalCandidates.length > 0 ? (finalCandidates[0]?.toUpperCase() || '') : '';
  if (primaryTarget) {
      const strippedLeadingLetters = primaryTarget.replace(/^[A-Z]+/i, '');
      if (strippedLeadingLetters !== primaryTarget && strippedLeadingLetters.length >= 6) {
          finalCandidates.push(strippedLeadingLetters);
      }
      
      const digitsOnly = primaryTarget.replace(/[^0-9]/g, '');
      if (digitsOnly.length >= 6) {
          finalCandidates.push(digitsOnly);
      }
  }

  return [...new Set(finalCandidates)].filter(r => r.length >= 4);
}
