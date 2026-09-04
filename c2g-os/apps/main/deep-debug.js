// Deep debug: send a completely clean payload and print exact DB error
const URL = "https://ozhyflsobsoaypihwrco.supabase.co/rest/v1/ecom_orders";
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96aHlmbHNvYnNvYXlwaWh3cmNvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Nzk3OTA0OCwiZXhwIjoyMDczNTU1MDQ4fQ.hoshf6CLSMUciJCFfSVa-ZK8LadP3cxX21GOCm4EMLA";

// Test 1: Completely minimal payload - NOTHING but required fields
async function test1() {
  const payload = {
    customer_id: "00000000-0000-0000-0000-000000000000",
    customer_name: "DeepDebugTest",
    shipping_address: "Test Address Ghana",
    items: [{ product_id: "123", quantity: 1, price: 10 }],
    subtotal: 10,
    service_fee: 0,
    total_amount: 10,
    payment_status: "pending",
    order_status: "pending_payment",
    payment_reference: "DEEPTEST_" + Date.now(),
    payment_gateway: "wallet"
  };
  console.log("\n=== TEST 1: Minimal payload (no service_fee_applicable anywhere) ===");
  const res = await fetch(URL, {
    method: "POST",
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json", Prefer: "return=representation" },
    body: JSON.stringify(payload)
  });
  const j = await res.json();
  console.log("Status:", res.status);
  console.log("Result:", JSON.stringify(j, null, 2));
}

// Test 2: Check what columns PostgREST thinks ecom_orders has
async function test2() {
  console.log("\n=== TEST 2: GET ecom_orders schema from PostgREST ===");
  const res = await fetch("https://ozhyflsobsoaypihwrco.supabase.co/rest/v1/ecom_orders?limit=0", {
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}` }
  });
  console.log("Headers:", Object.fromEntries(res.headers.entries()));
  console.log("Status:", res.status);
}

// Test 3: Try to select service_fee_applicable from ecom_orders to confirm column exists
async function test3() {
  console.log("\n=== TEST 3: SELECT service_fee_applicable from ecom_orders (confirm column exists) ===");
  const res = await fetch("https://ozhyflsobsoaypihwrco.supabase.co/rest/v1/ecom_orders?select=service_fee_applicable&limit=1", {
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}` }
  });
  const j = await res.json();
  console.log("Status:", res.status);
  console.log("Result:", JSON.stringify(j, null, 2));
}

// Run all tests
(async () => {
  await test3(); // Check column first
  await test1(); // Then try insert
  await test2(); // Then check schema
})();
