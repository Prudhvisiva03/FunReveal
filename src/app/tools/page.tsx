import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Fun Tools",
  description: "Browse all 6 entertainment tools: Love Calculator, Friendship Calculator, Future Partner Generator, and more.",
};

const TOOLS = [
  {
    href: "/tools/love-calculator",
    emoji: "💖",
    label: "Love Calculator",
    desc: "Calculate the fun compatibility score between two people.",
    badge: "Popular",
    color: "from-pink-600/30 to-rose-700/20",
    border: "border-pink-700/30",
  },
  {
    href: "/tools/friendship-calculator",
    emoji: "🤝",
    label: "Friendship Calculator",
    desc: "Measure the entertainment bond strength between two friends.",
    color: "from-violet-600/30 to-purple-700/20",
    border: "border-purple-700/30",
  },
  {
    href: "/tools/future-partner",
    emoji: "💫",
    label: "Future Partner Generator",
    desc: "Generate a fictional, whimsical future partner persona for fun.",
    color: "from-indigo-600/30 to-blue-700/20",
    border: "border-indigo-700/30",
  },
  {
    href: "/tools/marriage-compatibility",
    emoji: "💍",
    label: "Marriage Compatibility",
    desc: "Fun entertainment compatibility for two names. Not for real decisions.",
    badge: "Disclaimer",
    color: "from-pink-600/30 to-fuchsia-700/20",
    border: "border-fuchsia-700/30",
  },
  {
    href: "/tools/lucky-number",
    emoji: "🍀",
    label: "Lucky Number Generator",
    desc: "Discover your personal lucky number, colour, and cosmic vibe.",
    color: "from-emerald-600/30 to-teal-700/20",
    border: "border-emerald-700/30",
  },
  {
    href: "/tools/best-friend-test",
    emoji: "🏆",
    label: "Best Friend Test",
    desc: "Take a fun quiz with your best friend and compare your answers.",
    badge: "Quiz",
    color: "from-amber-600/30 to-yellow-700/20",
    border: "border-amber-700/30",
  },
];

export default function ToolsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-14">
        <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
          All <span className="gradient-text">Fun Tools</span>
        </h1>
        <p className="text-purple-300/60 max-w-2xl mx-auto leading-relaxed">
          Choose any of our 6 entertainment tools. Enter your details and instantly discover your full 
          personalized report with dynamic pillars and breakdowns!
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {TOOLS.map((tool) => (
          <Link key={tool.href} href={tool.href} className="group block">
            <Card className={`h-full hover:scale-[1.02] transition-all duration-300 overflow-hidden ${tool.border} hover:border-opacity-70`}>
              <div className={`h-1.5 w-full bg-gradient-to-r ${tool.color}`} />
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-5xl">{tool.emoji}</div>
                  {tool.badge && (
                    <Badge variant="default" className="text-xs">
                      {tool.badge}
                    </Badge>
                  )}
                </div>
                <h2 className="text-white font-bold text-lg mb-2">{tool.label}</h2>
                <p className="text-purple-300/60 text-sm mb-5 leading-relaxed">{tool.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-emerald-400 font-bold text-xs flex items-center gap-1">
                    <span>✨</span> Free Instant Access
                  </span>
                  <span className="flex items-center text-purple-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
                    Try Now <ChevronRight className="w-4 h-4 ml-1" />
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
