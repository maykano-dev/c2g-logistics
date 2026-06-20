import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function test() {
    const authString = btoa(`${process.env.HUBTEL_API_ID}:${process.env.HUBTEL_API_KEY}`);
    
    // mock payload
    const hubtelPayload = {
      totalAmount: 1, // trying with 1
      description: "Test Order #1234 - C2G",
      callbackUrl: "https://c2g-logistics.com/api/hubtel/callback",
      returnUrl: "https://c2g-logistics.com",
      merchantAccountNumber: process.env.HUBTEL_MERCHANT_ACCOUNT || "HM0811230026",
      cancellationUrl: "https://c2g-logistics.com",
      clientReference: `TEST-${Date.now()}`,
      payeeEmail: 'customer@c2g-logistics.com'
    };

    const apiUrl = 'https://payproxyapi.hubtel.com/items/initiate';

    const hubtelResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(hubtelPayload),
    });

    const responseText = await hubtelResponse.text();
    console.log(hubtelResponse.status);
    console.log(responseText);
}

test();
