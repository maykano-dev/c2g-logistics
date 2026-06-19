'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Megaphone, Save } from 'lucide-react';
import { adminUpdateSettings } from '@/app/admin/settings-actions';

export default function AdminSettingsView() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .limit(1)
      .single();

    if (data && !error) {
      setSettings({
        id: data.id,
        exchange_rate_cny_to_ghs: data.exchange_rate_cny_to_ghs || 14.5,
        service_fee_percentage: data.rates?.service_fee_percentage || 5,
        maintenance_mode: data.maintenance_mode || false,
        rates: data.rates || {}
      });
    } else {
      // Setup default empty state if no row exists yet
      setSettings({
        exchange_rate_cny_to_ghs: 14.5,
        service_fee_percentage: 5,
        maintenance_mode: false,
        rates: {}
      });
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const res = await adminUpdateSettings(settings);
      
    if (res.success) {
      alert('Settings saved successfully!');
    } else {
      console.error(res.error);
      alert('Failed to save settings: ' + res.error);
    }
    setSaving(false);
  };

  if (loading) return <div className="p-8 text-zinc-500">Loading settings...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Global Settings</h1>
          <p className="text-zinc-400">Configure platform variables.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors w-fit disabled:opacity-50"
        >
          <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-4">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Megaphone className="w-5 h-5 text-indigo-500" /> Platform Configuration</h2>
          
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Exchange Rate (CNY to GHS)</label>
            <input 
              type="number" 
              step="0.01"
              value={settings?.exchange_rate_cny_to_ghs || 0}
              onChange={e => setSettings({...settings, exchange_rate_cny_to_ghs: parseFloat(e.target.value)})}
              className="w-full h-10 bg-zinc-950 border border-zinc-800 rounded-lg px-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Service Fee Percentage (%)</label>
            <input 
              type="number" 
              step="0.1"
              value={settings?.service_fee_percentage || 0}
              onChange={e => setSettings({...settings, service_fee_percentage: parseFloat(e.target.value)})}
              className="w-full h-10 bg-zinc-950 border border-zinc-800 rounded-lg px-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input 
              type="checkbox" 
              id="maintenance"
              checked={settings?.maintenance_mode || false}
              onChange={e => setSettings({...settings, maintenance_mode: e.target.checked})}
              className="w-4 h-4 rounded border-zinc-800 bg-zinc-950 text-indigo-600 focus:ring-indigo-600"
            />
            <label htmlFor="maintenance" className="text-sm font-medium text-zinc-400">Enable Maintenance Mode (Blocks users)</label>
          </div>
        </div>
      </div>
    </div>
  );
}
