"use client";

import { useState } from 'react';
import { Camera, History, ListChecks } from 'lucide-react';
import ScannerTab from './scanner-tab';
import HistoryTab from './history-tab';
import ReservationsTab from './reservations-tab';

export type ScanLog = {
  id: string;
  trackingNumber: string;
  customerName: string;
  status: 'updated' | 'already_processed' | 'not_found' | 'error';
  message: string;
  timestamp: Date;
};

export default function ScannerClient() {
  const [activeTab, setActiveTab] = useState<'scanner' | 'history' | 'reservations'>('scanner');
  const [sessionHistory, setSessionHistory] = useState<ScanLog[]>([]);

  const handleAddScanLog = (log: ScanLog) => {
    setSessionHistory(prev => [log, ...prev]);
  };
  
  return (
    <div className="flex flex-col h-full w-full bg-zinc-950 text-zinc-50 font-sans relative">
      
      {/* Tab Content Area */}
      <div className="flex-1 w-full h-full overflow-hidden relative pb-[80px]">
        {activeTab === 'scanner' && <ScannerTab onScanLog={handleAddScanLog} sessionCount={sessionHistory.filter(l => l.status === 'updated').length} />}
        {activeTab === 'history' && <HistoryTab sessionHistory={sessionHistory} />}
        {activeTab === 'reservations' && <ReservationsTab />}
      </div>

      {/* iOS Style Bottom Navigation */}
      <div className="absolute bottom-0 left-0 right-0 h-[80px] bg-zinc-900/90 backdrop-blur-xl border-t border-zinc-800 z-50 flex items-center justify-around px-2 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.3)]">
        <button 
          onClick={() => setActiveTab('scanner')}
          className={`flex flex-col items-center justify-center w-24 h-full transition-all ${activeTab === 'scanner' ? 'text-blue-500 scale-110' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          <Camera className={`w-6 h-6 mb-1 ${activeTab === 'scanner' ? 'fill-blue-500/20' : ''}`} />
          <span className="text-[10px] font-bold tracking-wider">SCANNER</span>
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`flex flex-col items-center justify-center w-24 h-full transition-all ${activeTab === 'history' ? 'text-blue-500 scale-110' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          <History className={`w-6 h-6 mb-1 ${activeTab === 'history' ? 'fill-blue-500/20' : ''}`} />
          <span className="text-[10px] font-bold tracking-wider">HISTORY</span>
        </button>
        <button 
          onClick={() => setActiveTab('reservations')}
          className={`flex flex-col items-center justify-center w-24 h-full transition-all ${activeTab === 'reservations' ? 'text-blue-500 scale-110' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          <ListChecks className={`w-6 h-6 mb-1 ${activeTab === 'reservations' ? 'fill-blue-500/20' : ''}`} />
          <span className="text-[10px] font-bold tracking-wider">TASKS</span>
        </button>
      </div>
    </div>
  );
}
