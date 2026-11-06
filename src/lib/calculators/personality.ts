import { ALGORITHM_VERSION } from "./utils";

export interface PersonalityQuestion {
  id: string;
  question: string;
  options: {
    value: string;
    label: string;
    trait: "E" | "I" | "C" | "A"; // Extravert/Vibrant, Introvert/Reflective, Creative/Spontaneous, Analytical/Organized
  }[];
}

export const PERSONALITY_QUESTIONS: PersonalityQuestion[] = [
  {
    id: "p1",
    question: "After an exhausting work week, how do you recharge best?",
    options: [
      { value: "a", label: "Going to a lively social hangout or party with friends", trait: "E" },
      { value: "b", label: "Cozying up alone with headphones, gaming, or a book", trait: "I" },
      { value: "c", label: "Starting an exciting DIY project, sketching, or cooking", trait: "C" },
      { value: "d", label: "Cleaning up my space and setting an organized plan for next week", trait: "A" },
    ],
  },
  {
    id: "p2",
    question: "When you receive unexpected free time on a Saturday afternoon, you:",
    options: [
      { value: "a", label: "Call up someone immediately to grab coffee or go out", trait: "E" },
      { value: "b", label: "Take a peaceful nap or binge my favorite comfort series", trait: "I" },
      { value: "c", label: "Wander around exploring a new neighborhood or hobby shop", trait: "C" },
      { value: "d", label: "Knock out high-priority personal tasks and organize finances", trait: "A" },
    ],
  },
  {
    id: "p3",
    question: "How do you usually solve complex problems?",
    options: [
      { value: "a", label: "Brainstorming loudly with a group to bounce ideas", trait: "E" },
      { value: "b", label: "Pondering silently and looking at internal patterns", trait: "I" },
      { value: "c", label: "Trusting intuition and improvising outside conventional lines", trait: "C" },
      { value: "d", label: "Building a step-by-step checklist and analyzing the data", trait: "A" },
    ],
  },
  {
    id: "p4",
    question: "In a team group project, your natural role tends to be:",
    options: [
      { value: "a", label: "The enthusiastic presenter and team morale booster", trait: "E" },
      { value: "b", label: "The quiet specialist doing deep, focused research behind the scenes", trait: "I" },
      { value: "c", label: "The concept creator providing fresh, unconventional angles", trait: "C" },
      { value: "d", label: "The project coordinator ensuring deadlines and structure are kept", trait: "A" },
    ],
  },
  {
    id: "p5",
    question: "What kind of gifts do you love receiving the most?",
    options: [
      { value: "a", label: "Tickets to a live concert, festival, or group experience", trait: "E" },
      { value: "b", label: "A cozy luxury blanket, high-end journal, or indie novel", trait: "I" },
      { value: "c", label: "A unique handmade craft or something completely surprising", trait: "C" },
      { value: "d", label: "A high-utility, well-engineered gadget I actually needed", trait: "A" },
    ],
  },
  {
    id: "p6",
    question: "When visiting a brand-new city, your priority is:",
    options: [
      { value: "a", label: "Meeting locals and checking out the nightlife/food markets", trait: "E" },
      { value: "b", label: "Finding a secluded scenic viewpoint or quiet museum corner", trait: "I" },
      { value: "c", label: "Getting happily lost in artsy alleys without any map", trait: "C" },
      { value: "d", label: "Following an optimized itinerary covering the top must-sees", trait: "A" },
    ],
  },
  {
    id: "p7",
    question: "How do you react to sudden last-minute changes of plans?",
    options: [
      { value: "a", label: "Excited! Spontaneity usually leads to the wildest stories", trait: "E" },
      { value: "b", label: "Secretly relieved if it means I can stay home in peace", trait: "I" },
      { value: "c", label: "Curious! Let's see where the new serendipity takes us", trait: "C" },
      { value: "d", label: "Slightly annoyed until I quickly map out an alternative plan", trait: "A" },
    ],
  },
  {
    id: "p8",
    question: "What compliments make you feel most appreciated?",
    options: [
      { value: "a", label: "'You bring such incredible warmth and fun to any room!'", trait: "E" },
      { value: "b", label: "'You are such a thoughtful listener and understand deeply.'", trait: "I" },
      { value: "c", label: "'Your creative imagination is so inspiring and original!'", trait: "C" },
      { value: "d", label: "'You are remarkably dependable and make things run smoothly.'", trait: "A" },
    ],
  },
  {
    id: "p9",
    question: "Your workspace or desk setup is usually:",
    options: [
      { value: "a", label: "Surrounded by photos with friends, souvenirs, and open for chats", trait: "E" },
      { value: "b", label: "Private, minimal, with noise-canceling headphones nearby", trait: "I" },
      { value: "c", label: "An eclectic mix of art pieces, notes, and visual inspiration", trait: "C" },
      { value: "d", label: "Clean, color-coded, with everything neatly categorized", trait: "A" },
    ],
  },
  {
    id: "p10",
    question: "If you had a superpower, which one would you choose?",
    options: [
      { value: "a", label: "Charismatic charm — effortlessly inspiring everyone around", trait: "E" },
      { value: "b", label: "Telepathy — understanding unspoken truths without awkwardness", trait: "I" },
      { value: "c", label: "Reality-bending creativity — conjuring art and dreams instantly", trait: "C" },
      { value: "d", label: "Time management mastery — never missing a beat or deadline", trait: "A" },
    ],
  },
];

export interface PersonalityOutput {
  personalityCategory: string;
  archetypeTitle: string;
  traitCode: string;
  description: string;
  strengths: string[];
  positiveCharacteristics: string[];
  funPersonalitySummary: string;
  traitPercentages: {
    vibrantEnergy: number;
    innerReflection: number;
    creativeSpark: number;
    strategicFocus: number;
  };
  algorithmVersion: string;
  disclaimer: string;
}

const ARCHETYPES: Record<
  "E" | "I" | "C" | "A",
  {
    category: string;
    title: string;
    description: string;
    strengths: string[];
    characteristics: string[];
    summary: string;
  }
> = {
  E: {
    category: "The Charismatic Catalyst 🌟",
    title: "Vibrant Social Spark",
    description:
      "You are a natural beacon of social warmth and expressive magnetism. People feel energized in your presence, drawn by your infectious optimism and ability to bridge conversations.",
    strengths: [
      "Natural conversationalist and connector",
      "Brings uplifting morale to groups",
      "Thrives in dynamic, high-energy settings",
      "Quick to turn strangers into friends",
    ],
    characteristics: [
      "Warmhearted and enthusiastic",
      "Expressive body language and smiling eyes",
      "Spontaneous laugher",
      "Naturally encouraging to others",
    ],
    summary:
      "Your gift is lighting up the human tapestry around you. The world is much more vibrant with your presence!",
  },
  I: {
    category: "The Mindful Sage 🦉",
    title: "Deep Reflective Observer",
    description:
      "You possess a richly nuanced inner landscape. You absorb subtle nuances that others rush past, providing profound empathy, grounded wisdom, and steady calmness in chaotic moments.",
    strengths: [
      "Exceptional deep listening skills",
      "High emotional intelligence and empathy",
      "Laser focus and deep work capability",
      "Thoughtful, measured decision making",
    ],
    characteristics: [
      "Authentic and unpretentious",
      "Values quality bonds over superficial crowds",
      "Calm presence in high-stress situations",
      "Introspective and self-aware",
    ],
    summary:
      "Your superpower is quiet depth. You bring serenity, profound loyalty, and genuine understanding wherever you go.",
  },
  C: {
    category: "The Visionary Alchemist 🎨",
    title: "Creative Free Spirit",
    description:
      "You see the world not just as it is, but as what it could become. Your intuition and flair for originality make you an out-of-the-box innovator who finds beauty in unconventional patterns.",
    strengths: [
      "Unbounded creative imagination",
      "Flexible and adaptable to the unexpected",
      "Artistic flair and distinct aesthetic taste",
      "Ability to reframe stale ideas into fresh concepts",
    ],
    characteristics: [
      "Playful curiosity about life",
      "Unafraid to express uniqueness",
      "Drawn to sensory richness: art, music, design",
      "Loves spontaneous adventures",
    ],
    summary:
      "Your originality is a breath of fresh air. Keep exploring, dreaming, and weaving magic into everyday life!",
  },
  A: {
    category: "The Master Architect 🏛️",
    title: "Strategic Problem Solver",
    description:
      "You bring clarity out of chaos. With an innate appreciation for structure, efficiency, and dependability, you are the rock people lean on when a goal needs to be accomplished reliably.",
    strengths: [
      "Flawless planning and organizational sense",
      "Logical, objective problem-solving",
      "High reliability and consistency",
      "Transforming complex goals into actionable roadmaps",
    ],
    characteristics: [
      "Dependable and punctual",
      "Values truth, clarity, and precision",
      "Proud of well-maintained systems",
      "Calm under operational pressure",
    ],
    summary:
      "Your precision and dependable clarity make you an irreplaceable anchor. You turn visions into reality!",
  },
};

export function calculatePersonalityResult(answers: Record<string, string>): PersonalityOutput {
  const counts: Record<"E" | "I" | "C" | "A", number> = {
    E: 0,
    I: 0,
    C: 0,
    A: 0,
  };

  PERSONALITY_QUESTIONS.forEach((q) => {
    const val = answers[q.id];
    if (val) {
      const opt = q.options.find((o) => o.value === val);
      if (opt) {
        counts[opt.trait]++;
      }
    }
  });

  const totalAnswered = Math.max(1, counts.E + counts.I + counts.C + counts.A);

  const traitPercentages = {
    vibrantEnergy: Math.round((counts.E / totalAnswered) * 100),
    innerReflection: Math.round((counts.I / totalAnswered) * 100),
    creativeSpark: Math.round((counts.C / totalAnswered) * 100),
    strategicFocus: Math.round((counts.A / totalAnswered) * 100),
  };

  // Find dominant trait
  let dominantTrait: "E" | "I" | "C" | "A" = "E";
  let maxCount = -1;

  (Object.keys(counts) as Array<"E" | "I" | "C" | "A">).forEach((key) => {
    if (counts[key] > maxCount) {
      maxCount = counts[key];
      dominantTrait = key;
    }
  });

  const archetype = ARCHETYPES[dominantTrait];

  return {
    personalityCategory: archetype.category,
    archetypeTitle: archetype.title,
    traitCode: dominantTrait,
    description: archetype.description,
    strengths: archetype.strengths,
    positiveCharacteristics: archetype.characteristics,
    funPersonalitySummary: archetype.summary,
    traitPercentages,
    algorithmVersion: ALGORITHM_VERSION,
    disclaimer:
      "This personality test is designed for self-discovery and entertainment. It is not a clinical psychological evaluation.",
  };
}
