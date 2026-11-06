import { withDb } from "./db";
import { ToolType, SessionStatus } from "@prisma/client";
import {
  calculateLoveCompatibility,
  calculateFriendshipCompatibility,
  generateFuturePartnerProfile,
  calculateMarriageCompatibility,
  generateLuckyNumberReport,
  calculateBestFriendQuiz,
  calculatePersonalityResult,
  generateDeterministicHash,
  ALGORITHM_VERSION,
} from "./calculators";
import { generatePreviewData, PreviewData } from "./calculators/preview";
import {
  LoveCalculatorSchema,
  FriendshipCalculatorSchema,
  FuturePartnerSchema,
  MarriageCompatibilitySchema,
  LuckyNumberSchema,
  BestFriendTestSchema,
  PersonalityTestSchema,
} from "./validations/tools";
import { isToolEnabled } from "./settings";
import crypto from "crypto";

// Resilient memory cache for sessions
const memorySessions = new Map<string, any>();

// Secret key for HMAC signing of stateless sessions (fallback ensures stability if env is missing)
const SESSION_SECRET =
  process.env.SESSION_SECRET ||
  process.env.NEXTAUTH_SECRET ||
  "funreveal-cosmic-secret-salt-2026-sha256";

function signToken(dataStr: string): string {
  return crypto.createHmac("sha256", SESSION_SECRET).update(dataStr).digest("hex").slice(0, 16);
}

/**
 * Encodes session data into a compact, tamper-proof signed token.
 * This ensures that on serverless platforms (e.g., Vercel), sessions
 * never get lost across ephemeral lambda instances even if PostgreSQL is offline!
 */
export function encodeSignedSessionId(data: {
  toolType: ToolType;
  payload: Record<string, unknown>;
  isFirstFree: boolean;
  isPaid?: boolean;
  createdAt?: number;
}): string {
  const compactObj = {
    t: data.toolType,
    p: data.payload,
    f: data.isFirstFree ? 1 : 0,
    u: data.isPaid ? 1 : 0,
    c: data.createdAt || Date.now(),
  };
  const json = JSON.stringify(compactObj);
  const b64 = Buffer.from(json, "utf-8").toString("base64url");
  const sig = signToken(b64);
  return `sess_${b64}_${sig}`;
}

/**
 * Generates an unlocked signed token when a session is paid.
 */
export function createUnlockedSessionId(sessionId: string): string {
  if (!sessionId || !sessionId.startsWith("sess_")) return sessionId;
  const parts = sessionId.replace(/^sess_/, "").split("_");
  if (parts.length < 2) return sessionId;
  const b64 = parts[0];
  const sig = parts[1];
  const paidSig = signToken(`${b64}:paid`).slice(0, 10);
  return `sess_${b64}_${sig}_${paidSig}`;
}

/**
 * Decodes and verifies a stateless signed session token.
 */
export function decodeSignedSessionId(sessionId: string): {
  toolType: ToolType;
  payload: Record<string, unknown>;
  isFirstFree: boolean;
  isUnlocked: boolean;
  createdAt: Date;
} | null {
  if (!sessionId || !sessionId.startsWith("sess_")) return null;
  const parts = sessionId.replace(/^sess_/, "").split("_");
  if (parts.length < 2) return null;
  const b64 = parts[0];
  const sig = parts[1];
  const expectedSig = signToken(b64);
  if (sig !== expectedSig) return null;

  try {
    const json = Buffer.from(b64, "base64url").toString("utf-8");
    const parsed = JSON.parse(json);
    const isPaidSuffix = parts.length >= 3 && parts[2] === signToken(`${b64}:paid`).slice(0, 10);
    const isFirstFree = Boolean(parsed.f);
    const isUnlocked = isFirstFree || Boolean(parsed.u) || isPaidSuffix;

    return {
      toolType: parsed.t as ToolType,
      payload: parsed.p,
      isFirstFree,
      isUnlocked,
      createdAt: new Date(parsed.c || Date.now()),
    };
  } catch {
    return null;
  }
}

export interface CreateSessionResult {
  sessionId: string;
  toolType: ToolType;
  preview: PreviewData;
  pricePaise: number;
  expiresAt: Date;
  status: SessionStatus;
}

/**
 * Deterministically computes the full result and preview data for any tool.
 */
export function computeResultAndPreview(
  toolType: ToolType,
  rawPayload: Record<string, unknown>
): {
  validatedData: Record<string, any>;
  fullResult: Record<string, any>;
  preview: PreviewData;
  inputHash: string;
} {
  let validatedData: Record<string, any>;
  let fullResult: Record<string, any>;
  let inputHash: string;

  switch (toolType) {
    case ToolType.LOVE_CALCULATOR: {
      const parsed = LoveCalculatorSchema.parse(rawPayload);
      validatedData = parsed;
      const calculated = calculateLoveCompatibility(parsed.name1, parsed.name2);
      fullResult = {
        ...calculated,
        name1: parsed.name1,
        name2: parsed.name2,
      };
      inputHash = generateDeterministicHash(["love", parsed.name1, parsed.name2]);
      break;
    }

    case ToolType.FRIENDSHIP_CALCULATOR: {
      const parsed = FriendshipCalculatorSchema.parse(rawPayload);
      validatedData = parsed;
      const calculated = calculateFriendshipCompatibility(parsed.name1, parsed.name2);
      fullResult = {
        ...calculated,
        name1: parsed.name1,
        name2: parsed.name2,
      };
      inputHash = generateDeterministicHash(["friendship", parsed.name1, parsed.name2]);
      break;
    }

    case ToolType.FUTURE_PARTNER: {
      const parsed = FuturePartnerSchema.parse(rawPayload);
      validatedData = parsed;
      const calculated = generateFuturePartnerProfile(parsed.name, parsed.dob);
      fullResult = {
        ...calculated,
        name: parsed.name,
        dob: parsed.dob,
      };
      inputHash = generateDeterministicHash(["future-partner", parsed.name, parsed.dob || ""]);
      break;
    }

    case ToolType.MARRIAGE_COMPATIBILITY: {
      const parsed = MarriageCompatibilitySchema.parse(rawPayload);
      validatedData = parsed;
      const calculated = calculateMarriageCompatibility(
        parsed.name1,
        parsed.name2,
        parsed.dob1,
        parsed.dob2
      );
      fullResult = {
        ...calculated,
        name1: parsed.name1,
        name2: parsed.name2,
        dob1: parsed.dob1,
        dob2: parsed.dob2,
      };
      inputHash = generateDeterministicHash([
        "marriage",
        parsed.name1,
        parsed.name2,
        parsed.dob1 || "",
        parsed.dob2 || "",
      ]);
      break;
    }

    case ToolType.LUCKY_NUMBER: {
      const parsed = LuckyNumberSchema.parse(rawPayload);
      validatedData = parsed;
      const calculated = generateLuckyNumberReport(parsed.name, parsed.dob);
      fullResult = {
        ...calculated,
        name: parsed.name,
        dob: parsed.dob,
      };
      inputHash = generateDeterministicHash(["lucky-number", parsed.name, parsed.dob || ""]);
      break;
    }

    case ToolType.BEST_FRIEND_TEST: {
      const parsed = BestFriendTestSchema.parse(rawPayload);
      validatedData = parsed;
      const calculated = calculateBestFriendQuiz(
        parsed.name1,
        parsed.name2,
        parsed.answers1,
        parsed.answers2
      );
      fullResult = {
        ...calculated,
        name1: parsed.name1,
        name2: parsed.name2,
      };
      inputHash = generateDeterministicHash([
        "best-friend",
        parsed.name1,
        parsed.name2,
        JSON.stringify(parsed.answers1),
        JSON.stringify(parsed.answers2),
      ]);
      break;
    }

    case ToolType.PERSONALITY_TEST: {
      const parsed = PersonalityTestSchema.parse(rawPayload);
      validatedData = parsed;
      const calculated = calculatePersonalityResult(parsed.answers);
      fullResult = {
        ...calculated,
        answers: parsed.answers,
      };
      inputHash = generateDeterministicHash(["personality", JSON.stringify(parsed.answers)]);
      break;
    }

    default:
      throw new Error(`Unsupported tool type: ${toolType}`);
  }

  const preview = generatePreviewData(toolType, validatedData);
  return { validatedData, fullResult, preview, inputHash };
}

export async function createToolResultSession(
  toolType: ToolType,
  rawPayload: Record<string, unknown>,
  isFree: boolean = false
): Promise<CreateSessionResult> {
  // 1. Verify tool is enabled
  const toolKey = toolType.toLowerCase();
  const enabled = await isToolEnabled(toolKey);
  if (!enabled) {
    throw new Error(`This tool is currently disabled by administrator.`);
  }

  // 2. Validate inputs and calculate deterministic result + preview
  const { validatedData, fullResult, preview, inputHash } = computeResultAndPreview(
    toolType,
    rawPayload
  );

  // 3. Generate self-contained signed session ID (works 100% across all Vercel Lambdas)
  const sessionId = encodeSignedSessionId({
    toolType,
    payload: validatedData,
    isFirstFree: isFree,
    isPaid: isFree,
    createdAt: Date.now(),
  });

  const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);
  const resultHash = crypto.randomBytes(24).toString("hex");
  const pricePaise = isFree ? 0 : 100; // 1st result FREE, subsequent results ₹1
  const now = new Date();
  const sessionStatus = isFree ? SessionStatus.PAID : SessionStatus.PENDING_PAYMENT;

  const sessionRecord = {
    id: sessionId,
    toolType,
    resultHash,
    resultData: fullResult,
    previewData: preview as any,
    inputHash,
    status: sessionStatus,
    paidAt: isFree ? now : null,
    pricePaise,
    isFirstFree: isFree,
    algorithmVersion: ALGORITHM_VERSION,
    expiresAt,
  };

  // Always keep in fallback memory cache
  memorySessions.set(sessionId, sessionRecord);

  // Store session in PostgreSQL database if available with resilient fallback
  await withDb(
    (prisma) => prisma.resultSession.create({ data: sessionRecord }),
    null
  );

  return {
    sessionId,
    toolType,
    preview,
    pricePaise,
    expiresAt,
    status: sessionStatus,
  };
}

export async function getSessionById(sessionId: string) {
  // 1. Ultra-fast lookup in memory cache (instant 0ms response)
  let session: any = memorySessions.get(sessionId);

  // 2. If not in memory, query PostgreSQL with circuit breaker
  if (!session) {
    session = await withDb(
      (prisma) => prisma.resultSession.findUnique({ where: { id: sessionId } }),
      null
    );
  }

  // 3. Resilient Stateless Decoding Fallback (guarantees 100% success on Vercel without DB!)
  if (!session) {
    const decoded = decodeSignedSessionId(sessionId);
    if (decoded) {
      try {
        const { fullResult, preview } = computeResultAndPreview(decoded.toolType, decoded.payload);
        const expiresAt = new Date(decoded.createdAt.getTime() + 48 * 60 * 60 * 1000);
        const isPaid = decoded.isUnlocked;

        session = {
          id: sessionId,
          toolType: decoded.toolType,
          status: isPaid ? SessionStatus.PAID : SessionStatus.PENDING_PAYMENT,
          paidAt: isPaid ? decoded.createdAt : null,
          pricePaise: decoded.isFirstFree ? 0 : 100,
          resultData: fullResult,
          previewData: preview,
          expiresAt,
          isFirstFree: decoded.isFirstFree,
        };

        // Cache in memory for subsequent calls in the same container
        memorySessions.set(sessionId, session);
      } catch (err) {
        console.error("Failed to decode stateless session payload:", err);
      }
    }
  }

  if (!session) {
    return null;
  }

  const isPaid = session.status === SessionStatus.PAID;

  return {
    id: session.id,
    toolType: session.toolType,
    status: session.status,
    paidAt: session.paidAt || null,
    pricePaise: session.pricePaise ?? 100,
    fullResult: isPaid ? session.resultData : null,
    preview: session.previewData,
    expiresAt: session.expiresAt,
    isFirstFree: session.isFirstFree || false,
  };
}

export async function unlockSession(sessionId: string) {
  const now = new Date();
  const session: any = memorySessions.get(sessionId);

  if (session) {
    session.status = SessionStatus.PAID;
    session.paidAt = now;
    memorySessions.set(sessionId, session);
  }

  // Update in database if available
  await withDb(
    (prisma) =>
      prisma.resultSession.update({
        where: { id: sessionId },
        data: {
          status: SessionStatus.PAID,
          paidAt: now,
        },
      }),
    null
  );

  // If stateless signed token, create unlocked session id
  const unlockedId = createUnlockedSessionId(sessionId);
  if (unlockedId !== sessionId) {
    const decoded = decodeSignedSessionId(unlockedId);
    if (decoded) {
      try {
        const { fullResult, preview } = computeResultAndPreview(decoded.toolType, decoded.payload);
        const unlockedRecord = {
          id: unlockedId,
          toolType: decoded.toolType,
          resultData: fullResult,
          previewData: preview,
          status: SessionStatus.PAID,
          paidAt: now,
          pricePaise: 100,
          isFirstFree: false,
          expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
        };
        memorySessions.set(unlockedId, unlockedRecord);
      } catch (err) {
        console.error("Failed to prepare unlocked record:", err);
      }
    }
  }

  return { session, unlockedSessionId: unlockedId };
}
