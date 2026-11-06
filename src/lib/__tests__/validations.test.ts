import {
  LoveCalculatorSchema,
  FriendshipCalculatorSchema,
  FuturePartnerSchema,
  MarriageCompatibilitySchema,
  LuckyNumberSchema,
  BestFriendTestSchema,
  PersonalityTestSchema,
} from "@/lib/validations/tools";

describe("Tool Input Validations (Zod)", () => {
  test("LoveCalculatorSchema accepts valid names", () => {
    const valid = LoveCalculatorSchema.safeParse({ name1: "Rahul", name2: "Ananya" });
    expect(valid.success).toBe(true);
  });

  test("LoveCalculatorSchema rejects empty names", () => {
    const empty1 = LoveCalculatorSchema.safeParse({ name1: "", name2: "Ananya" });
    const empty2 = LoveCalculatorSchema.safeParse({ name1: "Rahul", name2: "   " });
    expect(empty1.success).toBe(false);
    expect(empty2.success).toBe(false);
  });

  test("LoveCalculatorSchema rejects names longer than 60 characters", () => {
    const tooLong = "A".repeat(61);
    const result = LoveCalculatorSchema.safeParse({ name1: tooLong, name2: "Ananya" });
    expect(result.success).toBe(false);
  });

  test("FuturePartnerSchema allows optional date of birth", () => {
    const withDob = FuturePartnerSchema.safeParse({ name: "Kiran", dob: "1998-05-12" });
    const withoutDob = FuturePartnerSchema.safeParse({ name: "Kiran" });
    const emptyDob = FuturePartnerSchema.safeParse({ name: "Kiran", dob: "" });
    expect(withDob.success).toBe(true);
    expect(withoutDob.success).toBe(true);
    expect(emptyDob.success).toBe(true);
  });

  test("PersonalityTestSchema requires all 10 answers", () => {
    const partialAnswers = { p1: "a", p2: "b", p3: "c" };
    const invalid = PersonalityTestSchema.safeParse({ answers: partialAnswers });
    expect(invalid.success).toBe(false);

    const fullAnswers = {
      p1: "a", p2: "b", p3: "c", p4: "d", p5: "a",
      p6: "b", p7: "c", p8: "d", p9: "a", p10: "b",
    };
    const valid = PersonalityTestSchema.safeParse({ answers: fullAnswers });
    expect(valid.success).toBe(true);
  });

  test("BestFriendTestSchema requires answers for both friends", () => {
    const valid = BestFriendTestSchema.safeParse({
      name1: "Alex",
      name2: "Sam",
      answers1: { q1: "cafe" },
      answers2: { q1: "cafe" },
    });
    expect(valid.success).toBe(true);

    const missingFriend2 = BestFriendTestSchema.safeParse({
      name1: "Alex",
      name2: "Sam",
      answers1: { q1: "cafe" },
      answers2: {},
    });
    expect(missingFriend2.success).toBe(false);
  });
});
