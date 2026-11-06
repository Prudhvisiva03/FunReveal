import {
  normalizeString,
  generateDeterministicHash,
  hashToBoundedInteger,
  pickDeterministic,
  ALGORITHM_VERSION,
} from "./utils";

export interface LoveCalculatorOutput {
  score: number;
  title: string;
  category: string;
  description: string;
  entertainmentMessage: string;
  funAspects: {
    passion: number;
    humor: number;
    communication: number;
    trust: number;
  };
  algorithmVersion: string;
  disclaimer: string;
}

const TITLES = [
  "Cosmic Soulmates",
  "Electric Chemistry",
  "Harmonious Duet",
  "Sweet Sparks",
  "Playful Companions",
  "Dynamic Duo",
  "Warm Affection",
  "Star-Crossed Synergy",
  "Golden Bond",
  "Enchanted Pairing",
];

const CATEGORIES = [
  "Once in a Lifetime Match",
  "High Voltage Passion",
  "Deep Understanding & Joy",
  "Wonderful Everyday Chemistry",
  "Playful & Adventurous Connection",
  "Comfortable & Nurturing Warmth",
  "Spark of Mystery & Magnetism",
];

const DESCRIPTIONS = [
  "Your connection radiates a unique frequency where laughter, unspoken empathy, and shared enthusiasm effortlessly align.",
  "There is a vibrant magnetism between your energies that makes conversations thrilling and moments together memorable.",
  "You balance each other with comforting ease, finding joy in small gestures, heartfelt jokes, and shared curiosities.",
  "A spontaneous, high-energy dynamic where neither of you will ever run out of fun stories, playful banter, and cheerful adventures.",
];

const ENTERTAINMENT_MESSAGES = [
  "The cosmic dice rolled high on your names! Keep spreading joy, support each other's dreams, and enjoy every laugh.",
  "Your names harmonize like a classic love song. Celebrate your bond with a warm smile and a cup of chai!",
  "Stars or algorithms, true connection is nurtured with kindness and genuine care. Celebrate each other today!",
  "A match forged in playful algorithms! Remember to always keep the humor alive and cherish the little moments.",
];

export function calculateLoveCompatibility(name1: string, name2: string): LoveCalculatorOutput {
  const norm1 = normalizeString(name1);
  const norm2 = normalizeString(name2);

  // Sort names canonically so order does not matter: "Alice" & "Bob" === "Bob" & "Alice"
  const canonicalPair = [norm1, norm2].sort();
  const hash = generateDeterministicHash(["love", canonicalPair[0], canonicalPair[1]]);

  // Deterministic score between 45 and 99 for high positive entertainment
  const score = hashToBoundedInteger(hash, 45, 99, 0);

  const title = pickDeterministic(hash, TITLES, 4);
  const category = pickDeterministic(hash, CATEGORIES, 8);
  const description = pickDeterministic(hash, DESCRIPTIONS, 12);
  const entertainmentMessage = pickDeterministic(hash, ENTERTAINMENT_MESSAGES, 16);

  const passion = hashToBoundedInteger(hash, 50, 100, 20);
  const humor = hashToBoundedInteger(hash, 60, 100, 24);
  const communication = hashToBoundedInteger(hash, 55, 98, 28);
  const trust = hashToBoundedInteger(hash, 65, 100, 32);

  return {
    score,
    title,
    category,
    description,
    entertainmentMessage,
    funAspects: { passion, humor, communication, trust },
    algorithmVersion: ALGORITHM_VERSION,
    disclaimer:
      "This result is strictly generated for entertainment and amusement purposes. It does not scientifically predict human feelings or relationship outcomes.",
  };
}
