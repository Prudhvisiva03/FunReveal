import {
  createToolResultSession,
  getSessionById,
  decodeSignedSessionId,
  createUnlockedSessionId,
} from "../session-service";
import { ToolType, SessionStatus } from "@prisma/client";

describe("Stateless Session Service for Serverless Environments (Vercel)", () => {
  it("creates a signed session and decodes it without relying on local DB or RAM", async () => {
    const session = await createToolResultSession(
      ToolType.LOVE_CALCULATOR,
      { name1: "Priya", name2: "Rahul" },
      true // 1st free result
    );

    expect(session.sessionId).toBeDefined();
    expect(session.sessionId.startsWith("sess_")).toBe(true);

    // Decode signed session
    const decoded = decodeSignedSessionId(session.sessionId);
    expect(decoded).not.toBeNull();
    expect(decoded?.toolType).toBe(ToolType.LOVE_CALCULATOR);
    expect(decoded?.payload).toEqual({ name1: "Priya", name2: "Rahul" });
    expect(decoded?.isFirstFree).toBe(true);
    expect(decoded?.isUnlocked).toBe(true);

    // Fetch via getSessionById
    const fetched = await getSessionById(session.sessionId);
    expect(fetched).not.toBeNull();
    expect(fetched?.status).toBe(SessionStatus.PAID);
    expect(fetched?.fullResult).toBeDefined();
    expect(fetched?.fullResult.score).toBeGreaterThanOrEqual(0);
    expect(fetched?.fullResult.name1).toBe("Priya");
    expect(fetched?.fullResult.name2).toBe("Rahul");
  });

  it("handles non-free session with unlock token transition", async () => {
    const session = await createToolResultSession(
      ToolType.FRIENDSHIP_CALCULATOR,
      { name1: "Alex", name2: "Jordan" },
      false // non-free (paid)
    );

    const fetchedLocked = await getSessionById(session.sessionId);
    expect(fetchedLocked).not.toBeNull();
    expect(fetchedLocked?.status).toBe(SessionStatus.PENDING_PAYMENT);
    expect(fetchedLocked?.fullResult).toBeNull(); // Sealed

    // Unlock
    const unlockedId = createUnlockedSessionId(session.sessionId);
    expect(unlockedId).not.toBe(session.sessionId);

    const fetchedUnlocked = await getSessionById(unlockedId);
    expect(fetchedUnlocked).not.toBeNull();
    expect(fetchedUnlocked?.status).toBe(SessionStatus.PAID);
    expect(fetchedUnlocked?.fullResult).toBeDefined();
    expect(fetchedUnlocked?.fullResult.name1).toBe("Alex");
    expect(fetchedUnlocked?.fullResult.name2).toBe("Jordan");
  });
});
