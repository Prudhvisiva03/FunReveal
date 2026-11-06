import {
  normalizeString,
  generateDeterministicHash,
  hashToBoundedInteger,
  pickDeterministic,
  ALGORITHM_VERSION,
} from "./utils";

export interface FriendshipCalculatorOutput {
  score: number;
  category: string;
  description: string;
  friendshipMessage: string;
  vibePillars: {
    loyalty: number;
    funFactor: number;
    secretKeeper: number;
    vibeSync: number;
  };
  algorithmVersion: string;
  disclaimer: string;
}

const FRIENDSHIP_CATEGORIES = [
  "Inseparable Partners in Crime",
  "Ride or Die Crew",
  "Telepathic Besties",
  "Epic Adventure Buddies",
  "Midnight Call Companions",
  "Chai & Gossip Champions",
  "Unbreakable Vault of Trust",
];

const DESCRIPTIONS = [
  "You two possess an unspoken code: one glance across the room is enough to convey a thousand thoughts and trigger contagious giggles.",
  "Your friendship thrives on legendary banter, sudden spontaneous plans, and an enduring loyalty that stands firm through thick and thin.",
  "Distance and busy schedules cannot shake your rhythm; picking up right where you left off is your natural state of friendship.",
  "You are each other's hype squad, confidants, and personal advisors with zero judgment and endless encouragement.",
];

const MESSAGES = [
  "Friendship like yours is rare gold! Text them right now with an inside joke or treat them to their favorite snack.",
  "A solid friendship doubles the joys and cuts hardships in half. Keep making unforgettable memories together!",
  "Cheers to the countless hours of hilarious conversations and the unwavering support you offer one another.",
];

export function calculateFriendshipCompatibility(name1: string, name2: string): FriendshipCalculatorOutput {
  const norm1 = normalizeString(name1);
  const norm2 = normalizeString(name2);

  const canonicalPair = [norm1, norm2].sort();
  const hash = generateDeterministicHash(["friendship", canonicalPair[0], canonicalPair[1]]);

  const score = hashToBoundedInteger(hash, 50, 99, 2);
  const category = pickDeterministic(hash, FRIENDSHIP_CATEGORIES, 6);
  const description = pickDeterministic(hash, DESCRIPTIONS, 10);
  const friendshipMessage = pickDeterministic(hash, MESSAGES, 14);

  const loyalty = hashToBoundedInteger(hash, 70, 100, 18);
  const funFactor = hashToBoundedInteger(hash, 65, 100, 22);
  const secretKeeper = hashToBoundedInteger(hash, 60, 99, 26);
  const vibeSync = hashToBoundedInteger(hash, 55, 98, 30);

  return {
    score,
    category,
    description,
    friendshipMessage,
    vibePillars: { loyalty, funFactor, secretKeeper, vibeSync },
    algorithmVersion: ALGORITHM_VERSION,
    disclaimer:
      "This result is for lighthearted entertainment purposes only. True friendship is built on mutual respect and shared experiences.",
  };
}
