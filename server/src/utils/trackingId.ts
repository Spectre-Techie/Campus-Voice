import crypto from 'crypto';

/**
 * Generate a unique tracking ID in format: CV-XXXXXXXX
 * Uses uppercase alphanumerics (no ambiguous chars: 0/O, 1/I/L)
 * 8-char random = ~1.2 trillion combinations
 */
export function generateTrackingId(): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  const bytes = crypto.randomBytes(8);
  let id = 'CV-';
  for (let i = 0; i < 8; i++) {
    id += chars[bytes[i] % chars.length];
  }
  return id;
}
