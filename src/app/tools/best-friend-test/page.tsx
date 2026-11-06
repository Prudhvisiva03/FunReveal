"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowRight, Sparkles, CheckCircle2, Lightbulb, Users } from "lucide-react";
import { CalculatingAnimation } from "@/components/tools/CalculatingAnimation";
import { TOOL_THEMES } from "@/lib/tool-themes";

const QUESTIONS = [
  {
    id: "q1",
    question: "What is your go-to weekend hangout style?",
    options: [
      { value: "cafe", label: "☕ Sitting at a cozy cafe gossiping for 4 hours" },
      { value: "gaming", label: "🎮 Late night gaming / binge-watching with junk food" },
      { value: "outdoor", label: "🚗 Spontaneous road trip or exploring a new market" },
      { value: "nap", label: "😴 Scrolling memes in comfortable silence together" },
    ],
  },
  {
    id: "q2",
    question: "When one of you is having a rough day, what helps most?",
    options: [
      { value: "listen", label: "🗣️ Uninterrupted rant session with immediate validation" },
      { value: "food", label: "🍕 Showing up with favorite food / sweet treats" },
      { value: "distract", label: "😂 Doing something ridiculous to make them laugh" },
      { value: "solve", label: "📋 Helping strategize an action plan to fix it" },
    ],
  },
  {
    id: "q3",
    question: "How do you handle disagreements or awkward moments?",
    options: [
      { value: "talk", label: "💬 Talk it through honestly within 10 minutes" },
      { value: "laugh", label: "😆 Send an absurd meme and act like it never happened" },
      { value: "space", label: "🌊 Take an hour to cool off, then resume normally" },
      { value: "treat", label: "🍔 Whoever is wrong buys the next meal, case closed" },
    ],
  },
  {
    id: "q4",
    question: "What is your shared superpower as a duo?",
    options: [
      { value: "look", label: "👀 Speaking fluent eye-contact across a crowded room" },
      { value: "humor", label: "🤣 Inside jokes literally nobody else understands" },
      { value: "hype", label: "📣 Being each other's #1 hype cheerleader at all times" },
      { value: "crisis", label: "🛡️ Solving emergencies together with zero panic" },
    ],
  },
  {
    id: "q5",
    question: "Who is more likely to make an impulsive late-night purchase?",
    options: [
      { value: "both", label: "🤑 Both of us egging each other on" },
      { value: "person1", label: "😬 Friend 1, with Friend 2 trying (and failing) to stop them" },
      { value: "person2", label: "😅 Friend 2, with Friend 1 adding items to cart too" },
      { value: "neither", label: "💰 Neither — we are the financial voice of reason" },
    ],
  },
  {
    id: "q6",
    question: "What is the holy grail of your friendship memories?",
    options: [
      { value: "disaster", label: "🤦 That one disaster trip where everything went wrong (but was hilarious)" },
      { value: "deep_talk", label: "🌙 3 AM terrace talks about dreams and fears" },
      { value: "celebration", label: "🎉 Celebrating a major milestone or win together" },
      { value: "daily_chaos", label: "📱 The everyday goofy banter on our messaging group" },
    ],
  },
];

export default function BestFriendTestPage() {
  const router = useRouter();
  const theme = TOOL_THEMES.BEST_FRIEND_TEST;

  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [answers1, setAnswers1] = useState<Record<string, string>>({});
  const [answers2, setAnswers2] = useState<Record<string, string>>({});
  const [step, setStep] = useState<"names" | "quiz1" | "quiz2" | "submitting">("names");
  const [error, setError] = useState("");

  const goToQuiz1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name1.trim() || !name2.trim() || name1.trim().length < 2 || name2.trim().length < 2) {
      setError("Please enter both friends' names (min 2 characters each).");
      return;
    }
    setError("");
    setStep("quiz1");
  };

  const finishQuiz1 = () => {
    if (Object.keys(answers1).length < QUESTIONS.length) {
      setError("Please answer all 6 questions before continuing.");
      return;
    }
    setError("");
    setStep("quiz2");
  };

  const submit = async () => {
    if (Object.keys(answers2).length < QUESTIONS.length) {
      setError("Please answer all 6 questions.");
      return;
    }
    setError("");
    setStep("submitting");
    try {
      const res = await fetch("/api/session/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolType: "BEST_FRIEND_TEST",
          payload: { name1: name1.trim(), name2: name2.trim(), answers1, answers2 },
        }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Failed"); }
      const data = await res.json();
      await new Promise((resolve) => setTimeout(resolve, 750));
      router.push(`/result/${data.sessionId}`);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
      setStep("quiz2");
    }
  };

  const setAnswer = (qId: string, val: string) => {
    if (step === "quiz1") setAnswers1((prev) => ({ ...prev, [qId]: val }));
    if (step === "quiz2") setAnswers2((prev) => ({ ...prev, [qId]: val }));
  };

  const currentAnswers = step === "quiz1" ? answers1 : answers2;

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden py-10 lg:py-16">
      {/* Dynamic Ambient Background Glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full blur-3xl opacity-20 bg-gradient-to-br from-amber-900/30 via-orange-900/20 to-transparent" />
        <div className="absolute top-1/3 -right-32 w-[600px] h-[600px] rounded-full blur-3xl opacity-25 bg-gradient-to-tl from-yellow-900/25 via-amber-900/10 to-transparent" />
      </div>

      {step === "submitting" && (
        <CalculatingAnimation toolEmoji="🏆" toolName="Best Friend Test" />
      )}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 lg:mb-14">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white/5 border border-white/10 shadow-2xl mb-5 backdrop-blur-md">
            <span className="text-5xl select-none">🏆</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-3">
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent">
              Best Friend Test Quiz
            </span>
          </h1>

          <p className="text-purple-200/70 text-base sm:text-lg">
            Answer the same 6 fun scenarios separately — find out your exact matching wavelength!
          </p>

          <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Interactive 2-Player Duo Quiz — Instant Reveal ✨</span>
          </div>
        </div>

        {/* 2-Column Wide Balanced Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Main Quiz Column (lg:col-span-8) */}
          <div className="lg:col-span-8">
            {/* Step Indicators */}
            <div className="flex gap-2 mb-6">
              {["names", "quiz1", "quiz2"].map((s, idx) => (
                <div
                  key={s}
                  className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                    step === s
                      ? "bg-gradient-to-r from-amber-400 to-orange-500 shadow-md shadow-amber-500/30"
                      : ["names", "quiz1", "quiz2"].indexOf(step) > idx
                      ? "bg-amber-600"
                      : "bg-purple-900/40"
                  }`}
                />
              ))}
            </div>

            <Card className="backdrop-blur-xl bg-purple-950/40 border border-amber-500/30 shadow-[0_0_40px_rgba(245,158,11,0.2)]">
              <CardContent className="p-6 sm:p-8 lg:p-10">
                {step === "names" && (
                  <form onSubmit={goToQuiz1} className="space-y-6">
                    <div>
                      <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-1">
                        <Users className="w-5 h-5 text-amber-400" />
                        Step 1: Enter Both Friends&apos; Names
                      </h2>
                      <p className="text-purple-300/60 text-xs">You&apos;ll both answer the same 6 multiple-choice questions.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="n1" className="text-amber-200 text-sm font-semibold">Friend 1 Name</Label>
                        <Input id="n1" placeholder="e.g. Ravi" value={name1} onChange={(e) => setName1(e.target.value)} maxLength={60} autoFocus className="h-12 border-amber-700/40 focus:ring-amber-500 bg-white/5" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="n2" className="text-amber-200 text-sm font-semibold">Friend 2 Name</Label>
                        <Input id="n2" placeholder="e.g. Kiran" value={name2} onChange={(e) => setName2(e.target.value)} maxLength={60} className="h-12 border-amber-700/40 focus:ring-amber-500 bg-white/5" />
                      </div>
                    </div>

                    {error && <p className="text-red-300 text-sm p-4 rounded-xl bg-red-500/10 border border-red-500/30">{error}</p>}

                    <Button type="submit" size="xl" className="w-full bg-gradient-to-r from-amber-500 via-orange-600 to-purple-600 text-white font-bold">
                      Start Quiz with {name1 || "Friend 1"} <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </form>
                )}

                {(step === "quiz1" || step === "quiz2") && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between pb-3 border-b border-purple-800/40">
                      <div>
                        <h2 className="text-xl font-bold text-white">
                          {step === "quiz1" ? `🎯 ${name1}'s Turn` : `🎯 ${name2}'s Turn`}
                        </h2>
                        <p className="text-purple-300/60 text-xs mt-0.5">Answer honestly based on your friendship!</p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        {step === "quiz1" ? "Player 1 of 2" : "Player 2 of 2"}
                      </span>
                    </div>

                    <div className="space-y-5">
                      {QUESTIONS.map((q, idx) => (
                        <div key={q.id} className="space-y-2.5 p-4 rounded-2xl bg-white/[0.02] border border-purple-800/20">
                          <p className="text-white font-semibold text-sm">
                            <span className="text-amber-400 font-bold mr-1.5">{idx + 1}.</span>
                            {q.question}
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {q.options.map((opt) => (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => setAnswer(q.id, opt.value)}
                                className={`text-left p-3 sm:p-4 rounded-xl text-xs sm:text-sm font-medium transition-all border break-words whitespace-normal leading-relaxed ${
                                  currentAnswers[q.id] === opt.value
                                    ? "bg-amber-500/20 border-amber-400 text-white shadow-md shadow-amber-500/20"
                                    : "bg-white/5 border-purple-800/40 text-purple-200/70 hover:bg-white/10 hover:border-purple-600/50"
                                }`}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {error && <p className="text-red-300 text-sm p-4 rounded-xl bg-red-500/10 border border-red-500/30">{error}</p>}

                    {step === "quiz1" && (
                      <Button size="xl" className="w-full bg-gradient-to-r from-amber-500 via-orange-600 to-purple-600 text-white font-bold" onClick={finishQuiz1}>
                        Save & Switch to {name2}&apos;s Turn <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                    )}
                    {step === "quiz2" && (
                      <Button size="xl" className="w-full bg-gradient-to-r from-amber-500 via-orange-600 to-purple-600 text-white font-bold" onClick={submit}>
                        Calculate Matching Score <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Side Panel (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="backdrop-blur-xl bg-purple-950/30 border border-purple-800/40 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <h3 className="text-white font-bold text-sm">How Quiz Matching Works</h3>
                </div>
                <div className="space-y-3.5">
                  {theme.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="text-xl flex-shrink-0 mt-0.5">{feat.icon}</span>
                      <div>
                        <h4 className="text-white font-semibold text-xs">{feat.title}</h4>
                        <p className="text-purple-300/60 text-xs mt-0.5">{feat.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-xl bg-purple-950/20 border border-purple-800/30 p-5">
              <CardContent className="p-0">
                <div className="flex items-center gap-1.5 mb-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>Friendship Fact</span>
                </div>
                <p className="text-purple-200/80 text-xs leading-relaxed">
                  &ldquo;Inside jokes form neural shortcuts between friends that speed up understanding by over 300%!&rdquo;
                </p>
              </CardContent>
            </Card>

            <div className="p-4 rounded-2xl bg-white/5 border border-purple-800/30 flex items-center justify-between text-xs text-purple-300/80">
              <span className="font-semibold text-white">5,200+ Friend pairs tested</span>
              <span className="text-emerald-400 font-mono">100% Free</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
