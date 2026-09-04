const URL = "https://ozhyflsobsoaypihwrco.supabase.co";
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96aHlmbHNvYnNvYXlwaWh3cmNvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Nzk3OTA0OCwiZXhwIjoyMDczNTU1MDQ4fQ.hoshf6CLSMUciJCFfSVa-ZK8LadP3cxX21GOCm4EMLA";

async function main() {
  const orderPayload = {
    customer_id: 'e8974bdc-0338-179a-8afb-cb7d1f6ebef7',
    customer_name: "Test",
    customer_phone: "123",
    customer_email: "test@test.com",
    shipping_address: "Test",
    shipping_method: "sea",
    items: [], // EMPTY ITEMS
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

  const res = await fetch(`${URL}/rest/v1/ecom_orders`, {
    method: 'POST',
    headers: {
      'apikey': KEY,
      'Authorization': `Bearer ${KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(orderPayload)
  });
  
  const data = await res.json();
  console.log("ecom_orders empty items response:", data);
}

main().catch(console.error);
