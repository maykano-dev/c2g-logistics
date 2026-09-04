const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  "https://ozhyflsobsoaypihwrco.supabase.co", 
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96aHlmbHNvYnNvYXlwaWh3cmNvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Nzk3OTA0OCwiZXhwIjoyMDczNTU1MDQ4fQ.hoshf6CLSMUciJCFfSVa-ZK8LadP3cxX21GOCm4EMLA"
);

async function main() {
  console.log("Checking DB types...");
  
  // Try inserting wallet deduction with UUID
  const { data, error } = await supabase.rpc('process_wallet_deduction', {
    p_customer_id: '00000000-0000-0000-0000-000000000000',
    p_amount: 1,
    p_transaction_type: 'mall_order',
    p_description: 'Test',
    p_reference_id: 'e8974bdc-0338-179a-8afb-cb7d1f6ebef7'
  });
  console.log("process_wallet_deduction error (with UUID):", error?.message || 'OK');
  
  // Try inserting wallet deduction with string without dashes
  const { data: d2, error: e2 } = await supabase.rpc('process_wallet_deduction', {
    p_customer_id: '00000000-0000-0000-0000-000000000000',
    p_amount: 1,
    p_transaction_type: 'mall_order',
    p_description: 'Test',
    p_reference_id: 'e8974bdc0338179a8afbcb7d1f6ebef7'
  });
  console.log("process_wallet_deduction error (without dashes):", e2?.message || 'OK');

  // Try creating an ecom order with the 1688 variant ID
  const testPayload = {
    customer_id: '00000000-0000-0000-0000-000000000000',
    customer_name: "Test",
    customer_phone: "123",
    customer_email: "test@test.com",
    shipping_address: "Test",
    shipping_method: "sea",
    items: [{ variant_id: 'e8974bdc0338179a8afbcb7d1f6ebef7' }],
    subtotal: 10,
    service_fee: 1,
    shipping_cost: 1,
    total_amount: 12,
    total_cost_ghs: 10,
    total_profit_ghs: 2,
    rate_at_purchase: 10,
    snapshot_price_usd: 1,
    snapshot_exchange_rate: 10,
    payment_status: 'paid',
    order_status: 'processing',
    payment_reference: 'TEST',
    payment_gateway: 'wallet'
  };
  
  const { data: o, error: oErr } = await supabase.from('ecom_orders').insert([testPayload]).select('id').single();
  console.log("ecom_orders insert error:", oErr?.message || 'OK');
}

main().catch(console.error);
