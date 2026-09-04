const URL = "https://ozhyflsobsoaypihwrco.supabase.co/rest/v1/ecom_orders";
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96aHlmbHNvYnNvYXlwaWh3cmNvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Nzk3OTA0OCwiZXhwIjoyMDczNTU1MDQ4fQ.hoshf6CLSMUciJCFfSVa-ZK8LadP3cxX21GOCm4EMLA";

async function run() {
  const orderPayload = {
    customer_id: "00000000-0000-0000-0000-000000000000",
    customer_name: "Test",
    customer_phone: "123",
    customer_email: "test@test.com",
    shipping_address: "Address",
    shipping_notes: "",
    shipping_method: "sea",
    items: [{
      product_id: "123",
      variant_id: 0,
      quantity: 1,
      price: 10,
      price_cny: 1,
      cost_price_ghs: 10,
      spec_id: "456",
      image_url: "",
      selectedOptions: null,
      service_fee_applicable: true // DELIBERATELY ADDING THIS!
    }],
    subtotal: 10,
    service_fee: 0,
    shipping_cost: 0,
    total_amount: 10,
    total_cost_ghs: 10,
    total_profit_ghs: 0,
    importer_id: null,
    rate_at_purchase: 1,
    snapshot_price_usd: 1,
    snapshot_exchange_rate: 1,
    payment_status: "pending",
    order_status: "pending_payment",
    payment_reference: "TEST_" + Date.now(),
    payment_gateway: "wallet"
  };

  const res = await fetch(URL, {
    method: 'POST',
    headers: {
      'apikey': KEY,
      'Authorization': `Bearer ${KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(orderPayload)
  });

  const json = await res.json();
  console.log("With service_fee_applicable inside items:");
  console.log(json);

  const cleanPayload = JSON.parse(JSON.stringify(orderPayload));
  delete cleanPayload.items[0].service_fee_applicable;
  cleanPayload.payment_reference = "TEST2_" + Date.now();
  cleanPayload.service_fee_applicable = true;
  console.log("cleanPayload:", JSON.stringify(cleanPayload, null, 2));

  const res2 = await fetch(URL, {
    method: 'POST',
    headers: {
      'apikey': KEY,
      'Authorization': `Bearer ${KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(cleanPayload)
  });
  
  const json2 = await res2.json();
  console.log("\\nWithout service_fee_applicable inside items:");
  console.log(json2);
}

run();
