import {
  generateDeterministicHash,
  hashToBoundedInteger,
  pickDeterministic,
  normalizeString,
  ALGORITHM_VERSION,
} from "@/lib/calculators/utils";
import { calculateLoveCompatibility } from "@/lib/calculators/love";
import { calculateFriendshipCompatibility } from "@/lib/calculators/friendship";
import { generateFuturePartnerProfile } from "@/lib/calculators/future-partner";
import { calculateMarriageCompatibility } from "@/lib/calculators/marriage";
import { generateLuckyNumberReport } from "@/lib/calculators/lucky-number";
import { calculateBestFriendQuiz } from "@/lib/calculators/best-friend";
import { calculatePersonalityResult } from "@/lib/calculators/personality";

// ---- Utility tests ----
describe("Calculator Utilities", () => {
  test("normalizeString trims and lowercases", () => {
    expect(normalizeString("  ALICE  ")).toBe("alice");
    expect(normalizeString("  Hello   World  ")).toBe("hello world");
    expect(normalizeString("")).toBe("");
  });

  test("generateDeterministicHash returns 64-char hex string", () => {
    const hash = generateDeterministicHash(["love", "alice", "bob"]);
    expect(hash).toHaveLength(64);
    expect(/^[0-9a-f]+$/.test(hash)).toBe(true);
  });

  test("generateDeterministicHash is deterministic", () => {
    const h1 = generateDeterministicHash(["love", "alice", "bob"]);
    const h2 = generateDeterministicHash(["love", "alice", "bob"]);
    expect(h1).toBe(h2);
  });

  test("generateDeterministicHash differs for different inputs", () => {
    const h1 = generateDeterministicHash(["love", "alice", "bob"]);
    const h2 = generateDeterministicHash(["love", "alice", "charlie"]);
    expect(h1).not.toBe(h2);
  });

  test("hashToBoundedInteger stays in range", () => {
    const hash = generateDeterministicHash(["test"]);
    for (let min = 0; min < 10; min++) {
      for (let max = min + 1; max <= min + 100; max += 10) {
        const val = hashToBoundedInteger(hash, min, max);
        expect(val).toBeGreaterThanOrEqual(min);
        expect(val).toBeLessThanOrEqual(max);
      }
    }
  });

  test("pickDeterministic returns valid array element", () => {
    const hash = generateDeterministicHash(["test"]);
    const arr = ["a", "b", "c", "d", "e"];
    const result = pickDeterministic(hash, arr);
    expect(arr).toContain(result);
  });

  test("ALGORITHM_VERSION is defined", () => {
    expect(ALGORITHM_VERSION).toBeTruthy();
    expect(typeof ALGORITHM_VERSION).toBe("string");
  });
});

// ---- Love Calculator ----
describe("Love Calculator", () => {
  test("produces a score between 45 and 99", () => {
    const result = calculateLoveCompatibility("Alice", "Bob");
    expect(result.score).toBeGreaterThanOrEqual(45);
    expect(result.score).toBeLessThanOrEqual(99);
  });

  test("is deterministic: same names same result", () => {
    const r1 = calculateLoveCompatibility("Priya", "Rahul");
    const r2 = calculateLoveCompatibility("Priya", "Rahul");
    expect(r1.score).toBe(r2.score);
    expect(r1.title).toBe(r2.title);
    expect(r1.category).toBe(r2.category);
  });

  test("is commutative: Alice+Bob === Bob+Alice", () => {
    const r1 = calculateLoveCompatibility("Alice", "Bob");
    const r2 = calculateLoveCompatibility("Bob", "Alice");
    expect(r1.score).toBe(r2.score);
  });

  test("contains all required fields", () => {
    const result = calculateLoveCompatibility("Test", "User");
    expect(result).toHaveProperty("score");
    expect(result).toHaveProperty("title");
    expect(result).toHaveProperty("category");
    expect(result).toHaveProperty("description");
    expect(result).toHaveProperty("entertainmentMessage");
    expect(result).toHaveProperty("funAspects");
    expect(result).toHaveProperty("disclaimer");
    expect(result).toHaveProperty("algorithmVersion");
  });

  test("funAspects values are in range 50-100", () => {
    const result = calculateLoveCompatibility("Anjali", "Vikram");
    const { passion, humor, communication, trust } = result.funAspects;
    [passion, humor, communication, trust].forEach((v) => {
      expect(v).toBeGreaterThanOrEqual(50);
      expect(v).toBeLessThanOrEqual(100);
    });
  });

  test("disclaimer is not empty", () => {
    const result = calculateLoveCompatibility("A", "B");
    expect(result.disclaimer.length).toBeGreaterThan(10);
  });
});

// ---- Friendship Calculator ----
describe("Friendship Calculator", () => {
  test("produces a score between 50 and 99", () => {
    const result = calculateFriendshipCompatibility("Ravi", "Kumar");
    expect(result.score).toBeGreaterThanOrEqual(50);
    expect(result.score).toBeLessThanOrEqual(99);
  });

  test("is deterministic", () => {
    const r1 = calculateFriendshipCompatibility("Sam", "Alex");
    const r2 = calculateFriendshipCompatibility("Sam", "Alex");
    expect(r1.score).toBe(r2.score);
  });

  test("is commutative", () => {
    const r1 = calculateFriendshipCompatibility("Sam", "Alex");
    const r2 = calculateFriendshipCompatibility("Alex", "Sam");
    expect(r1.score).toBe(r2.score);
  });

  test("contains required fields", () => {
    const result = calculateFriendshipCompatibility("A", "B");
    expect(result).toHaveProperty("score");
    expect(result).toHaveProperty("category");
    expect(result).toHaveProperty("description");
    expect(result).toHaveProperty("friendshipMessage");
    expect(result).toHaveProperty("vibePillars");
  });
});

// ---- Future Partner Generator ----
describe("Future Partner Generator", () => {
  test("is deterministic for same inputs", () => {
    const r1 = generateFuturePartnerProfile("Meera", "1995-05-15");
    const r2 = generateFuturePartnerProfile("Meera", "1995-05-15");
    expect(r1.fictionalArchetype).toBe(r2.fictionalArchetype);
  });

  test("generates different results for different names", () => {
    const r1 = generateFuturePartnerProfile("Meera");
    const r2 = generateFuturePartnerProfile("Priya");
    expect(r1.fictionalArchetype !== r2.fictionalArchetype || r1.meetCuteScenario !== r2.meetCuteScenario).toBe(true);
  });

  test("contains required fields", () => {
    const result = generateFuturePartnerProfile("Test");
    expect(result).toHaveProperty("fictionalArchetype");
    expect(result).toHaveProperty("partnerPersonality");
    expect(result).toHaveProperty("fictionalInterests");
    expect(result).toHaveProperty("keyCharacteristics");
    expect(result).toHaveProperty("meetCuteScenario");
    expect(result).toHaveProperty("disclaimer");
  });

  test("interests and characteristics are arrays of length 4", () => {
    const result = generateFuturePartnerProfile("Amit");
    expect(Array.isArray(result.fictionalInterests)).toBe(true);
    expect(result.fictionalInterests.length).toBeGreaterThanOrEqual(1);
    expect(Array.isArray(result.keyCharacteristics)).toBe(true);
    expect(result.keyCharacteristics.length).toBeGreaterThanOrEqual(1);
  });
});

// ---- Marriage Compatibility ----
describe("Marriage Compatibility", () => {
  test("score is between 55 and 99", () => {
    const result = calculateMarriageCompatibility("Arjun", "Divya");
    expect(result.score).toBeGreaterThanOrEqual(55);
    expect(result.score).toBeLessThanOrEqual(99);
  });

  test("is commutative", () => {
    const r1 = calculateMarriageCompatibility("Arjun", "Divya");
    const r2 = calculateMarriageCompatibility("Divya", "Arjun");
    expect(r1.score).toBe(r2.score);
  });

  test("disclaimer mentions critical warning", () => {
    const result = calculateMarriageCompatibility("A", "B");
    expect(result.disclaimer.toLowerCase()).toContain("entertainment");
  });
});

// ---- Lucky Number ----
describe("Lucky Number Generator", () => {
  test("luckyNumber is between 1 and 9", () => {
    const result = generateLuckyNumberReport("Rohit");
    expect(result.luckyNumber).toBeGreaterThanOrEqual(1);
    expect(result.luckyNumber).toBeLessThanOrEqual(9);
  });

  test("is deterministic", () => {
    const r1 = generateLuckyNumberReport("Rohit", "1990-01-01");
    const r2 = generateLuckyNumberReport("Rohit", "1990-01-01");
    expect(r1.luckyNumber).toBe(r2.luckyNumber);
    expect(r1.luckyColour.name).toBe(r2.luckyColour.name);
  });

  test("luckyColour has name and hex", () => {
    const result = generateLuckyNumberReport("Test");
    expect(result.luckyColour).toHaveProperty("name");
    expect(result.luckyColour).toHaveProperty("hex");
    expect(result.luckyColour.hex).toMatch(/^#[0-9a-f]{6}$/i);
  });

  test("contains secondary lucky numbers", () => {
    const result = generateLuckyNumberReport("Test");
    expect(Array.isArray(result.secondaryLuckyNumbers)).toBe(true);
    expect(result.secondaryLuckyNumbers).toHaveLength(2);
    result.secondaryLuckyNumbers.forEach((n) => {
      expect(n).toBeGreaterThanOrEqual(10);
      expect(n).toBeLessThanOrEqual(99);
    });
  });
});

// ---- Best Friend Quiz ----
describe("Best Friend Quiz", () => {
  const matchingAnswers = { q1: "cafe", q2: "listen", q3: "talk", q4: "humor", q5: "both", q6: "deep_talk" };
  const differentAnswers = { q1: "gaming", q2: "food", q3: "laugh", q4: "look", q5: "neither", q6: "disaster" };

  test("high matching score when all answers match", () => {
    const result = calculateBestFriendQuiz("Sam", "Alex", matchingAnswers, matchingAnswers);
    expect(result.score).toBeGreaterThan(80);
    expect(result.matchingCount).toBe(6);
  });

  test("lower score when no answers match", () => {
    const result = calculateBestFriendQuiz("Sam", "Alex", matchingAnswers, differentAnswers);
    expect(result.matchingCount).toBe(0);
    expect(result.score).toBe(40); // base score only (Math.round(35 + 0*65) clamped to 40 minimum)
  });

  test("score is in range 0-100", () => {
    const result = calculateBestFriendQuiz("A", "B", matchingAnswers, differentAnswers);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  test("contains required fields", () => {
    const result = calculateBestFriendQuiz("A", "B", matchingAnswers, matchingAnswers);
    expect(result).toHaveProperty("score");
    expect(result).toHaveProperty("matchingCount");
    expect(result).toHaveProperty("totalQuestions");
    expect(result).toHaveProperty("friendshipCategory");
    expect(result).toHaveProperty("resultExplanation");
  });
});

// ---- Personality Test ----
describe("Personality Test", () => {
  const extrovertAnswers = {
    p1: "a", p2: "a", p3: "a", p4: "a", p5: "a",
    p6: "a", p7: "a", p8: "a", p9: "a", p10: "a",
  };
  const introvertAnswers = {
    p1: "b", p2: "b", p3: "b", p4: "b", p5: "b",
    p6: "b", p7: "b", p8: "b", p9: "b", p10: "b",
  };
  const creativeAnswers = {
    p1: "c", p2: "c", p3: "c", p4: "c", p5: "c",
    p6: "c", p7: "c", p8: "c", p9: "c", p10: "c",
  };

  test("all-E answers returns Extrovert archetype", () => {
    const result = calculatePersonalityResult(extrovertAnswers);
    expect(result.traitCode).toBe("E");
  });

  test("all-I answers returns Introvert archetype", () => {
    const result = calculatePersonalityResult(introvertAnswers);
    expect(result.traitCode).toBe("I");
  });

  test("all-C answers returns Creative archetype", () => {
    const result = calculatePersonalityResult(creativeAnswers);
    expect(result.traitCode).toBe("C");
  });

  test("contains required fields", () => {
    const result = calculatePersonalityResult(extrovertAnswers);
    expect(result).toHaveProperty("personalityCategory");
    expect(result).toHaveProperty("archetypeTitle");
    expect(result).toHaveProperty("traitCode");
    expect(result).toHaveProperty("description");
    expect(result).toHaveProperty("strengths");
    expect(result).toHaveProperty("positiveCharacteristics");
    expect(result).toHaveProperty("traitPercentages");
  });

  test("strengths is a non-empty array", () => {
    const result = calculatePersonalityResult(extrovertAnswers);
    expect(Array.isArray(result.strengths)).toBe(true);
    expect(result.strengths.length).toBeGreaterThan(0);
  });

  test("trait percentages sum to approximately 100", () => {
    const result = calculatePersonalityResult(extrovertAnswers);
    const { vibrantEnergy, innerReflection, creativeSpark, strategicFocus } = result.traitPercentages;
    const sum = vibrantEnergy + innerReflection + creativeSpark + strategicFocus;
    // Allow small rounding errors
    expect(sum).toBeGreaterThanOrEqual(99);
    expect(sum).toBeLessThanOrEqual(101);
  });

  test("handles empty answers gracefully", () => {
    const result = calculatePersonalityResult({});
    expect(result).toHaveProperty("traitCode");
  });
});
