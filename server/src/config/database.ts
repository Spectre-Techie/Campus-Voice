import { PrismaClient } from '@prisma/client';

// Prevent multiple Prisma instances in development (hot reload)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// ─── Retry Wrapper ──────────────────────────────────────
// Retries a database operation on transient connection errors (P1001, P1002, P1008, P2024)
const RETRYABLE_CODES = new Set(['P1001', 'P1002', 'P1008', 'P2024']);

export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelayMs = 500,
): Promise<T> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: unknown) {
      const code = (error as { code?: string }).code;
      const isRetryable = code && RETRYABLE_CODES.has(code);

      if (!isRetryable || attempt === maxRetries) {
        throw error;
      }

      // Exponential backoff: 500ms, 1000ms, 2000ms
      const delay = baseDelayMs * Math.pow(2, attempt);
      await new Promise((resolve) => setTimeout(resolve, delay));

      // Force reconnect on connection errors
      try {
        await prisma.$disconnect();
        await prisma.$connect();
      } catch {
        // Ignore reconnect errors — next attempt will retry
      }
    }
  }
  throw new Error('withRetry: unreachable');
}

export default prisma;
