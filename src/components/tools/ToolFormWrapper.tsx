"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, ArrowRight, Sparkles, CheckCircle2, TrendingUp, Lightbulb } from "lucide-react";
import { CalculatingAnimation } from "./CalculatingAnimation";
import { TOOL_THEMES, ToolThemeConfig } from "@/lib/tool-themes";

interface ToolFormWrapperProps {
  toolType?: string;
  toolName: string;
  toolEmoji: string;
  tagline?: string;
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  submitting: boolean;
  error?: string;
  submitButtonText?: string;
}

export function ToolFormWrapper({
  toolType = "LOVE_CALCULATOR",
  toolName,
  toolEmoji,
  tagline,
  children,
  onSubmit,
  submitting,
  error,
  submitButtonText = "Calculate & Reveal Result",
}: ToolFormWrapperProps) {
  const theme: ToolThemeConfig =
    TOOL_THEMES[toolType] || TOOL_THEMES.LOVE_CALCULATOR;

  const [activeFactIndex, setActiveFactIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveFactIndex((prev) => (prev + 1) % theme.funFacts.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [theme.funFacts.length]);

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden py-10 lg:py-16">
      {/* Dynamic Ambient Background Glow Orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className={`absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full blur-3xl opacity-20 bg-gradient-to-br ${theme.ambientBg}`}
        />
        <div
          className={`absolute top-1/3 -right-32 w-[600px] h-[600px] rounded-full blur-3xl opacity-25 bg-gradient-to-tl ${theme.ambientBg}`}
        />
        <div className="absolute bottom-0 left-1/3 w-[450px] h-[450px] rounded-full blur-3xl opacity-15 bg-purple-900/30" />
      </div>

      {/* Calculating Animation Overlay */}
      {submitting && (
        <CalculatingAnimation toolEmoji={toolEmoji} toolName={toolName} />
      )}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tool Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 lg:mb-14">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white/5 border border-white/10 shadow-2xl mb-5 backdrop-blur-md group hover:scale-110 transition-transform">
            <span className="text-5xl select-none">{toolEmoji}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-3">
            <span className={`bg-gradient-to-r ${theme.gradientText} bg-clip-text text-transparent`}>
              {toolName}
            </span>
          </h1>

          <p className="text-purple-200/70 text-base sm:text-lg leading-relaxed">
            {tagline || theme.tagline}
          </p>

          <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold backdrop-blur-sm shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>First Result 100% FREE ✨ (Next results just ₹1)</span>
          </div>
        </div>

        {/* 2-Column Responsive Balanced Layout (Left Form, Right Discovery Panel) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column: Interactive Form Card */}
          <div className="lg:col-span-7">
            <Card className={`backdrop-blur-xl bg-purple-950/40 border transition-all duration-300 ${theme.cardGlow}`}>
              <CardContent className="p-6 sm:p-8 lg:p-10">
                <form onSubmit={onSubmit} noValidate className="space-y-6">
                  {children}

                  {error && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 animate-in fade-in">
                      <p className="text-red-300 text-sm font-medium">{error}</p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    size="xl"
                    className={`w-full text-base font-bold text-white shadow-xl bg-gradient-to-r ${theme.buttonGradient} hover:opacity-95 transition-all`}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Calculating...
                      </>
                    ) : (
                      <>
                        {submitButtonText}
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: What You'll Discover & Fun Facts */}
          <div className="lg:col-span-5 space-y-6">
            {/* What You'll Discover Card */}
            <Card className="backdrop-blur-xl bg-purple-950/30 border border-purple-800/40 shadow-xl">
              <CardContent className="p-6 sm:p-7">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 rounded-xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-300">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h3 className="text-white font-bold text-base">What You&apos;ll Discover</h3>
                </div>

                <div className="space-y-4">
                  {theme.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-3.5 group">
                      <span className="text-2xl flex-shrink-0 mt-0.5 select-none">{feat.icon}</span>
                      <div>
                        <h4 className="text-white font-semibold text-sm leading-snug group-hover:text-pink-300 transition-colors">
                          {feat.title}
                        </h4>
                        <p className="text-purple-300/60 text-xs mt-0.5 leading-relaxed">
                          {feat.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Cycling Fun Fact Card */}
            <Card className="backdrop-blur-xl bg-purple-950/20 border border-purple-800/30 p-5">
              <CardContent className="p-0">
                <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-purple-400 uppercase tracking-wider">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  <span>Fun Fact</span>
                </div>
                <p className="text-purple-200/80 text-sm leading-relaxed transition-opacity duration-300">
                  &ldquo;{theme.funFacts[activeFactIndex]}&rdquo;
                </p>
              </CardContent>
            </Card>

            {/* Social Proof & Activity Metric */}
            <div className="p-4 rounded-2xl bg-white/5 border border-purple-800/30 flex items-center justify-between text-xs text-purple-300/80 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="font-semibold text-white">
                  {theme.recentActivityCount.toLocaleString()}+ calculations
                </span>
              </div>
              <div className="flex items-center gap-1 text-purple-400/60 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Deterministic SHA-256</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
