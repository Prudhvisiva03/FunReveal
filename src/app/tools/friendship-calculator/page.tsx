"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ToolFormWrapper } from "@/components/tools/ToolFormWrapper";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function FriendshipCalculatorPage() {
  const router = useRouter();
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name1.trim() || !name2.trim() || name1.trim().length < 2 || name2.trim().length < 2) {
      setError("Please enter both friends' names (at least 2 characters each).");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/session/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolType: "FRIENDSHIP_CALCULATOR", payload: { name1: name1.trim(), name2: name2.trim() } }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Failed to create session");
      }
      const data = await res.json();
      await new Promise((resolve) => setTimeout(resolve, 750));
      router.push(`/result/${data.sessionId}`);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <ToolFormWrapper
      toolType="FRIENDSHIP_CALCULATOR"
      toolName="Friendship Bond Calculator"
      toolEmoji="🤝"
      tagline="Calculate loyalty, laughter quotient & ride-or-die wavelength"
      onSubmit={handleSubmit}
      submitting={submitting}
      error={error}
      submitButtonText="Calculate Friendship Bond"
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name1" className="text-purple-200 text-sm font-semibold flex items-center gap-1.5">
            <span>First Friend&apos;s Name</span>
            <span className="text-purple-400">*</span>
          </Label>
          <Input
            id="name1"
            placeholder="e.g. Anjali"
            value={name1}
            onChange={(e) => setName1(e.target.value)}
            maxLength={60}
            disabled={submitting}
            autoFocus
            className="h-12 border-purple-700/40 focus:ring-purple-500 bg-white/5"
          />
        </div>

        <div className="flex items-center justify-center py-1">
          <div className="w-12 h-12 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-2xl animate-pulse shadow-lg">
            🤜🤛
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name2" className="text-purple-200 text-sm font-semibold flex items-center gap-1.5">
            <span>Second Friend&apos;s Name</span>
            <span className="text-purple-400">*</span>
          </Label>
          <Input
            id="name2"
            placeholder="e.g. Meera"
            value={name2}
            onChange={(e) => setName2(e.target.value)}
            maxLength={60}
            disabled={submitting}
            className="h-12 border-purple-700/40 focus:ring-purple-500 bg-white/5"
          />
        </div>
      </div>
    </ToolFormWrapper>
  );
}
