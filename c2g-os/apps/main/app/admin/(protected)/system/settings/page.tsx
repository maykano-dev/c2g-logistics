'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Megaphone, Save, Building2, CheckCircle2, DollarSign } from 'lucide-react';
import { adminUpdateSettings, adminUpdateWarehouseAddress, adminUpdatePlatformSettings } from '@/app/admin/settings-actions';
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
    
    const [settingsRes, whRes, platformRes] = await Promise.all([
      supabase.from('settings').select('*').limit(1).single(),
      supabase.from('warehouse_addresses').select('*').order('is_default', { ascending: false }),
      supabase.from('platform_settings').select('*')
    ]);

    const plat = platformRes.data || [];
    const getPlatValue = (key: string, def: number) => {
      const found = plat.find(p => p.setting_key === key);
      return found ? Number(found.setting_value) : def;
    };

    if (settingsRes.data && !settingsRes.error) {
      setSettings({
        id: settingsRes.data.id,
        exchange_rate_cny_to_ghs: settingsRes.data.exchange_rate_cny_to_ghs || 14.5,
        markup_percentage: settingsRes.data.markup_percentage || 5,
        service_fee_percentage: settingsRes.data.service_fee_percentage || 5,
        maintenance_mode: settingsRes.data.maintenance_mode || false,
        maintenance_pages: typeof settingsRes.data.maintenance_pages === 'string' ? JSON.parse(settingsRes.data.maintenance_pages) : (settingsRes.data.maintenance_pages || {}),
        store_name: settingsRes.data.store_name || '',
        public_email: settingsRes.data.public_email || '',
        public_phone: settingsRes.data.public_phone || '',
        rate_link_orders: settingsRes.data.rate_link_orders || 0.52,
        rate_shop_products: settingsRes.data.rate_shop_products || 0.53,
        usd_ghs_rate: settingsRes.data.usd_ghs_rate || 15.50,
        minimum_local_delivery_fee: settingsRes.data.minimum_local_delivery_fee || 7,
        minimum_service_fee: settingsRes.data.minimum_service_fee || 5,
        local_delivery_percentage: settingsRes.data.local_delivery_percentage || 3,
        rates: settingsRes.data.rates || {},
        sea_closing_date: settingsRes.data.rates?.sea_closing_date || '',
        sea_departure_date: settingsRes.data.rates?.sea_departure_date || '',
        air_normal_deposit_usd: getPlatValue('air_normal_deposit_usd', 25.00),
        air_express_deposit_usd: getPlatValue('air_express_deposit_usd', 44.00),
        sea_deposit_ghs: getPlatValue('sea_deposit_ghs', 500.00),
        usd_to_ghs_rate: getPlatValue('usd_to_ghs_rate', 12.60),
        package_registration_fee: getPlatValue('package_registration_fee', 5.00)
      });
    } else {
      setSettings({
        exchange_rate_cny_to_ghs: 14.5,
        markup_percentage: 5,
        service_fee_percentage: 5,
        maintenance_mode: false,
        maintenance_pages: {},
        store_name: '',
        public_email: '',
        public_phone: '',
        rate_link_orders: 0.52,
        rate_shop_products: 0.53,
        usd_ghs_rate: 15.50,
        minimum_local_delivery_fee: 7,
        minimum_service_fee: 5,
        local_delivery_percentage: 3,
        rates: {},
        sea_closing_date: '',
        sea_departure_date: '',
        air_normal_deposit_usd: getPlatValue('air_normal_deposit_usd', 25.00),
        air_express_deposit_usd: getPlatValue('air_express_deposit_usd', 44.00),
        sea_deposit_ghs: getPlatValue('sea_deposit_ghs', 500.00),
        usd_to_ghs_rate: getPlatValue('usd_to_ghs_rate', 12.60),
        package_registration_fee: getPlatValue('package_registration_fee', 5.00)
      });
    }

    if (whRes.data && !whRes.error) {
      setWarehouses(whRes.data);
    }
    
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const [res, platRes] = await Promise.all([
      adminUpdateSettings(settings),
      adminUpdatePlatformSettings([
        { setting_key: 'air_normal_deposit_usd', setting_value: settings.air_normal_deposit_usd },
        { setting_key: 'air_express_deposit_usd', setting_value: settings.air_express_deposit_usd },
        { setting_key: 'sea_deposit_ghs', setting_value: settings.sea_deposit_ghs },
        { setting_key: 'usd_to_ghs_rate', setting_value: settings.usd_to_ghs_rate },
        { setting_key: 'package_registration_fee', setting_value: settings.package_registration_fee }
      ])
    ]);
      
    if (res.success && platRes.success) {
      showAlert({ title: 'Success', message: 'Settings saved successfully!', type: 'success' });
    } else {
      console.error(res.error, platRes.error);
      showAlert({ title: 'Error', message: 'Failed to save settings: ' + (res.error || platRes.error), type: 'danger' });
    }
    setSaving(false);
  };

  const handleSaveWarehouse = async (wh: any) => {
    setSavingWh(wh.id);
    const res = await adminUpdateWarehouseAddress(wh.id, {
      name: wh.name,
      phone: wh.phone,
      address: wh.address,
      province: wh.province,
      city: wh.city,
      district: wh.district,
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
        <div className="space-y-6">
          <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2"><Megaphone className="w-5 h-5 text-indigo-500" /> Brand Identity</h2>
              <button onClick={handleSave} disabled={saving} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors disabled:opacity-50">
                <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Store Name</label>
              <input type="text" value={settings?.store_name || ''} onChange={e => setSettings({...settings, store_name: e.target.value})} className="w-full h-10 bg-zinc-950 border border-zinc-800 rounded-lg px-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Public Email</label>
              <input type="email" value={settings?.public_email || ''} onChange={e => setSettings({...settings, public_email: e.target.value})} className="w-full h-10 bg-zinc-950 border border-zinc-800 rounded-lg px-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Public Phone</label>
              <input type="text" value={settings?.public_phone || ''} onChange={e => setSettings({...settings, public_phone: e.target.value})} className="w-full h-10 bg-zinc-950 border border-zinc-800 rounded-lg px-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors" />
            </div>
          </div>

          <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-4">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><DollarSign className="w-5 h-5 text-indigo-500" /> Financial Settings</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Exchange Rate (CNY to GHS)</label>
                <input type="number" step="0.01" value={settings?.exchange_rate_cny_to_ghs || 0} onChange={e => setSettings({...settings, exchange_rate_cny_to_ghs: parseFloat(e.target.value)})} className="w-full h-10 bg-zinc-950 border border-zinc-800 rounded-lg px-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Product Markup (%)</label>
                <input type="number" step="0.1" value={settings?.markup_percentage || 0} onChange={e => setSettings({...settings, markup_percentage: parseFloat(e.target.value)})} className="w-full h-10 bg-zinc-950 border border-zinc-800 rounded-lg px-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Exchange Rate (USD to GHS)</label>
                <input type="number" step="0.01" value={settings?.usd_ghs_rate || 0} onChange={e => setSettings({...settings, usd_ghs_rate: parseFloat(e.target.value)})} className="w-full h-10 bg-zinc-950 border border-zinc-800 rounded-lg px-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Link Order Rate (CNY to GHS)</label>
                <input type="number" step="0.01" value={settings?.rate_link_orders || 0} onChange={e => setSettings({...settings, rate_link_orders: parseFloat(e.target.value)})} className="w-full h-10 bg-zinc-950 border border-zinc-800 rounded-lg px-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Mall Order Rate (CNY to GHS)</label>
                <input type="number" step="0.01" value={settings?.rate_shop_products || 0} onChange={e => setSettings({...settings, rate_shop_products: parseFloat(e.target.value)})} className="w-full h-10 bg-zinc-950 border border-zinc-800 rounded-lg px-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Service Fee (%)</label>
                <input type="number" step="0.1" value={settings?.service_fee_percentage || 0} onChange={e => setSettings({...settings, service_fee_percentage: parseFloat(e.target.value)})} className="w-full h-10 bg-zinc-950 border border-zinc-800 rounded-lg px-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Min Service Fee (GHS)</label>
                <input type="number" step="0.1" value={settings?.minimum_service_fee || 0} onChange={e => setSettings({...settings, minimum_service_fee: parseFloat(e.target.value)})} className="w-full h-10 bg-zinc-950 border border-zinc-800 rounded-lg px-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Local Delivery (%)</label>
                <input type="number" step="0.1" value={settings?.local_delivery_percentage || 0} onChange={e => setSettings({...settings, local_delivery_percentage: parseFloat(e.target.value)})} className="w-full h-10 bg-zinc-950 border border-zinc-800 rounded-lg px-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Min Local Delivery (GHS)</label>
                <input type="number" step="0.1" value={settings?.minimum_local_delivery_fee || 0} onChange={e => setSettings({...settings, minimum_local_delivery_fee: parseFloat(e.target.value)})} className="w-full h-10 bg-zinc-950 border border-zinc-800 rounded-lg px-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors" />
              </div>
            </div>
          </div>

          <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-4">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">Shipment Schedules</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Next Sea Closing Date</label>
                <input type="date" value={settings?.sea_closing_date ? new Date(settings.sea_closing_date).toISOString().split('T')[0] : ''} onChange={e => setSettings({...settings, sea_closing_date: e.target.value ? new Date(e.target.value).toISOString() : ''})} className="w-full h-10 bg-zinc-950 border border-zinc-800 rounded-lg px-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Next Sea Departure Date</label>
                <input type="date" value={settings?.sea_departure_date ? new Date(settings.sea_departure_date).toISOString().split('T')[0] : ''} onChange={e => setSettings({...settings, sea_departure_date: e.target.value ? new Date(e.target.value).toISOString() : ''})} className="w-full h-10 bg-zinc-950 border border-zinc-800 rounded-lg px-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors" />
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">Maintenance Toggles</h2>
              <button 
                onClick={handleSave} 
                disabled={saving} 
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" /> {saving ? 'Saving...' : 'Save Maintenance'}
              </button>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
              <div>
                <label className="text-sm font-bold text-red-400 block mb-1">Global Maintenance Mode</label>
                <p className="text-xs text-zinc-400">Blocks all users from accessing the platform.</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={settings?.maintenance_mode || false}
                onClick={() => setSettings({...settings, maintenance_mode: !settings?.maintenance_mode})}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-zinc-900 ${
                  settings?.maintenance_mode ? 'bg-red-500' : 'bg-zinc-700'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    settings?.maintenance_mode ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            
            <div className="border-t border-zinc-800 pt-5">
              <label className="block text-sm font-bold text-zinc-300 mb-3">Block Specific Sections:</label>
              <div className="grid grid-cols-2 gap-4">
                {['cart', 'checkout', 'shop', 'dashboard'].map(page => {
                  const isChecked = settings?.maintenance_pages?.[page] || false;
                  return (
                    <div key={page} className="flex items-center justify-between p-3 bg-zinc-950/50 border border-zinc-800 rounded-lg">
                      <label className="text-sm text-zinc-300 capitalize font-medium">{page}</label>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={isChecked}
                        onClick={() => setSettings({...settings, maintenance_pages: {...settings.maintenance_pages, [page]: !isChecked}})}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-zinc-950 ${
                          isChecked ? 'bg-indigo-500' : 'bg-zinc-800'
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            isChecked ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">Logistics Fees</h2>
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

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 mb-1">Province (省)</label>
                    <input 
                      type="text" 
                      value={wh.province || ''}
                      onChange={e => updateWarehouseState(wh.id, 'province', e.target.value)}
                      className="w-full h-10 bg-zinc-900 border border-zinc-800 rounded-lg px-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                      placeholder="e.g. 广东省"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 mb-1">City (市)</label>
                    <input 
                      type="text" 
                      value={wh.city || ''}
                      onChange={e => updateWarehouseState(wh.id, 'city', e.target.value)}
                      className="w-full h-10 bg-zinc-900 border border-zinc-800 rounded-lg px-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                      placeholder="e.g. 广州市"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 mb-1">District (区)</label>
                    <input 
                      type="text" 
                      value={wh.district || ''}
                      onChange={e => updateWarehouseState(wh.id, 'district', e.target.value)}
                      className="w-full h-10 bg-zinc-900 border border-zinc-800 rounded-lg px-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                      placeholder="e.g. 白云区"
                    />
                  </div>
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
  </div>
  );
}
