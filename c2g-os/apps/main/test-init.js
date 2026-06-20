import fetch from 'node-fetch';

async function test() {
    // Create an order via API or just get one from DB
    // I need a valid session to call the Next.js API route...
    console.log("Need a valid session to hit /api/hubtel/initialize directly, it checks supabase.auth.getUser()");
}
test();
