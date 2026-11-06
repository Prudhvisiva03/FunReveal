import { ALGORITHM_VERSION } from "./utils";

export interface QuizQuestion {
  id: string;
  question: string;
  options: {
    value: string;
    label: string;
  }[];
}

export const BEST_FRIEND_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    question: "What is your go-to weekend hangout style?",
    options: [
      { value: "cafe", label: "Sitting at a cozy cafe gossiping for 4 hours straight" },
      { value: "gaming", label: "Late night gaming / binge-watching shows with junk food" },
      { value: "outdoor", label: "Spontaneous road trip or exploring a new market" },
      { value: "nap", label: "Existing in the same room scrolling memes in comfortable silence" },
    ],
  },
  {
    id: "q2",
    question: "When one of you is having a rough day, what helps most?",
    options: [
      { value: "listen", label: "Uninterrupted rant session with immediate validation" },
      { value: "food", label: "Showing up with favorite food / sweet treats" },
      { value: "distract", label: "Dragging them out to do something totally ridiculous to laugh" },
      { value: "solve", label: "Helping them strategize an action plan to fix it" },
    ],
  },
  {
    id: "q3",
    question: "How do you handle disagreements or awkward moments?",
    options: [
      { value: "talk", label: "Talk it through within 10 minutes honestly" },
      { value: "laugh", label: "Send an absurd meme and act like it never happened" },
      { value: "space", label: "Take an hour to cool off, then resume like normal" },
      { value: "treat", label: "Whoever is wrong buys the next meal, case closed" },
    ],
  },
  {
    id: "q4",
    question: "What is your shared superpower as a friendship duo?",
    options: [
      { value: "look", label: "Speaking fluent eye-contact across a crowded room" },
      { value: "humor", label: "Inside jokes that literally nobody else understands" },
      { value: "hype", label: "Being each other's #1 hype cheerleader at all times" },
      { value: "crisis", label: "Solving emergencies together with zero panic" },
    ],
  },
  {
    id: "q5",
    question: "Who is more likely to make an impulsive late-night purchase?",
    options: [
      { value: "both", label: "Both of us egging each other on" },
      { value: "person1", label: "Friend 1, with Friend 2 trying and failing to stop them" },
      { value: "person2", label: "Friend 2, with Friend 1 adding items to the cart too" },
      { value: "neither", label: "Neither — we are the financial voice of reason" },
    ],
  },
  {
    id: "q6",
    question: "What is the holy grail of your friendship memories?",
    options: [
      { value: "disaster", label: "That one disaster trip where everything went wrong but was hilarious" },
      { value: "deep_talk", label: "3 AM terrace talks about our wildest dreams and fears" },
      { value: "celebration", label: "Celebrating a major milestone or win together" },
      { value: "daily_chaos", label: "The everyday goofy banter on our messaging group" },
    ],
  },
];

export interface BestFriendQuizOutput {
  score: number;
  matchingCount: number;
  totalQuestions: number;
  friendshipCategory: string;
  resultExplanation: string;
  humorousTakeaway: string;
  algorithmVersion: string;
  disclaimer: string;
}

export function calculateBestFriendQuiz(
  name1: string,
  name2: string,
  answersUser1: Record<string, string>,
  answersUser2: Record<string, string>
): BestFriendQuizOutput {
  const totalQuestions = BEST_FRIEND_QUESTIONS.length;
  let matchingCount = 0;

  BEST_FRIEND_QUESTIONS.forEach((q) => {
    const a1 = answersUser1[q.id];
    const a2 = answersUser2[q.id];
    if (a1 && a2 && a1 === a2) {
      matchingCount++;
    }
  });

  // Calculate percentage: base percentage from matching + 35% base foundation (true friends don't need identical answers to be awesome)
  const matchRatio = matchingCount / totalQuestions;
  const rawScore = Math.round(35 + matchRatio * 65);
  const score = Math.min(100, Math.max(40, rawScore));

  let friendshipCategory = "Good Companions";
  let resultExplanation = "";

  if (score >= 90) {
    friendshipCategory = "Telepathic Soul-Siblings 🏆";
    resultExplanation = `${name1} and ${name2} think with an almost spooky level of symmetry! You answered ${matchingCount} of ${totalQuestions} questions identically. Your shared wavelength is top-tier.`;
  } else if (score >= 75) {
    friendshipCategory = "Gold-Standard Dynamic Duo ⭐";
    resultExplanation = `With ${matchingCount} exact matches, ${name1} and ${name2} have an incredible rhythm. You complement each other's styles with plenty of mutual laughter.`;
  } else if (score >= 60) {
    friendshipCategory = "Balanced Opposites Who Click 💫";
    resultExplanation = `You had ${matchingCount} matching answers. While your approaches vary, the contrast creates a hilarious and well-rounded friendship dynamic!`;
  } else {
    friendshipCategory = "Unique Bond of Different Worlds 🌟";
    resultExplanation = `You answered ${matchingCount} questions identically, proving that great friends don't need to mirror each other. Your differences keep things interesting!`;
  }

  const humorousTakeaway = `Remember: the true sign of friendship isn't a 100% quiz score — it's who picks up the phone when someone sends a voice note at 2 AM.`;

  return {
    score,
    matchingCount,
    totalQuestions,
    friendshipCategory,
    resultExplanation,
    humorousTakeaway,
    algorithmVersion: ALGORITHM_VERSION,
    disclaimer:
      "This test is an entertainment quiz. Friendship strength is shown through real-life empathy, trust, and shared good times.",
  };
}
