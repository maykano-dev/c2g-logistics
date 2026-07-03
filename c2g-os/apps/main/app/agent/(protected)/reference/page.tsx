'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { 
  BookOpen, 
  Plane, 
  Ship, 
  MapPin, 
  Info,
  Copy,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { useModal } from "@/components/providers/modal-provider";

export default function AgentReferenceCenterView() {
  const { showAlert } = useModal();
  const [settings, setSettings] = useState<any>(null);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();
      const [settingsRes, whRes] = await Promise.all([
        supabase.from('settings').select('*').limit(1).single(),
        supabase.from('warehouse_addresses').select('*').order('is_default', { ascending: false }).order('updated_at', { ascending: false })
      ]);

      if (settingsRes.data) {
        setSettings(settingsRes.data);
      }
      
      if (whRes.data) {
        setWarehouses(whRes.data);
      }

      setLoading(false);
    }
    
    fetchData();
  }, []);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    showAlert({
      title: 'Copied',
      message: 'Address copied to clipboard',
      type: 'success'
    });
  };

  if (loading) {
    return <div className="p-8 text-zinc-500">Loading reference data...</div>;
  }

  const rates = settings?.rates || {};
  const usdToGhs = settings?.usd_ghs_rate || 15.50;

  const expressAirGhs = (rates.air_express_usd_kg || 0) * usdToGhs;
  const normalAirGhs = (rates.air_normal_usd_kg || 0) * usdToGhs;
  const seaFreightGhs = (rates.sea_usd_cbm || 0) * usdToGhs;

  const formatDate = (isoString?: string) => {
    if (!isoString) return 'Not Scheduled';
    return new Date(isoString).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const getDaysLeft = (isoString?: string) => {
    if (!isoString) return null;
    const diff = new Date(isoString).getTime() - new Date().getTime();
    const days = Math.ceil(diff / (1000 * 3600 * 24));
    return days > 0 ? `${days} Days Left` : 'Passed';
  };

  const seaClosingDays = getDaysLeft(rates.sea_closing_date);

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
                  <p className="text-lg font-black text-white">₵ {expressAirGhs.toFixed(2)}</p>
                  <p className="text-xs text-zinc-400 font-medium">${rates.air_express_usd_kg?.toFixed(2) || '0.00'}</p>
                  <p className="text-[10px] uppercase font-bold text-emerald-500 mt-1">Active</p>
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
                  <p className="text-lg font-black text-white">₵ {normalAirGhs.toFixed(2)}</p>
                  <p className="text-xs text-zinc-400 font-medium">${rates.air_normal_usd_kg?.toFixed(2) || '0.00'}</p>
                  <p className="text-[10px] uppercase font-bold text-emerald-500 mt-1">Active</p>
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
                  <p className="text-lg font-black text-white">₵ {seaFreightGhs.toFixed(2)}</p>
                  <p className="text-xs text-zinc-400 font-medium">${rates.sea_usd_cbm?.toFixed(2) || '0.00'}</p>
                  <p className="text-[10px] uppercase font-bold text-emerald-500 mt-1">Active</p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-[10px] text-zinc-500 bg-zinc-950 px-3 py-2 rounded-lg">
              <Info className="w-3 h-3 text-indigo-400" /> Rates are calculated dynamically using the current USD to GHS rate ({usdToGhs}).
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
                  {seaClosingDays && (
                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${seaClosingDays === 'Passed' ? 'bg-red-500/10 text-red-400' : 'bg-indigo-500/10 text-indigo-400'}`}>
                      {seaClosingDays}
                    </span>
                  )}
                </div>
                <div className="p-4 bg-zinc-900/30 flex justify-between">
                  <div>
                    <p className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Closing Date</p>
                    <p className="text-sm font-medium text-white">{formatDate(rates.sea_closing_date)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Departure</p>
                    <p className="text-sm font-medium text-white">{formatDate(rates.sea_departure_date)}</p>
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

        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Warehouse Addresses */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-rose-500/10 text-rose-400 rounded-lg">
                <MapPin className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">China Warehouse Addresses</h2>
            </div>
            
            {warehouses.length === 0 && (
              <p className="text-sm text-zinc-500">No warehouse addresses configured.</p>
            )}

            <div className="space-y-4">
              {warehouses.map(wh => (
                <div key={wh.id} className={`p-4 rounded-xl border font-mono text-sm relative group ${wh.is_default ? 'bg-zinc-950 border-emerald-500/50 text-white' : 'bg-zinc-950/30 border-zinc-800 text-zinc-400'}`}>
                  {wh.is_default && (
                    <div className="absolute top-4 right-4 flex items-center gap-1 text-emerald-500 text-xs font-bold uppercase">
                      <CheckCircle2 className="w-4 h-4" /> Active
                    </div>
                  )}
                  
                  <div className="mb-3">
                    <p className="text-xs font-bold text-zinc-500 mb-1">
                      {wh.name} {wh.is_default ? '(New)' : '(Old)'}
                    </p>
                    <p className="text-[10px] text-zinc-600">
                      Last Updated: {new Date(wh.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="whitespace-pre-wrap leading-relaxed">
                    {wh.address}
                  </div>
                  
                  <button 
                    onClick={() => handleCopy(wh.address || '')}
                    className="mt-4 flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white transition-colors"
                  >
                    <Copy className="w-4 h-4" /> Copy Full Address
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
