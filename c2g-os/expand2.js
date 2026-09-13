async function expandShortLink(url) {
  try {
    if (!url.includes('qr.1688.com') && !url.includes('m.tb.cn')) return url;
    
    const res = await fetch(url, {
      redirect: "follow",
      headers: { "User-Agent": "curl/7.68.0" } // curl user-agent often forces plain text deep-link schemas
    });
    
    if (res.url && res.url !== url && (res.url.includes("detail.1688.com") || res.url.includes("item.taobao.com"))) {
      return res.url;
    }
    
    const text = await res.text();
    const match = text.match(/[?&](?:offerId|id)=([0-9]+)/);
    if (match && match[1]) {
      if (url.includes("1688.com")) {
        return `https://detail.1688.com/offer/${match[1]}.html`;
      } else {
        return `https://item.taobao.com/item.htm?id=${match[1]}`;
      }
    }
  } catch (e) {
    console.warn("Failed to expand short link:", e);
  }
  return url;
}
expandShortLink("https://qr.1688.com/s/d6ovPSM0").then(console.log);
