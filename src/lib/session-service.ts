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
import { getToolPricePaise, isToolEnabled } from "./settings";
import crypto from "crypto";

// Resilient memory cache for sessions
const memorySessions = new Map<string, any>();

export interface CreateSessionResult {
  sessionId: string;
  toolType: ToolType;
  preview: PreviewData;
  pricePaise: number;
  expiresAt: Date;
  status: SessionStatus;
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

  // 2. Validate inputs and calculate full result
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
      const calculated = calculateMarriageCompatibility(parsed.name1, parsed.name2, parsed.dob1, parsed.dob2);
      fullResult = {
        ...calculated,
        name1: parsed.name1,
        name2: parsed.name2,
        dob1: parsed.dob1,
        dob2: parsed.dob2,
      };
      inputHash = generateDeterministicHash(["marriage", parsed.name1, parsed.name2, parsed.dob1 || "", parsed.dob2 || ""]);
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
      const calculated = calculateBestFriendQuiz(parsed.name1, parsed.name2, parsed.answers1, parsed.answers2);
      fullResult = {
        ...calculated,
        name1: parsed.name1,
        name2: parsed.name2,
      };
      inputHash = generateDeterministicHash(["best-friend", parsed.name1, parsed.name2, JSON.stringify(parsed.answers1), JSON.stringify(parsed.answers2)]);
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

  // 3. Generate safe preview data
  const preview = generatePreviewData(toolType, validatedData);

  // 4. Session expires in 48 hours
  const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);
  const resultHash = crypto.randomBytes(24).toString("hex");
  const pricePaise = isFree ? 0 : 100; // 1st result FREE, subsequent results ₹1 (100 paise)
  const sessionId = `sess_${crypto.randomBytes(16).toString("hex")}`;
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
  const session = await withDb(
    (prisma) => prisma.resultSession.create({ data: sessionRecord }),
    null
  );

  if (session) {
    return {
      sessionId: session.id,
      toolType: session.toolType,
      preview,
      pricePaise,
      expiresAt: session.expiresAt,
      status: session.status,
    };
  }

  return {
    sessionId: sessionRecord.id,
    toolType: sessionRecord.toolType,
    preview,
    pricePaise,
    expiresAt: sessionRecord.expiresAt,
    status: sessionRecord.status,
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

  return session;
}
