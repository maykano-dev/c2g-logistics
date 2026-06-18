export function secureLog(context: string, data?: any) {
  if (!data) {
    console.log(`[SECURE LOG] ${context}`);
    return;
  }

  // Deep clone to avoid mutating original
  const safeData = JSON.parse(JSON.stringify(data));

  // Scrub sensitive fields
  const scrubFields = ['email', 'phone', 'password', 'ghana_card', 'api_key', 'payment_reference', 'secret'];
  
  const scrubObject = (obj: any) => {
    if (typeof obj !== 'object' || obj === null) return;
    
    for (const key in obj) {
      if (scrubFields.some(f => key.toLowerCase().includes(f))) {
        obj[key] = '***REDACTED***';
      } else if (typeof obj[key] === 'object') {
        scrubObject(obj[key]);
      }
    }
  };

  scrubObject(safeData);
  console.log(`[SECURE LOG] ${context}`, safeData);
}
