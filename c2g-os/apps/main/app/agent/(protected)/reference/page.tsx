'use client';

import { 
  BookOpen, 
  Plane, 
  Ship, 
  MapPin, 
  Info,
  DollarSign,
  Megaphone,
  HelpCircle,
  Copy,
  Calendar
} from 'lucide-react';
import { useModal } from "@/components/providers/modal-provider";

export default function AgentReferenceCenterView() {
  const { showAlert } = useModal();

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    showAlert({
      title: 'Copied',
      message: 'Address copied to clipboard',
      type: 'success'
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-indigo-500" /> Reference Center
          </h1>
          <p className="text-zinc-400 mt-1">Live platform data to assist customers. Information here is read-only and automatically synced.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column */}
        <div className="space-y-6">
          {/* Shipping Rates */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
                <Plane className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">Live Shipping Rates</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-zinc-950/50 rounded-xl border border-zinc-800/50">
                <div className="flex items-center gap-3">
                  <Plane className="w-4 h-4 text-emerald-500" />
                  <div>
                    <p className="text-sm font-bold text-white">Express Air Freight</p>
                    <p className="text-xs text-zinc-500">Per Kilogram (kg)</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-white">₵ 130.00</p>
                  <p className="text-[10px] uppercase font-bold text-emerald-500">Active</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-zinc-950/50 rounded-xl border border-zinc-800/50">
                <div className="flex items-center gap-3">
                  <Plane className="w-4 h-4 text-blue-500" />
                  <div>
                    <p className="text-sm font-bold text-white">Normal Air Freight</p>
                    <p className="text-xs text-zinc-500">Per Kilogram (kg)</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-white">₵ 95.00</p>
                  <p className="text-[10px] uppercase font-bold text-emerald-500">Active</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-zinc-950/50 rounded-xl border border-zinc-800/50">
                <div className="flex items-center gap-3">
                  <Ship className="w-4 h-4 text-indigo-500" />
                  <div>
                    <p className="text-sm font-bold text-white">Sea Freight</p>
                    <p className="text-xs text-zinc-500">Per CBM</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-white">₵ 650.00</p>
                  <p className="text-[10px] uppercase font-bold text-emerald-500">Active</p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-[10px] text-zinc-500 bg-zinc-950 px-3 py-2 rounded-lg">
              <Info className="w-3 h-3 text-indigo-400" /> Rates are managed by administrators and update automatically.
            </div>
          </div>

          {/* Exchange Rate */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden flex items-center justify-between">
             <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-1">Current Platform Rate</h2>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-black text-white">¥1 = ₵2.35</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-zinc-500 uppercase font-bold">Last Updated</p>
              <p className="text-xs text-zinc-400">10:25 AM</p>
            </div>
          </div>

          {/* Announcements */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-orange-500/10 text-orange-400 rounded-lg">
                <Megaphone className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">Active Announcements</h2>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-orange-500/5 border border-orange-500/10 rounded-xl">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-sm font-bold text-orange-400">Warehouse Address Update</h3>
                  <span className="text-[10px] font-bold text-zinc-500 uppercase">Expires in 3 days</span>
                </div>
                <p className="text-xs text-zinc-400">Please inform all customers using old address templates to update to the new Guangzhou facility immediately.</p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Warehouse Addresses */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-rose-500/10 text-rose-400 rounded-lg">
                <MapPin className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">China Warehouse Address</h2>
            </div>
            
            <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 font-mono text-sm text-zinc-300 relative group">
              <p className="mb-1">Receiver: C2G Logistics [Customer ID]</p>
              <p className="mb-1">Phone: 138-0000-0000</p>
              <p className="mb-1">Address: 123 Logistics Park, Baiyun District</p>
              <p>City: Guangzhou, Guangdong Province</p>
              
              <button 
                onClick={() => handleCopy("Receiver: C2G Logistics [Customer ID]\nPhone: 138-0000-0000\nAddress: 123 Logistics Park, Baiyun District\nCity: Guangzhou, Guangdong Province")}
                className="absolute top-4 right-4 p-2 bg-zinc-800 text-zinc-400 rounded hover:text-white hover:bg-zinc-700 transition-colors opacity-0 group-hover:opacity-100"
                title="Copy Address"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Shipment Schedules */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
                <Calendar className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">Next Shipment Schedules</h2>
            </div>
            
            <div className="space-y-4">
              <div className="border border-zinc-800 rounded-xl overflow-hidden">
                <div className="bg-zinc-950/50 px-4 py-2 border-b border-zinc-800 flex items-center justify-between">
                  <span className="text-sm font-bold text-white flex items-center gap-2"><Ship className="w-4 h-4 text-blue-500"/> Sea Shipment</span>
                  <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase rounded">11 Days Left</span>
                </div>
                <div className="p-4 bg-zinc-900/30 flex justify-between">
                  <div>
                    <p className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Closing Date</p>
                    <p className="text-sm font-medium text-white">July 5, 2026</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Departure</p>
                    <p className="text-sm font-medium text-white">July 6, 2026</p>
                  </div>
                </div>
              </div>

              <div className="border border-zinc-800 rounded-xl overflow-hidden">
                <div className="bg-zinc-950/50 px-4 py-2 border-b border-zinc-800 flex items-center justify-between">
                  <span className="text-sm font-bold text-white flex items-center gap-2"><Plane className="w-4 h-4 text-emerald-500"/> Air Freight</span>
                  <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase rounded">Ongoing</span>
                </div>
                <div className="p-4 bg-zinc-900/30">
                  <p className="text-sm text-zinc-400">Ships immediately upon warehouse arrival and QC clearance.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Answers / FAQ */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">Quick Answers FAQ</h2>
            </div>
            
            <div className="space-y-4">
              <div className="group">
                <p className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors mb-1">How much is Normal Air?</p>
                <p className="text-sm text-zinc-400">₵95/kg</p>
              </div>
              <div className="h-px bg-zinc-800"></div>
              <div className="group">
                <p className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors mb-1">Does air freight wait for shipment dates?</p>
                <p className="text-sm text-zinc-400">No. Air ships immediately once items arrive at our warehouse.</p>
              </div>
              <div className="h-px bg-zinc-800"></div>
              <div className="group">
                <p className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors mb-1">What happens if a package is damaged?</p>
                <p className="text-sm text-zinc-400">Request photos from the warehouse team by escalating the ticket to the China Warehouse department.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
