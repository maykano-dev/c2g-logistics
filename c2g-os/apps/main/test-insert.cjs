const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  "https://ozhyflsobsoaypihwrco.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96aHlmbHNvYnNvYXlwaWh3cmNvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Nzk3OTA0OCwiZXhwIjoyMDczNTU1MDQ4fQ.hoshf6CLSMUciJCFfSVa-ZK8LadP3cxX21GOCm4EMLA"
);

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
      productId: "123",
      variantId: "456",
      quantity: 1,
      price: 10,
      price_cny: 1,
      cost_price_ghs: 10,
      variant_id: 0,
      spec_id: "456",
      product_id: "123",
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
    payment_reference: "TEST",
    payment_gateway: "wallet"
  };

  const res = await supabase.from("ecom_orders").insert([orderPayload]);
  console.log("With service_fee_applicable inside items:");
  console.log(res.error);

  const cleanPayload = JSON.parse(JSON.stringify(orderPayload));
  delete cleanPayload.items[0].service_fee_applicable;

  const res2 = await supabase.from("ecom_orders").insert([cleanPayload]);
  console.log("\\nWithout service_fee_applicable inside items:");
  console.log(res2.error);
}

run();
