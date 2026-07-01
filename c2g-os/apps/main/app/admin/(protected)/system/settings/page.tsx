'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Megaphone, Save, Building2, CheckCircle2 } from 'lucide-react';
import { adminUpdateSettings, adminUpdateWarehouseAddress } from '@/app/admin/settings-actions';
import { useModal } from "@/components/providers/modal-provider";

export default function AdminSettingsView() {
  const [settings, setSettings] = useState<any>(null);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingWh, setSavingWh] = useState<string | null>(null);
  const { showAlert } = useModal();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    const supabase = createClient();
    
    const [settingsRes, whRes] = await Promise.all([
      supabase.from('settings').select('*').limit(1).single(),
      supabase.from('warehouse_addresses').select('*').order('is_default', { ascending: false })
    ]);

    if (settingsRes.data && !settingsRes.error) {
      setSettings({
        id: settingsRes.data.id,
        exchange_rate_cny_to_ghs: settingsRes.data.exchange_rate_cny_to_ghs || 14.5,
        service_fee_percentage: settingsRes.data.rates?.service_fee_percentage || 5,
        maintenance_mode: settingsRes.data.maintenance_mode || false,
        rates: settingsRes.data.rates || {}
      });
    } else {
      setSettings({
        exchange_rate_cny_to_ghs: 14.5,
        service_fee_percentage: 5,
        maintenance_mode: false,
        rates: {}
      });
    }

    if (whRes.data && !whRes.error) {
      setWarehouses(whRes.data);
    }
    
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const res = await adminUpdateSettings(settings);
      
    if (res.success) {
      showAlert({ title: 'Success', message: 'Settings saved successfully!', type: 'success' });
    } else {
      console.error(res.error);
      showAlert({ title: 'Error', message: 'Failed to save settings: ' + res.error, type: 'danger' });
    }
    setSaving(false);
  };

  const handleSaveWarehouse = async (wh: any) => {
    setSavingWh(wh.id);
    const res = await adminUpdateWarehouseAddress(wh.id, {
      name: wh.name,
      phone: wh.phone,
      address: wh.address,
      is_default: wh.is_default
    });
      
    if (res.success) {
      showAlert({ title: 'Success', message: 'Warehouse address updated successfully!', type: 'success' });
      // If setting default to true, refresh to see changes in other warehouses
      if (wh.is_default) fetchSettings();
    } else {
      console.error(res.error);
      showAlert({ title: 'Error', message: 'Failed to update warehouse: ' + res.error, type: 'danger' });
    }
    setSavingWh(null);
  };

  const updateWarehouseState = (id: string, field: string, value: any) => {
    setWarehouses(prev => prev.map(w => w.id === id ? { ...w, [field]: value } : w));
  };

  if (loading) return <div className="p-8 text-zinc-500">Loading settings...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Global Settings</h1>
          <p className="text-zinc-400">Configure platform variables.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2"><Megaphone className="w-5 h-5 text-indigo-500" /> Platform Configuration</h2>
            <button 
              onClick={handleSave}
              disabled={saving}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
          
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

        <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-4">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Building2 className="w-5 h-5 text-indigo-500" /> Warehouse Addresses</h2>
          
          {warehouses.length === 0 && <p className="text-sm text-zinc-500">No warehouse addresses found.</p>}
          
          <div className="space-y-6">
            {warehouses.map(wh => (
              <div key={wh.id} className="p-4 border border-zinc-800 rounded-xl bg-zinc-950/50 space-y-4 relative">
                {wh.is_default && <CheckCircle2 className="absolute top-4 right-4 w-5 h-5 text-green-500" />}
                
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1">Warehouse Name</label>
                  <input 
                    type="text" 
                    value={wh.name || ''}
                    onChange={e => updateWarehouseState(wh.id, 'name', e.target.value)}
                    className="w-full h-10 bg-zinc-900 border border-zinc-800 rounded-lg px-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1">Phone Number</label>
                  <input 
                    type="text" 
                    value={wh.phone || ''}
                    onChange={e => updateWarehouseState(wh.id, 'phone', e.target.value)}
                    className="w-full h-10 bg-zinc-900 border border-zinc-800 rounded-lg px-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1">Address Details (Use {`{CODE}`} for dynamic user code)</label>
                  <textarea 
                    rows={4}
                    value={wh.address || ''}
                    onChange={e => updateWarehouseState(wh.id, 'address', e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors font-mono"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id={`default-${wh.id}`}
                      checked={wh.is_default || false}
                      onChange={e => updateWarehouseState(wh.id, 'is_default', e.target.checked)}
                      className="w-4 h-4 rounded border-zinc-800 bg-zinc-950 text-indigo-600 focus:ring-indigo-600"
                    />
                    <label htmlFor={`default-${wh.id}`} className="text-sm font-medium text-zinc-400">Primary Default Address</label>
                  </div>

                  <button 
                    onClick={() => handleSaveWarehouse(wh)}
                    disabled={savingWh === wh.id}
                    className="bg-zinc-800 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
                  >
                    {savingWh === wh.id ? 'Saving...' : 'Update Address'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
