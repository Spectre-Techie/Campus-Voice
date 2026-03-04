import jwt from 'jsonwebtoken';
import { env } from '../config/env';

// ─── Token Payload Types ─────────────────────────────────
export interface AccessTokenPayload {
  sub: string;       // admin id
  username: string;
  role: string;
  department: string | null;
  type: 'access';
}

export interface RefreshTokenPayload {
  sub: string;       // admin id
  type: 'refresh';
}

// ─── Token Generation ────────────────────────────────────

/** Generate short-lived access token (15 minutes) */
export function generateAccessToken(payload: Omit<AccessTokenPayload, 'type'>): string {
  return jwt.sign(
    { ...payload, type: 'access' },
    env.JWT_SECRET,
    { expiresIn: '15m' },
  );
}

/** Generate long-lived refresh token (7 days) */
export function generateRefreshToken(adminId: string): string {
  return jwt.sign(
    { sub: adminId, type: 'refresh' } satisfies RefreshTokenPayload,
    env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' },
  );
}

// ─── Token Verification ──────────────────────────────────

/** Verify and decode an access token */
export function verifyAccessToken(token: string): AccessTokenPayload {
  const decoded = jwt.verify(token, env.JWT_SECRET) as AccessTokenPayload;
  if (decoded.type !== 'access') {
    throw new Error('Invalid token type');
  }
  return decoded;
}

/** Verify and decode a refresh token */
export function verifyRefreshToken(token: string): RefreshTokenPayload {
  const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshTokenPayload;
  if (decoded.type !== 'refresh') {
    throw new Error('Invalid token type');
  }
  return decoded;
}
