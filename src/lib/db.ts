import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  isDbConnected: boolean | undefined;
  lastDbCheck: number | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * Resilient DB wrapper with rapid timeout (350ms) and short-circuit circuit breaker.
 * Ensures the app never hangs or freezes when PostgreSQL is offline or unreachable locally.
 */
export async function withDb<T>(
  operation: (client: PrismaClient) => Promise<T>,
  fallback: T
): Promise<T> {
  const now = Date.now();
  // If recently detected offline, don't wait — return fallback immediately
  if (
    globalForPrisma.isDbConnected === false &&
    globalForPrisma.lastDbCheck &&
    now - globalForPrisma.lastDbCheck < 30000
  ) {
    return fallback;
  }

  try {
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("DB_TIMEOUT")), 350)
    );
    const result = await Promise.race([operation(prisma), timeoutPromise]);
    globalForPrisma.isDbConnected = true;
    globalForPrisma.lastDbCheck = now;
    return result;
  } catch {
    globalForPrisma.isDbConnected = false;
    globalForPrisma.lastDbCheck = now;
    return fallback;
  }
}
