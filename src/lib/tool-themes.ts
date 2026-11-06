export interface ToolThemeConfig {
  id: string;
  name: string;
  emoji: string;
  tagline: string;
  primaryColor: string;
  secondaryColor: string;
  gradientText: string;
  cardGlow: string;
  buttonGradient: string;
  ambientBg: string;
  floatingParticles: string[];
  features: { icon: string; title: string; desc: string }[];
  funFacts: string[];
  recentActivityCount: number;
}

export const TOOL_THEMES: Record<string, ToolThemeConfig> = {
  LOVE_CALCULATOR: {
    id: "LOVE_CALCULATOR",
    name: "Love Compatibility Calculator",
    emoji: "💖",
    tagline: "Unveil your cosmic chemistry, romantic harmony & love pillars",
    primaryColor: "pink-500",
    secondaryColor: "rose-600",
    gradientText: "from-pink-400 via-rose-400 to-fuchsia-400",
    cardGlow: "shadow-[0_0_40px_rgba(244,63,94,0.25)] border-pink-500/30",
    buttonGradient: "from-pink-500 via-rose-500 to-purple-600 shadow-pink-500/30",
    ambientBg: "from-pink-900/20 via-purple-900/10 to-transparent",
    floatingParticles: ["💖", "💕", "✨", "💓", "🌹", "💘"],
    features: [
      { icon: "🎯", title: "Exact Compatibility %", desc: "Deterministic formula calculated from your names." },
      { icon: "✨", title: "Cosmic Chemistry Title", desc: "Discover your unique relationship archetype title." },
      { icon: "📊", title: "4 Dynamic Pillars", desc: "Passion, Humor, Communication & Trust benchmarks." },
      { icon: "💌", title: "Personalized Advice", desc: "Whimsical entertainment insights to spark great conversations." },
    ],
    funFacts: [
      "Names sharing vowels often register higher melodic harmony in acoustic linguistics!",
      "Over 4,200 couples have calculated their compatibility on FunReveal this week.",
      "The result is 100% deterministic — test it tomorrow and you'll get the exact same score!",
    ],
    recentActivityCount: 4280,
  },

  FRIENDSHIP_CALCULATOR: {
    id: "FRIENDSHIP_CALCULATOR",
    name: "Friendship Bond Calculator",
    emoji: "🤝",
    tagline: "Calculate loyalty, laughter quotient & ride-or-die wavelength",
    primaryColor: "violet-500",
    secondaryColor: "purple-600",
    gradientText: "from-purple-400 via-violet-400 to-indigo-400",
    cardGlow: "shadow-[0_0_40px_rgba(168,85,247,0.25)] border-purple-500/30",
    buttonGradient: "from-violet-500 via-purple-600 to-indigo-600 shadow-purple-500/30",
    ambientBg: "from-purple-900/20 via-indigo-900/10 to-transparent",
    floatingParticles: ["🤝", "⭐", "🎉", "🔥", "💫", "🤜🤛"],
    features: [
      { icon: "🏆", title: "Friendship Vibe Score", desc: "Calculate your unbreakable camaraderie quotient." },
      { icon: "👑", title: "Duo Category", desc: "Are you Inseparable Partners or Telepathic Besties?" },
      { icon: "⚡", title: "4 Vibe Pillars", desc: "Loyalty, Fun Factor, Secret Keeper & Vibe Sync." },
      { icon: "🍕", title: "Inside Joke Spark", desc: "Custom friendship message ready to share on chat." },
    ],
    funFacts: [
      "Psychologists say friendships lasting over 7 years are statistically likely to last a lifetime!",
      "Shared humor is the #1 predictor of long-lasting, drama-free friendships.",
      "Calculated over 3,100 bestie bonds this month with 99% laughter rate.",
    ],
    recentActivityCount: 3190,
  },

  FUTURE_PARTNER: {
    id: "FUTURE_PARTNER",
    name: "Future Partner Generator",
    emoji: "💫",
    tagline: "Dream up a whimsical, fictional soulmate profile & meet-cute story",
    primaryColor: "indigo-500",
    secondaryColor: "blue-600",
    gradientText: "from-indigo-400 via-sky-400 to-purple-400",
    cardGlow: "shadow-[0_0_40px_rgba(99,102,241,0.25)] border-indigo-500/30",
    buttonGradient: "from-indigo-500 via-purple-600 to-pink-600 shadow-indigo-500/30",
    ambientBg: "from-indigo-900/20 via-sky-900/10 to-transparent",
    floatingParticles: ["💫", "🔮", "✨", "🌌", "🌠", "☕"],
    features: [
      { icon: "🎭", title: "Fictional Archetype", desc: "From 'Cozy Bibliophile' to 'Adventurous Innovator'." },
      { icon: "🎨", title: "Aesthetic Vibe", desc: "Vintage paperbacks, midnight drives, or cafe playlists." },
      { icon: "🎯", title: "Shared Hobbies", desc: "4 curated hobbies you'd both passionately enjoy." },
      { icon: "📖", title: "Cinematic Meet-Cute", desc: "A charming fictional story of how you crossed paths." },
    ],
    funFacts: [
      "Deterministic seeded algorithms ensure your name always maps to the same fictional muse!",
      "Designed purely for creative daydreaming, storytelling, and lighthearted fun.",
      "Over 2,400 whimsical fictional partners generated this week.",
    ],
    recentActivityCount: 2470,
  },

  MARRIAGE_COMPATIBILITY: {
    id: "MARRIAGE_COMPATIBILITY",
    name: "Marriage Compatibility Calculator",
    emoji: "💍",
    tagline: "Explore communication harmony, life synergy & domestic team balance",
    primaryColor: "pink-500",
    secondaryColor: "amber-500",
    gradientText: "from-rose-400 via-pink-400 to-amber-300",
    cardGlow: "shadow-[0_0_40px_rgba(244,63,94,0.25)] border-pink-500/30",
    buttonGradient: "from-pink-500 via-purple-600 to-amber-500 shadow-pink-500/30",
    ambientBg: "from-rose-900/20 via-amber-900/10 to-transparent",
    floatingParticles: ["💍", "✨", "🥂", "💖", "🕊️", "⭐"],
    features: [
      { icon: "💍", title: "Life Synergy Score", desc: "Playful entertainment evaluation of long-term compatibility." },
      { icon: "💬", title: "Communication Style", desc: "Insight into your mutual diplomatic dialogue dynamic." },
      { icon: "🏡", title: "Domestic Harmony", desc: "Adventure spirit, home comfort, and financial synergy metrics." },
      { icon: "🌟", title: "Partnership Blessing", desc: "Heartwarming entertainment message celebrating your bond." },
    ],
    funFacts: [
      "Complementary opposites often make the most resilient problem-solving teams!",
      "A great marriage is built on laughter, shared chai, and endless mutual grace.",
      "Celebrated over 1,850 couples on FunReveal this week.",
    ],
    recentActivityCount: 1850,
  },

  LUCKY_NUMBER: {
    id: "LUCKY_NUMBER",
    name: "Lucky Number Generator",
    emoji: "🍀",
    tagline: "Reveal your personal cosmic number, power color & fortunate day",
    primaryColor: "emerald-500",
    secondaryColor: "teal-600",
    gradientText: "from-emerald-400 via-teal-300 to-cyan-400",
    cardGlow: "shadow-[0_0_40px_rgba(16,185,129,0.25)] border-emerald-500/30",
    buttonGradient: "from-emerald-500 via-teal-600 to-cyan-600 shadow-emerald-500/30",
    ambientBg: "from-emerald-900/20 via-teal-900/10 to-transparent",
    floatingParticles: ["🍀", "🎲", "✨", "🪙", "🌿", "💎"],
    features: [
      { icon: "🍀", title: "Primary Lucky Number (1-9)", desc: "Your personal number archetypal essence." },
      { icon: "🎨", title: "Lucky Color & Hex Code", desc: "Custom color palette with aesthetic symbolism." },
      { icon: "📅", title: "Fortunate Day of Week", desc: "Discover which day resonates with your frequency." },
      { icon: "⚡", title: "Secondary Power Numbers", desc: "Two companion double-digit numbers for extra fun." },
    ],
    funFacts: [
      "Across cultures, number 7 is the most popular chosen number worldwide!",
      "Colors have measurable psychological effects on focus, mood, and creative energy.",
      "Over 3,800 lucky numbers unlocked this week by curious explorers.",
    ],
    recentActivityCount: 3820,
  },

  BEST_FRIEND_TEST: {
    id: "BEST_FRIEND_TEST",
    name: "Best Friend Test Quiz",
    emoji: "🏆",
    tagline: "Take the 6-question duo quiz & compare matching answers",
    primaryColor: "amber-500",
    secondaryColor: "orange-600",
    gradientText: "from-amber-400 via-orange-400 to-yellow-300",
    cardGlow: "shadow-[0_0_40px_rgba(245,158,11,0.25)] border-amber-500/30",
    buttonGradient: "from-amber-500 via-orange-600 to-purple-600 shadow-amber-500/30",
    ambientBg: "from-amber-900/20 via-orange-900/10 to-transparent",
    floatingParticles: ["🏆", "⭐", "🎉", "🔥", "🤝", "🍕"],
    features: [
      { icon: "📝", title: "Interactive 2-Player Quiz", desc: "Both friends answer the same 6 fun scenarios." },
      { icon: "🎯", title: "Exact Match Analysis", desc: "See which questions you answered identically." },
      { icon: "👑", title: "Duo Friendship Rank", desc: "Telepathic Soul-Siblings, Dynamic Duo, or Balanced Opposites." },
      { icon: "😂", title: "Humorous Memory Spark", desc: "Hilarious takeaways ready for your WhatsApp group chat." },
    ],
    funFacts: [
      "Friends who agree on weekend snacks have 80% higher spontaneous hangout rates!",
      "Inside jokes form neural shortcuts between friends that speed up understanding.",
      "Over 5,200 friend pairs have tested their wavelength so far.",
    ],
    recentActivityCount: 5210,
  },

  PERSONALITY_TEST: {
    id: "PERSONALITY_TEST",
    name: "Personality Test",
    emoji: "🦋",
    tagline: "Discover your dominant personality archetype & trait distribution",
    primaryColor: "cyan-500",
    secondaryColor: "violet-600",
    gradientText: "from-cyan-400 via-sky-400 to-purple-400",
    cardGlow: "shadow-[0_0_40px_rgba(6,182,212,0.25)] border-cyan-500/30",
    buttonGradient: "from-cyan-500 via-blue-600 to-purple-600 shadow-cyan-500/30",
    ambientBg: "from-cyan-900/20 via-purple-900/10 to-transparent",
    floatingParticles: ["🦋", "🦉", "🎨", "🏛️", "✨", "🧠"],
    features: [
      { icon: "🦋", title: "Dominant Archetype", desc: "Vibrant Catalyst, Mindful Sage, Creative Alchemist, or Master Architect." },
      { icon: "📊", title: "4-Trait Percentage Breakdown", desc: "Social Energy, Inner Reflection, Creative Spark & Strategic Focus." },
      { icon: "⭐", title: "Key Superpowers", desc: "4 authentic positive traits you naturally bring to any table." },
      { icon: "💡", title: "Self-Discovery Summary", desc: "Inspiring summary celebrating your unique personality tapestry." },
    ],
    funFacts: [
      "No personality is purely introverted or extraverted — we are all nuanced ambiverts!",
      "Our 10 questions evaluate spontaneous instinct over rigid academic labels.",
      "Over 6,400 personality profiles discovered and shared this month.",
    ],
    recentActivityCount: 6430,
  },
};
