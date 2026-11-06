import { ToolType } from "@prisma/client";

export interface PreviewData {
  toolType: ToolType;
  toolDisplayName: string;
  teaserText: string;
  highlightPills: string[];
  maskedScorePlaceholder?: string;
  disclaimer: string;
}

export function generatePreviewData(toolType: ToolType, inputs: Record<string, unknown>): PreviewData {
  switch (toolType) {
    case ToolType.LOVE_CALCULATOR:
      return {
        toolType,
        toolDisplayName: "Love Compatibility Calculator",
        teaserText: `A special calculation has been generated for ${inputs.name1 || "Partner 1"} & ${inputs.name2 || "Partner 2"}!`,
        highlightPills: [
          "Exact Compatibility Score (%)",
          "Cosmic Relationship Title",
          "Deep Relationship Category",
          "4 Dynamic Pillars: Passion, Humor, Communication & Trust",
        ],
        maskedScorePlaceholder: "?? %",
        disclaimer: "For entertainment purposes only.",
      };

    case ToolType.FRIENDSHIP_CALCULATOR:
      return {
        toolType,
        toolDisplayName: "Friendship Bond Calculator",
        teaserText: `Your friendship dynamics between ${inputs.name1 || "Friend 1"} & ${inputs.name2 || "Friend 2"} have been computed!`,
        highlightPills: [
          "Friendship Vibe Score",
          "Special Friendship Category",
          "Loyalty & Trust Metric",
          "Personalized Friendship Advice",
        ],
        maskedScorePlaceholder: "?? %",
        disclaimer: "For entertainment purposes only.",
      };

    case ToolType.FUTURE_PARTNER:
      return {
        toolType,
        toolDisplayName: "Fictional Future Partner Generator",
        teaserText: `A captivating fictional partner persona has been crafted for ${inputs.name || "you"}!`,
        highlightPills: [
          "Fictional Character Archetype",
          "Aesthetic Vibe & Personality Traits",
          "Curated Shared Interests & Hobbies",
          "Whimsical 'Meet-Cute' Story Scenario",
        ],
        disclaimer: "Fictional entertainment generator only.",
      };

    case ToolType.MARRIAGE_COMPATIBILITY:
      return {
        toolType,
        toolDisplayName: "Marriage Compatibility Calculator",
        teaserText: `An entertainment compatibility report is ready for ${inputs.name1 || "Partner 1"} & ${inputs.name2 || "Partner 2"}!`,
        highlightPills: [
          "Entertainment Compatibility Score",
          "Communication Dynamic Category",
          "Personality Comparison & Synergy",
          "Domestic Harmony Breakdown",
        ],
        maskedScorePlaceholder: "?? %",
        disclaimer: "Entertainment only. Not for legal or marital decisions.",
      };

    case ToolType.LUCKY_NUMBER:
      return {
        toolType,
        toolDisplayName: "Personal Lucky Number Generator",
        teaserText: `Your personalized lucky numbers and cosmic vibe report for ${inputs.name || "you"} are ready!`,
        highlightPills: [
          "Primary Lucky Number (1-9)",
          "Secondary Fortunate Numbers",
          "Personal Lucky Color & Hex Palette",
          "Cosmic Power Element & Best Day",
        ],
        maskedScorePlaceholder: "Lucky #?",
        disclaimer: "For entertainment purposes only.",
      };

    case ToolType.BEST_FRIEND_TEST:
      return {
        toolType,
        toolDisplayName: "Best Friend Quiz Test",
        teaserText: `Friendship quiz completed for ${inputs.name1 || "Friend 1"} & ${inputs.name2 || "Friend 2"}!`,
        highlightPills: [
          "Matching Quiz Percentage",
          "Friendship Duo Category",
          "Answer Harmony Analysis",
          "Humorous Takeaway & Memory Spark",
        ],
        maskedScorePlaceholder: "?? %",
        disclaimer: "For entertainment purposes only.",
      };

    case ToolType.PERSONALITY_TEST:
      return {
        toolType,
        toolDisplayName: "Personality Test",
        teaserText: "Your 10-question evaluation has been processed into a dominant psychological archetype!",
        highlightPills: [
          "Dominant Personality Archetype",
          "Core Strengths & Superpowers",
          "Positive Behavioral Traits",
          "4-Trait Percentage Distribution",
        ],
        maskedScorePlaceholder: "Archetype: ???",
        disclaimer: "For entertainment self-discovery only.",
      };

    default:
      return {
        toolType,
        toolDisplayName: "Fun Entertainment Tool",
        teaserText: "Your result has been safely calculated and is ready to unlock!",
        highlightPills: ["Full Detailed Report", "Shareable Certificate", "Entertainment Insights"],
        disclaimer: "For entertainment purposes only.",
      };
  }
}
