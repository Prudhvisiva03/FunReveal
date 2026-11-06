"use client";
import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

interface CalculatingAnimationProps {
  toolEmoji: string;
  toolName: string;
}

const MESSAGES = [
  "🔮 Consulting cosmic frequency algorithms...",
  "⚡ Scanning personal wavelengths & vibe sync...",
  "💖 Computing deep compatibility pillars...",
  "✨ Cross-referencing secret pattern matrices...",
  "🎉 Result ready! Revealing report...",
];

export function CalculatingAnimation({ toolEmoji, toolName }: CalculatingAnimationProps) {
  const [progress, setProgress] = useState(25);
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        const jump = Math.floor(Math.random() * 25) + 18;
        return Math.min(prev + jump, 100);
      });
    }, 120);

    const msgInterval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 220);

    return () => {
      clearInterval(progressInterval);
      clearInterval(msgInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md text-center">
        {/* Glowing floating emoji avatar with animated rings */}
        <div className="relative inline-flex items-center justify-center mb-6">
          <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-violet-600 opacity-60 blur-xl animate-pulse" />
          <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-900/90 to-pink-900/90 border-2 border-pink-500/50 flex items-center justify-center shadow-2xl">
            <span className="text-5xl animate-bounce select-none">{toolEmoji}</span>
          </div>
          <div className="absolute -top-1 -right-1">
            <Sparkles className="w-5 h-5 text-yellow-300 animate-spin" />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-black text-white mb-2 tracking-tight">
          Calculating for <span className="gradient-text">{toolName}</span>
        </h3>

        {/* Dynamic changing message */}
        <p className="text-purple-200/90 text-sm font-medium h-6 mb-6 transition-all duration-200">
          {MESSAGES[msgIndex]}
        </p>

        {/* High-tech Glowing Progress Bar */}
        <div className="relative p-1 rounded-full bg-purple-950/80 border border-purple-700/50 mb-3 shadow-inner">
          <div
            className="h-3 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 transition-all duration-150 ease-out shadow-[0_0_15px_rgba(236,72,153,0.7)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Percentage badge */}
        <div className="flex items-center justify-between text-xs text-purple-400 font-mono px-2">
          <span>ALGORITHM V1.0</span>
          <span className="font-bold text-pink-300">{progress}%</span>
          <span>REVEALING REPORT</span>
        </div>

        <div className="mt-6 flex justify-center items-center gap-2 text-xs text-purple-300/60">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Deterministic Engine Active</span>
        </div>
      </div>
    </div>
  );
}
