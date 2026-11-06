import crypto from "crypto";
import { withDb } from "./db";

// Resilient in-memory cache for fast sub-millisecond lookup
const claimedIps = new Set<string>();
const claimedDeviceHashes = new Set<string>();

/**
 * Extracts real client IP address from cloud and proxy headers (Cloudflare, Vercel, AWS, Nginx).
 */
export function getClientIp(headers: Headers): string {
  const cfIp = headers.get("cf-connecting-ip");
  const forwardedFor = headers.get("x-forwarded-for");
  const realIp = headers.get("x-real-ip");

  if (cfIp && cfIp.trim()) return cfIp.trim();
  if (forwardedFor && forwardedFor.trim()) {
    const firstIp = forwardedFor.split(",")[0].trim();
    if (firstIp) return firstIp;
  }
  if (realIp && realIp.trim()) return realIp.trim();

  return "127.0.0.1";
}

/**
 * Generates deterministic SHA-256 device fingerprint from IP + User Agent.
 */
export function getDeviceFingerprint(ip: string, userAgent: string): string {
  return crypto.createHash("sha256").update(`${ip}:::${userAgent}`).digest("hex");
}

/**
 * Checks if this IP, Device Fingerprint, or Cookie has already claimed their 1st free result.
 * Checks Memory Cache first (0ms), then Cloud / PostgreSQL Database persistently.
 */
export async function hasClaimedFreeResult(
  ip: string,
  userAgent: string,
  cookiePresent: boolean
): Promise<boolean> {
  // 1. Fast Cookie Check
  if (cookiePresent) return true;

  const deviceHash = getDeviceFingerprint(ip, userAgent);

  // 2. In-Memory Fast Check
  if (claimedIps.has(ip) || claimedDeviceHashes.has(deviceHash)) {
    return true;
  }

  // 3. Persistent Database / Cloud Storage Check
  const existingRecord = await withDb(
    (prisma) =>
      prisma.auditLog.findFirst({
        where: {
          action: "FREE_RESULT_CLAIMED",
          OR: [
            { ipAddress: ip },
            { entityId: deviceHash },
          ],
        },
      }),
    null
  );

  if (existingRecord) {
    claimedIps.add(ip);
    claimedDeviceHashes.add(deviceHash);
    return true;
  }

  return false;
}

/**
 * Permanently locks and marks the 1st free result as CLAIMED for this IP and Device in Cloud DB & Memory.
 */
export async function markFreeResultClaimed(
  ip: string,
  userAgent: string
): Promise<void> {
  const deviceHash = getDeviceFingerprint(ip, userAgent);

  // 1. Record in Fast In-Memory Store
  claimedIps.add(ip);
  claimedDeviceHashes.add(deviceHash);

  // 2. Record in Cloud / PostgreSQL Database persistently
  await withDb(
    (prisma) =>
      prisma.auditLog.create({
        data: {
          action: "FREE_RESULT_CLAIMED",
          entity: "Device",
          entityId: deviceHash,
          ipAddress: ip,
          metadata: {
            userAgent,
            claimedAt: new Date().toISOString(),
          },
        },
      }),
    null
  );
}

/**
 * Helper to reset/clear memory cache (useful for testing)
 */
export function clearMemoryIpTracker() {
  claimedIps.clear();
  claimedDeviceHashes.clear();
}
