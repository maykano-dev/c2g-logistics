"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
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
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanLoopRef = useRef<number | null>(null);
  const barcodeDetectorRef = useRef<any>(null);
  const zxReaderRef = useRef<any>(null);
  const isScanningRef = useRef(false);

  const isProcessingRef = useRef(false);
  const lastScannedCodeRef = useRef<string>('');
  const lastScannedTimeRef = useRef<number>(0);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const isInitializingRef = useRef(false);
  const supabase = createClient();

  const playBeep = useCallback((type: 'success' | 'info' | 'error') => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(1, ctx.currentTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.3);
      } else if (type === 'info') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.2);
      } else {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.2);
        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.8, ctx.currentTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.4);
      }
    } catch (err) {
      console.warn("Audio play failed:", err);
    }
  }, []);

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
        playBeep('success');
        navigator.vibrate?.([100, 50, 100]);
      } else if (newLog.status === 'already_processed') {
        playBeep('info');
        navigator.vibrate?.([50]);
      } else {
        playBeep('error');
        navigator.vibrate?.([200, 100, 200]);
      }

    } catch (err: any) {
      console.error(err);
      const errLog: ScanLog = {
        id: crypto.randomUUID(),
        trackingNumber: decodedText,
        customerName: 'Error',
        status: 'error',
        message: err?.message || 'Database connection failed',
        timestamp: new Date(),
      };
      setScanLog(errLog);
      onScanLog(errLog);
    } finally {
      isProcessingRef.current = false;
      setTimeout(() => setIsProcessing(false), 2000);
      setTimeout(() => setScanLog(null), 4000); // Hide toast after 4s
    }
  }, [supabase, onScanLog, playBeep]);

  const startScanner = async (isManualClick = false) => {
    if (isScanning || isInitializingRef.current) return;
    
    try {
      isInitializingRef.current = true;
      
      // 1. Init AudioContext on User Interaction (iOS Safari fix)
      if (isManualClick) {
        try {
          if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
          if (audioCtxRef.current.state === 'suspended') await audioCtxRef.current.resume();
        } catch (e) {}
      }

      // 2. Get Camera Stream with 4-tier fallback
      let stream: MediaStream | null = null;
      try {
        // Attempt 1: 1080p Environment Camera
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' }, width: { ideal: 1920 }, height: { ideal: 1080 } },
          audio: false
        });
      } catch (err1) {
        try {
          // Attempt 2: 720p Environment Camera
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
            audio: false
          });
        } catch (err2) {
          try {
            // Attempt 3: Any Environment Camera
            stream = await navigator.mediaDevices.getUserMedia({
              video: { facingMode: 'environment' },
              audio: false
            });
          } catch (err3) {
            try {
              // Attempt 4: Any Camera (e.g. laptop webcam)
              stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: false
              });
            } catch (err4: any) {
              // Store the final error to be thrown
              throw err4;
            }
          }
        }
      }
      
      if (!stream) throw new Error("Could not access camera");
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setHasCameraPermission(true);

      // 3. Apply Continuous Autofocus Constraints
      const track = stream.getVideoTracks()[0];
      if (track) {
        const capabilities = track.getCapabilities ? track.getCapabilities() : {};
        const advConstraints: any = {};
        if ((capabilities as any).focusMode?.includes('continuous')) advConstraints.focusMode = 'continuous';
        if ((capabilities as any).exposureMode?.includes('continuous')) advConstraints.exposureMode = 'continuous';
        if ((capabilities as any).whiteBalanceMode?.includes('continuous')) advConstraints.whiteBalanceMode = 'continuous';
        if (Object.keys(advConstraints).length > 0) {
          try { await track.applyConstraints({ advanced: [advConstraints] }); } catch (e) {}
        }
      }

      // 4. Initialize Engines
      if ('BarcodeDetector' in window) {
        try {
          const formats = (window as any).BarcodeDetector.getSupportedFormats ? await (window as any).BarcodeDetector.getSupportedFormats() : ['code_128', 'code_39', 'ean_13', 'ean_8', 'qr_code', 'data_matrix', 'upc_a', 'upc_e', 'itf', 'code_93', 'pdf417', 'aztec', 'codabar'];
          barcodeDetectorRef.current = new (window as any).BarcodeDetector({ formats });
        } catch (e) {}
      }

      if (!barcodeDetectorRef.current) {
        try {
          if (!(window as any).ZXingWASM) {
            await new Promise<void>((resolve, reject) => {
              const script = document.createElement('script');
              script.src = "https://cdn.jsdelivr.net/npm/zxing-wasm@3.1.2/dist/iife/reader/index.js";
              script.onload = () => resolve();
              script.onerror = () => reject(new Error("Failed to load script"));
              document.head.appendChild(script);
            });
          }
          if ((window as any).ZXingWASM && typeof (window as any).ZXingWASM.readBarcodes === 'function') {
            zxReaderRef.current = (window as any).ZXingWASM;
          }
        } catch (e) {
          console.warn("Could not load zxing-wasm from CDN script tag", e);
        }
      }

      // 5. Start Decode Loop
      setIsScanning(true);
      isScanningRef.current = true;
      
      let lastDecodeTime = 0;
      let isDecoding = false;

      const scanLoop = async () => {
        if (!isScanningRef.current) return;
        const now = Date.now();
        
        // Target 100 FPS max (every 10ms)
        if (now - lastDecodeTime > 10 && !isDecoding && videoRef.current && canvasRef.current) {
          isDecoding = true;
          lastDecodeTime = now;
          
          try {
            let text = null;
            
            // Strategy 1: Native
            if (barcodeDetectorRef.current) {
              const barcodes = await barcodeDetectorRef.current.detect(videoRef.current);
              if (barcodes && barcodes.length > 0) {
                text = barcodes[0].rawValue || barcodes[0].text;
              }
            } 
            // Strategy 2: Wasm
            else if (zxReaderRef.current) {
              const vw = videoRef.current.videoWidth;
              const vh = videoRef.current.videoHeight;
              if (vw && vh) {
                const ctx = canvasRef.current.getContext('2d', { willReadFrequently: true });
                canvasRef.current.width = vw;
                canvasRef.current.height = vh;
                if (ctx) {
                  ctx.drawImage(videoRef.current, 0, 0, vw, vh);
                  const blob = await new Promise<Blob | null>(resolve => canvasRef.current!.toBlob(resolve, 'image/jpeg', 0.85));
                  if (blob) {
                    const results = await zxReaderRef.current.readBarcodes(blob);
                    if (results && results.length > 0) text = results[0].text;
                  }
                }
              }
            }
            
            if (text) {
              const raw = String(text).replace(/\s+/g, '').toUpperCase();
              if (raw.length >= 4) {
                // We handle the scan asynchronously and let the loop continue
                handleScan(raw);
              }
            }
          } catch (e) {
            // Ignore errors (usually "not found")
          } finally {
            isDecoding = false;
          }
        }
        scanLoopRef.current = requestAnimationFrame(scanLoop);
      };
      
      scanLoopRef.current = requestAnimationFrame(scanLoop);

    } catch (err: any) {
      console.error("Error starting scanner, error =", err);
      if (err?.name === 'NotAllowedError' || err?.message?.includes('permission')) {
        setHasCameraPermission(false);
      } else if (err?.name === 'NotReadableError' || err?.message?.includes('Could not start video source')) {
        // This means the camera is physically locked by another app or hardware switch
        setHasCameraPermission(false);
      }
      if (isManualClick) {
        if (err?.name === 'NotReadableError' || err?.message?.includes('Could not start video source')) {
          alert("Camera Error: Your camera is currently in use by another application (like Zoom/Teams) or blocked by a hardware switch. Please close other apps and try again.");
        } else {
          alert("Camera Error: " + (err?.message || err));
        }
      }
    } finally {
      isInitializingRef.current = false;
    }
  };

  const stopScanner = () => {
    isScanningRef.current = false;
    setIsScanning(false);
    if (scanLoopRef.current) cancelAnimationFrame(scanLoopRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    startScanner(false);
    return () => stopScanner();
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
        <video 
          ref={videoRef} 
          className="w-full h-full object-cover border-none"
          autoPlay 
          playsInline 
          muted 
        />
        <canvas ref={canvasRef} className="hidden" />
        
        {/* Viewfinder Target Box overlay (Visual guide only, camera scans entire frame) */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-[380px] h-[240px] max-w-[85vw] border-2 border-white/20 rounded-3xl relative">
            {/* Corner Accents */}
            <div className="absolute -top-1 -left-1 w-10 h-10 border-t-[5px] border-l-[5px] border-blue-500 rounded-tl-3xl opacity-90 transition-all"></div>
            <div className="absolute -top-1 -right-1 w-10 h-10 border-t-[5px] border-r-[5px] border-blue-500 rounded-tr-3xl opacity-90 transition-all"></div>
            <div className="absolute -bottom-1 -left-1 w-10 h-10 border-b-[5px] border-l-[5px] border-blue-500 rounded-bl-3xl opacity-90 transition-all"></div>
            <div className="absolute -bottom-1 -right-1 w-10 h-10 border-b-[5px] border-r-[5px] border-blue-500 rounded-br-3xl opacity-90 transition-all"></div>
            
            {isProcessing && (
              <div className="absolute inset-0 flex items-center justify-center bg-blue-500/20 backdrop-blur-md rounded-2xl shadow-2xl">
                <Loader2 className="w-12 h-12 animate-spin text-white" />
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
                {scanLog.customerName !== 'Unknown' && (
                  <h3 className="font-black text-2xl leading-tight text-white truncate">
                    {scanLog.customerName}
                  </h3>
                )}
                <p className="font-mono text-sm text-white/70 mt-0.5 truncate">{scanLog.trackingNumber}</p>
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

  const rawTrimmed = text.trim();
  if (rawTrimmed.length >= 4) {
      results.push(rawTrimmed);
      results.push(rawTrimmed.toUpperCase());
  }

  const segments = text.split(/[-_ ]+/);
  if (segments.length > 0 && segments[0]) {
      const firstSegment = segments[0].trim();
      if (firstSegment.length >= 4 && firstSegment !== rawTrimmed) {
          results.push(firstSegment);
          results.push(firstSegment.toUpperCase());
      }
  }

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

  const clean = text.replace(/\s+/g, '');
  const match = clean.match(/\d{4,30}/g) || [];
  for (const m of match) {
      results.push(m);
  }

  const finalCandidates: string[] = [];
  for (const cand of results) {
      finalCandidates.push(cand);
      const cleanCand = cand.replace(/[^A-Za-z0-9]/g, '');
      if (cleanCand && cleanCand !== cand) {
          finalCandidates.push(cleanCand);
      }
  }

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
