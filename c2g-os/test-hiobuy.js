const apiKey = "hio_live_6o1q4m6v58481i5a4k5d306i3k0k0j6b5g120k3t1z2z1t05";
async function testSearch() {
  try {
    const res = await fetch('https://api.hiobuy.com/v1/products/search?keyword=test&channel=1688', { headers: { 'Authorization': `Bearer ${apiKey}` } });
    console.log(`Search -> Status: ${res.status}`);
  } catch (e) {
    console.log(`Search Error:`, e.message);
  }
}
testSearch();
