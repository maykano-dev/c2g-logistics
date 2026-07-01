export const dynamic = 'force-dynamic';

import { Copy, MapPin, Building2, Phone, User, CheckCircle2 } from "lucide-react";
import { createClient } from '@/utils/supabase/server';
import { CopyAddressButton } from './copy-button';

export default async function WarehouseAddressPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let customerId = 'C2G-CUST-XXXX';
  let customerName = 'Customer';
  let warehouseCode = '';

  if (user) {
    const { data: customer } = await supabase
      .from('customers')
      .select('customer_unique_id, name, warehouse_code')
      .eq('id', user.id)
      .single();
    if (customer?.customer_unique_id) {
      customerId = customer.customer_unique_id;
    }
    if (customer?.name) {
      customerName = customer.name.split(' ')[0];
    }
    if (customer?.warehouse_code) {
      warehouseCode = customer.warehouse_code;
    }
  }

  // Fetch directly to avoid Next.js cache staleness and RLS anon-key issues
  const { data: addresses, error } = await supabase
    .from('warehouse_addresses')
    .select('*')
    .order('is_default', { ascending: false });

  if (error) {
    console.error("Error fetching warehouse addresses:", error);
  }

  const activeAddresses = addresses && addresses.length > 0 ? addresses : [{
    id: 'default',
    is_default: true,
    name: "Guangzhou Warehouse",
    phone: "+86 17835112914",
    address: "Address Line 1: 迎泽大街79号理工大学迎西校区内太原理工大学(清泽田径场)\nCity: 太原市\nProvince: 山西省\nDistrict: 万柏林区\nPostal Code: 030024\nCountry: China"
  }];

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Warehouse Addresses</h1>
        <p className="text-muted-foreground mt-1">Use these addresses when shopping on Chinese e-commerce platforms.</p>
        
        <div className="mt-6 bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-lg flex items-center gap-3 animate-pulse">
          <span className="text-xl">⚠️</span>
          <span className="font-bold text-sm tracking-wide">
            PLEASE DO NOT TRANSLATE THE ADDRESS DETAILS TO ENGLISH. USE IT AS IT IS.
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Warehouse Cards List */}
        <div className="space-y-6">
          {activeAddresses.map((warehouse, idx) => {
            const isChineseFormat = warehouse.address?.includes('{CODE}');
            let processedAddress = warehouse.address || '';
            let copyText = '';
            let displayText = '';

            if (isChineseFormat) {
                // If it's the new template format, just replace CODE
                const actualCode = warehouseCode || customerId; // fallback
                processedAddress = processedAddress.replace(/{CODE}/g, actualCode);
                displayText = processedAddress;
                copyText = processedAddress;
            } else {
                // Legacy english format
                displayText = `Name: ${customerName} [${customerId}]\n${processedAddress?.trim()}\nPhone: ${warehouse.phone}`;
                copyText = displayText;
            }

            return (
              <div key={warehouse.id || idx} className={`glass-panel p-8 relative overflow-hidden group border-primary/20 hover:border-primary/50 transition-colors ${!warehouse.is_default ? 'opacity-80 scale-[0.98]' : ''}`}>
                {warehouse.is_default && <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[50px] -mr-10 -mt-10 pointer-events-none" />}
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 shrink-0 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
                    <span className="text-2xl">🇨🇳</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg sm:text-xl font-bold whitespace-nowrap tracking-tight">{warehouse.name}</h2>
                      {!warehouse.is_default && (
                        <span className="text-xs bg-secondary px-2 py-1 rounded border border-border">Alternative</span>
                      )}
                    </div>
                    <p className="text-sm text-green-500 flex items-center gap-1 font-medium">
                      <CheckCircle2 className="w-4 h-4 shrink-0" /> Receiving Packages
                    </p>
                  </div>
                </div>

                <div className="bg-secondary/10 p-6 rounded-xl border border-primary/20 text-[14px] leading-[1.8] text-foreground/90 font-medium whitespace-pre-wrap">
                  {displayText}
                </div>
                
                <CopyAddressButton addressText={copyText} />
                
                <div className="mt-6 text-sm text-muted-foreground bg-primary/5 p-4 rounded-lg border border-primary/10">
                  <strong>Important:</strong> Always ensure your unique ID ({warehouseCode || customerId}) is included in the receiver name or detailed address so we can identify your packages.
                </div>
              </div>
            );
          })}
        </div>

        {/* Instructions / Helpers */}
        <div className="space-y-6">
          <div className="glass-panel p-6">
            <h3 className="text-lg font-bold mb-4">How to use this address?</h3>
            <ol className="space-y-4 relative before:absolute before:inset-y-0 before:left-3 before:w-0.5 before:bg-border">
              {[
                "Copy the Chinese address details step-by-step.",
                "Paste them into your Taobao/1688 address book.",
                "Verify your unique ID is present in the address.",
                "Once the supplier ships, copy their tracking number.",
                "Register the tracking number in our 'Packages' tab."
              ].map((step, idx) => (
                <li key={idx} className="relative pl-10">
                  <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground shadow-sm">
                    {idx + 1}
                  </div>
                  <p className="text-sm font-medium pt-0.5">{step}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="glass-panel p-6 bg-secondary/20">
            <h3 className="text-lg font-bold mb-2">Need help?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              If you are having trouble adding the address to a specific platform, our support team can help you.
            </p>
            <a 
              href="https://wa.me/233241465282"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
