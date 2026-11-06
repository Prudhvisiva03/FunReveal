import {
  normalizeString,
  generateDeterministicHash,
  hashToBoundedInteger,
  pickDeterministic,
  ALGORITHM_VERSION,
} from "./utils";

export interface MarriageCompatibilityOutput {
  score: number;
  communicationCategory: string;
  personalityComparison: string;
  positiveMessage: string;
  domesticSynergy: {
    conflictResolution: number;
    financialHarmony: number;
    adventureSpirit: number;
    homeComfort: number;
  };
  algorithmVersion: string;
  disclaimer: string;
}

const COMMUNICATION_CATEGORIES = [
  "Harmonious Diplomacy & Mutual Respect",
  "Spontaneous Banter & Expressive Warmth",
  "Thoughtful Listening & Deep Reflection",
  "Direct, Honest & Constructive Dialogue",
  "Playful Teasing with Solid Foundations",
];

const COMPARISONS = [
  "One brings the lightning brainstorms; the other weaves the steady framework to bring them to fruition.",
  "Like yin and yang, one is the calming ocean wave while the other is the vibrant coastal breeze.",
  "You share identical values when it matters most, while your quirky differences keep life endlessly fascinating.",
  "One has the keen eye for scenic road-trips, while the other makes sure the snacks and emergency kit are packed.",
];

const POSITIVE_MESSAGES = [
  "May your shared journey be filled with steaming chai, warm embraces, hearty laughter, and mutual grace.",
  "Great partnerships flourish when two individuals encourage each other to blossom freely while walking hand-in-hand.",
  "A delightful blend of shared ambition and relaxing downtime — celebrate every chapter of your adventure together!",
];

export function calculateMarriageCompatibility(
  name1: string,
  name2: string,
  dob1?: string,
  dob2?: string
): MarriageCompatibilityOutput {
  const norm1 = normalizeString(name1);
  const norm2 = normalizeString(name2);
  const normDob1 = dob1 ? dob1.trim() : "";
  const normDob2 = dob2 ? dob2.trim() : "";

  // Canonical pair sorting
  const pairs = [
    { name: norm1, dob: normDob1 },
    { name: norm2, dob: normDob2 },
  ].sort((a, b) => a.name.localeCompare(b.name));

  const hash = generateDeterministicHash([
    "marriage",
    pairs[0].name,
    pairs[0].dob,
    pairs[1].name,
    pairs[1].dob,
  ]);

  const score = hashToBoundedInteger(hash, 55, 99, 0);
  const communicationCategory = pickDeterministic(hash, COMMUNICATION_CATEGORIES, 4);
  const personalityComparison = pickDeterministic(hash, COMPARISONS, 8);
  const positiveMessage = pickDeterministic(hash, POSITIVE_MESSAGES, 12);

  const conflictResolution = hashToBoundedInteger(hash, 65, 100, 16);
  const financialHarmony = hashToBoundedInteger(hash, 60, 98, 20);
  const adventureSpirit = hashToBoundedInteger(hash, 55, 100, 24);
  const homeComfort = hashToBoundedInteger(hash, 70, 100, 28);

  return {
    score,
    communicationCategory,
    personalityComparison,
    positiveMessage,
    domesticSynergy: {
      conflictResolution,
      financialHarmony,
      adventureSpirit,
      homeComfort,
    },
    algorithmVersion: ALGORITHM_VERSION,
    disclaimer:
      "CRITICAL DISCLAIMER: This tool is strictly a novelty entertainment feature. It must NEVER be used to make real marital, legal, or life commitment decisions.",
  };
}
