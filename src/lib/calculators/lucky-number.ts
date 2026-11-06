import {
  normalizeString,
  generateDeterministicHash,
  hashToBoundedInteger,
  pickDeterministic,
  ALGORITHM_VERSION,
} from "./utils";

export interface LuckyNumberOutput {
  luckyNumber: number;
  secondaryLuckyNumbers: number[];
  luckyColour: {
    name: string;
    hex: string;
    meaning: string;
  };
  entertainmentMessage: string;
  numberDescription: string;
  luckyDayOfWeek: string;
  powerElement: string;
  algorithmVersion: string;
  disclaimer: string;
}

const COLOURS = [
  { name: "Royal Amethyst", hex: "#8b5cf6", meaning: "Intuition, peace, and creative inspiration" },
  { name: "Neon Rose", hex: "#ec4899", meaning: "Joyful charisma, playful energy, and heart warmth" },
  { name: "Emerald Glade", hex: "#10b981", meaning: "Vitality, freshness, and abundant possibilities" },
  { name: "Electric Cyan", hex: "#06b6d4", meaning: "Clarity, spontaneous communication, and fresh ideas" },
  { name: "Sunburst Amber", hex: "#f59e0b", meaning: "Radiance, bold confidence, and warmth" },
  { name: "Cosmic Indigo", hex: "#6366f1", meaning: "Deep focus, mystery, and mindful reflection" },
];

const DESCRIPTIONS: Record<number, string> = {
  1: "The Trailblazer: Represents fresh starts, independent vision, and the spark of pioneering leadership.",
  2: "The Harmonizer: Embodies partnership, delicate balance, empathetic diplomacy, and peace.",
  3: "The Radiator: Symbolizes exuberant creativity, joyful self-expression, wit, and social warmth.",
  4: "The Anchor: Stands for solid foundations, practical wisdom, loyalty, and steady perseverance.",
  5: "The Free Spirit: Radiates adventurous adaptability, curiosity, dynamic change, and vibrant enthusiasm.",
  6: "The Guardian: Reflects nurturing compassion, home sanctuary, artistic grace, and heartfelt responsibility.",
  7: "The Mystic Seeker: Represents analytical depth, quiet wisdom, philosophical curiosity, and inner truth.",
  8: "The Dynamo: Symbolizes ambitious manifestation, resilience, organizational acumen, and boundless energy.",
  9: "The Humanitarian: Represents broad-minded empathy, artistic completion, wisdom, and selfless generosity.",
};

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const ELEMENTS = ["Stardust", "Aurora Glow", "Ocean Mist", "Solar Flare", "Highland Breeze"];

export function generateLuckyNumberReport(name: string, dob?: string): LuckyNumberOutput {
  const normName = normalizeString(name);
  const normDob = dob ? dob.trim() : "no-dob";

  const hash = generateDeterministicHash(["lucky-number", normName, normDob]);

  // Primary lucky single digit 1-9
  const luckyNumber = hashToBoundedInteger(hash, 1, 9, 0);

  // Secondary lucky numbers in range 10-99
  const secondary1 = hashToBoundedInteger(hash, 10, 49, 4);
  const secondary2 = hashToBoundedInteger(hash, 50, 99, 8);

  const luckyColour = pickDeterministic(hash, COLOURS, 12);
  const luckyDayOfWeek = pickDeterministic(hash, DAYS, 16);
  const powerElement = pickDeterministic(hash, ELEMENTS, 20);

  const numberDescription =
    DESCRIPTIONS[luckyNumber] ||
    "A versatile, harmonious energy resonating with personal vitality and optimism.";

  const entertainmentMessage = `Number ${luckyNumber} shines on your path today! Keep your spirits high, trust your instincts, and enjoy the cheerful syncs of life.`;

  return {
    luckyNumber,
    secondaryLuckyNumbers: [secondary1, secondary2],
    luckyColour,
    entertainmentMessage,
    numberDescription,
    luckyDayOfWeek,
    powerElement,
    algorithmVersion: ALGORITHM_VERSION,
    disclaimer:
      "This lucky number generator is strictly a fun entertainment novelty. Numbers have no magical influence over lotteries, investments, or destiny.",
  };
}
