export function maskEmail(email: string | null | undefined): string {
  if (!email || !email.includes('@')) return email || '';
  const [local, domain] = email.split('@');
  if (!local || !domain) return email;
  if (local.length <= 2) {
    return `${local[0]}***@${domain}`;
  }
  return `${local[0]}***${local[local.length - 1]}@${domain}`;
}

export function maskPhone(phone: string | null | undefined): string {
  if (!phone || phone.length < 8) return phone || '';
  const prefix = phone.substring(0, 3);
  const suffix = phone.substring(phone.length - 4);
  return `${prefix}***${suffix}`;
}

export function maskGhanaCard(card: string | null | undefined): string {
  if (!card) return '';
  if (card.startsWith('GHA-')) {
    const suffix = card.substring(card.length - 4);
    return `GHA-XXXXXX${suffix}`;
  }
  return '***REDACTED***';
}
