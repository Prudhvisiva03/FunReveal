import {
  normalizeString,
  generateDeterministicHash,
  hashToBoundedInteger,
  pickDeterministic,
  pickDistinctDeterministic,
  ALGORITHM_VERSION,
} from "./utils";

export interface FuturePartnerOutput {
  fictionalArchetype: string;
  partnerPersonality: string;
  aestheticVibe: string;
  fictionalInterests: string[];
  keyCharacteristics: string[];
  funCompatibilityMessage: string;
  meetCuteScenario: string;
  algorithmVersion: string;
  disclaimer: string;
}

const ARCHETYPES = [
  "The Passionate Wanderer & Storyteller",
  "The Cozy Bibliophile & Master Chef",
  "The Ambitious Innovator with a Heart of Gold",
  "The Quirky Creative & Indie Music Explorer",
  "The Serene Philosopher & Nature Enthusiast",
  "The Witty Polymath & Weekend Athlete",
  "The Sun-Drenched Optimist & Coffee Connoisseur",
];

const PERSONALITY_TRAITS = [
  "Warmly empathetic, endlessly curious, and possesses a delightfully dry sense of humor that catches you pleasantly off-guard.",
  "Deeply grounded, fiercely loyal, with an infectious enthusiasm for impromptu stargazing and road trips with great playlists.",
  "Thoughtful and observant, always remembering how you like your coffee and having the perfect book or song recommendation ready.",
  "Charismatic yet gentle-hearted, someone who lights up dinner gatherings and creates a calming sanctuary wherever they go.",
];

const AESTHETIC_VIBES = [
  "Oversized knits, vintage paperbacks, lavender tea, and golden hour walks.",
  "Leather jackets, vinyl records, rainy day coffee shops, and midnight city drives.",
  "Minimalist linen, sunrise hikes, mechanical keyboards, and artisan bakeries.",
  "Cozy sweaters, indoor botanical gardens, cinematic film photography, and acoustic guitar sessions.",
];

const INTERESTS_POOL = [
  "Indie Cinema & Screenplay Discussions",
  "Specialty Coffee Brewing & Pour-Over Rituals",
  "Midnight Astronomy & Planetarium Visits",
  "Artisan Sourdough & Comfort Cooking",
  "Analog Film Photography & Darkroom Experiments",
  "Thrift Hunting & Retro Board Games",
  "Scenic Trail Running & Wilderness Camping",
  "Learning Obscure Cultural Trivia",
  "Live Jazz & Intimate Acoustic Concerts",
  "Museum Strolls & Architectural Sketching",
  "Collecting Classic Vinyl & Cassette Tapes",
  "Volunteering at Animal Shelters",
];

const CHARACTERISTICS_POOL = [
  "Laughs wholeheartedly at dad jokes",
  "Leaves sweet sticky notes on the fridge",
  "Always has snacks ready on long drives",
  "Incredible playlist curator for every mood",
  "Brings calm reassurance to stressful moments",
  "Respects personal boundaries and quiet time",
  "Master of heartwarming comfort meals",
  "Always cheers the loudest for your victories",
];

const MEET_CUTE_SCENARIOS = [
  "Accidentally reaching for the exact same obscure novel in an independent bookshop on a rainy Tuesday.",
  "Swapping coffee orders by mistake at a bustling cafe and laughing over the surprise mix-up.",
  "Sitting next to each other at a mutual friend's impromptu acoustic jam session and realizing you share identical music taste.",
  "Both trying to calm down a golden retriever who joyfully tangled their leash around your ankles at a park.",
];

export function generateFuturePartnerProfile(name: string, dob?: string): FuturePartnerOutput {
  const normName = normalizeString(name);
  const normDob = dob ? dob.trim() : "no-dob";

  const hash = generateDeterministicHash(["future-partner", normName, normDob]);

  const fictionalArchetype = pickDeterministic(hash, ARCHETYPES, 0);
  const partnerPersonality = pickDeterministic(hash, PERSONALITY_TRAITS, 4);
  const aestheticVibe = pickDeterministic(hash, AESTHETIC_VIBES, 8);
  const meetCuteScenario = pickDeterministic(hash, MEET_CUTE_SCENARIOS, 12);

  const fictionalInterests = pickDistinctDeterministic(hash, INTERESTS_POOL, 4, 16);
  const keyCharacteristics = pickDistinctDeterministic(hash, CHARACTERISTICS_POOL, 4, 32);

  const funCompatibilityMessage = `For ${name.trim()}, this fictional profile envisions a companion who balances your unique rhythm with warmth, laughter, and endless mutual respect.`;

  return {
    fictionalArchetype,
    partnerPersonality,
    aestheticVibe,
    fictionalInterests,
    keyCharacteristics,
    funCompatibilityMessage,
    meetCuteScenario,
    algorithmVersion: ALGORITHM_VERSION,
    disclaimer:
      "This is a fictional, playful generator crafted entirely for amusement. It does not predict future partners or romantic destiny.",
  };
}
