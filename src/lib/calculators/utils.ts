import crypto from "crypto";

export const ALGORITHM_VERSION = "v1.0";

/**
 * Normalizes user input names (trim, lower-case, collapse multiple spaces)
 */
export function normalizeString(str: string): string {
  if (!str) return "";
  return str.trim().toLowerCase().replace(/\s+/g, " ");
}

/**
 * Creates a deterministic SHA-256 hash using algorithm version and inputs
 */
export function generateDeterministicHash(inputs: (string | number | undefined | null)[]): string {
  const normalized = inputs
    .map((item) => (item === undefined || item === null ? "" : String(item).trim().toLowerCase()))
    .join("::");
  
  const payload = `${ALGORITHM_VERSION}::${normalized}`;
  return crypto.createHash("sha256").update(payload).digest("hex");
}

/**
 * Maps a SHA-256 hex string to an integer in [min, max] inclusive
 */
export function hashToBoundedInteger(hash: string, min: number, max: number, offset = 0): number {
  if (min > max) throw new Error("min cannot exceed max");
  const slice = hash.slice(offset, offset + 8);
  const intVal = parseInt(slice, 16) || 0;
  const range = max - min + 1;
  return min + (intVal % range);
}

/**
 * Picks a deterministic element from an array based on hash offset
 */
export function pickDeterministic<T>(hash: string, list: T[], offset = 0): T {
  if (!list.length) throw new Error("List cannot be empty");
  const slice = hash.slice(offset, offset + 8);
  const intVal = parseInt(slice, 16) || 0;
  return list[intVal % list.length];
}

/**
 * Deterministically picks N distinct elements from an array
 */
export function pickDistinctDeterministic<T>(hash: string, list: T[], count: number, startOffset = 0): T[] {
  const pool = [...list];
  const chosen: T[] = [];
  let currentOffset = startOffset;

  while (chosen.length < count && pool.length > 0) {
    const item = pickDeterministic(hash, pool, currentOffset);
    chosen.push(item);
    const index = pool.indexOf(item);
    pool.splice(index, 1);
    currentOffset += 4;
  }

  return chosen;
}
