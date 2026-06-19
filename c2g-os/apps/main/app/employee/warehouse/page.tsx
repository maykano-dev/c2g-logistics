'use client';

import { useState } from 'react';
import { Package, ScanLine, CheckCircle2, XCircle, Printer, Camera, ArrowRight, AlertTriangle, Box } from 'lucide-react';
import { useModal } from "@/components/providers/modal-provider";

export default function ChinaWarehouseScanner() {
  const [scanInput, setScanInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [lastScanned, setLastScanned] = useState<any>(null);
  const { showAlert } = useModal();

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanInput) return;

    setIsScanning(true);
    
    // Simulate DB Lookup
    setTimeout(() => {
      const isMatched = Math.random() > 0.3; // 70% chance of matching for demo
      
      setLastScanned({
        tracking: scanInput,
        matched: isMatched,
        customerName: isMatched ? 'Kwame Mensah' : null,
        customerId: isMatched ? 'C2G-1042' : null,
        items: isMatched ? 'Nike Shoes x2' : null,
        status: isMatched ? 'ready_to_label' : 'unmatched'
      });
      
      setScanInput('');
      setIsScanning(false);
    }, 600);
  };

  const handlePrintLabel = () => {
    // In production, this sends a print command via local network API or WebSocket to the Zebra thermal printer
    showAlert({ title: 'Printing Label', message: 'Sending print command to Zebra Thermal Printer for C2G-1042...', type: 'info' });
    if (lastScanned) {
      setLastScanned({ ...lastScanned, status: 'received' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500 pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            <ScanLine className="w-6 h-6 text-indigo-500" /> Receiving Scanner
          </h1>
          <p className="text-zinc-400 mt-1">Scan tracking numbers to receive, photograph, and label packages.</p>
        </div>
      </div>

      {/* Massive Scanner Input */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-10 shadow-2xl shadow-indigo-900/10">
        <form onSubmit={handleScan} className="relative max-w-2xl mx-auto">
          <ScanLine className="absolute left-6 top-1/2 -translate-y-1/2 w-8 h-8 text-zinc-500" />
          <input 
            type="text" 
            autoFocus
            value={scanInput}
            onChange={(e) => setScanInput(e.target.value)}
            placeholder="Awaiting scanner input..." 
            className="w-full h-24 bg-zinc-950 border-2 border-indigo-500/50 rounded-2xl pl-20 pr-6 text-3xl font-mono text-white placeholder:text-zinc-700 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all shadow-inner"
          />
          <button type="submit" disabled={isScanning || !scanInput} className="absolute right-4 top-1/2 -translate-y-1/2 bg-indigo-600 hover:bg-indigo-500 text-white p-4 rounded-xl disabled:opacity-50 transition-colors">
            {isScanning ? <span className="animate-pulse font-bold">Scanning...</span> : <ArrowRight className="w-6 h-6" />}
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Active Scan Result */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-zinc-800 bg-zinc-950/50">
            <h2 className="text-sm font-bold uppercase tracking-widest text-white">Current Package</h2>
          </div>
          
          <div className="p-6 flex-1 flex flex-col justify-center items-center text-center min-h-[300px]">
            {!lastScanned ? (
              <div className="text-zinc-600 flex flex-col items-center">
                <Box className="w-16 h-16 mb-4 opacity-50" />
                <p>Scan a package to view details</p>
              </div>
            ) : lastScanned.matched ? (
              <div className="w-full animate-in zoom-in-95 duration-300">
                <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-white mb-1">Matched Successfully</h3>
                <p className="text-zinc-400 font-mono text-sm mb-6">{lastScanned.tracking}</p>
                
                <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-left mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-zinc-500 uppercase font-bold tracking-widest">Customer</span>
                    <span className="text-sm font-bold text-white">{lastScanned.customerName}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-zinc-500 uppercase font-bold tracking-widest">C2G ID</span>
                    <span className="text-sm font-bold text-indigo-400">{lastScanned.customerId}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-zinc-500 uppercase font-bold tracking-widest">Items</span>
                    <span className="text-sm text-zinc-300">{lastScanned.items}</span>
                  </div>
                </div>

                {lastScanned.status === 'ready_to_label' ? (
                  <div className="flex gap-3">
                    <button className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
                      <Camera className="w-5 h-5" /> Photo
                    </button>
                    <button onClick={handlePrintLabel} className="flex-[2] bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-indigo-900/20">
                      <Printer className="w-5 h-5" /> Auto-Print Label
                    </button>
                  </div>
                ) : (
                  <div className="w-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-5 h-5" /> Received & Labeled
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full animate-in zoom-in-95 duration-300">
                <div className="w-20 h-20 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-white mb-1">Unregistered Package</h3>
                <p className="text-zinc-400 font-mono text-sm mb-6">{lastScanned.tracking}</p>
                
                <p className="text-sm text-zinc-500 mb-6 px-4">This tracking number does not exist in the system. It has been moved to the Unmatched Queue.</p>
                
                <button className="w-full bg-zinc-800 hover:bg-zinc-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
                  <Camera className="w-5 h-5" /> Photograph & Add to Queue
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Live Scan Log */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col overflow-hidden">
          <div className="p-4 border-b border-zinc-800 bg-zinc-950/50 flex justify-between items-center">
            <h2 className="text-sm font-bold uppercase tracking-widest text-white">Today's Scans</h2>
            <span className="px-2 py-1 bg-indigo-500/10 text-indigo-400 text-xs font-bold rounded">42 Scanned</span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
             {[
               { id: 'YT892348921', status: 'matched', time: 'Just now' },
               { id: 'SF449203810', status: 'matched', time: '2 mins ago' },
               { id: 'ZT002938472', status: 'unmatched', time: '15 mins ago' },
               { id: 'YT334829103', status: 'matched', time: '1 hour ago' },
               { id: 'SF884920192', status: 'matched', time: '2 hours ago' },
             ].map((log, i) => (
               <div key={i} className="flex items-center justify-between p-3 bg-zinc-950/50 border border-zinc-800/50 rounded-xl">
                 <div className="flex items-center gap-3">
                   {log.status === 'matched' ? (
                     <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                   ) : (
                     <XCircle className="w-5 h-5 text-red-500" />
                   )}
                   <div>
                     <p className="text-sm font-mono font-bold text-white">{log.id}</p>
                     <p className="text-[10px] text-zinc-500">{log.time}</p>
                   </div>
                 </div>
                 <button className="text-xs font-bold text-indigo-400 hover:text-indigo-300">View</button>
               </div>
             ))}
          </div>
        </div>
        
      </div>
    </div>
  );
}
