"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ToolFormWrapper } from "@/components/tools/ToolFormWrapper";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LuckyNumberPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || name.trim().length < 2) {
      setError("Please enter your name (at least 2 characters).");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/session/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolType: "LUCKY_NUMBER", payload: { name: name.trim(), dob: dob || undefined } }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Failed"); }
      const data = await res.json();
      await new Promise((resolve) => setTimeout(resolve, 750));
      router.push(`/result/${data.sessionId}`);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
      setSubmitting(false);
    }
  };

  return (
    <ToolFormWrapper
      toolType="LUCKY_NUMBER"
      toolName="Lucky Number Generator"
      toolEmoji="🍀"
      tagline="Reveal your personal cosmic number, power color & fortunate day"
      onSubmit={handleSubmit}
      submitting={submitting}
      error={error}
      submitButtonText="Generate Lucky Numbers"
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-emerald-200 text-sm font-semibold flex items-center gap-1.5">
            <span>Your Name</span>
            <span className="text-emerald-400">*</span>
          </Label>
          <Input
            id="name"
            placeholder="e.g. Vikram"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={60}
            disabled={submitting}
            autoFocus
            className="h-12 border-emerald-700/40 focus:ring-emerald-500 bg-white/5"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dob" className="text-emerald-200 text-sm font-semibold flex items-center justify-between">
            <span>Date of Birth</span>
            <span className="text-emerald-400/60 text-xs font-normal">Optional — aligns planetary day</span>
          </Label>
          <Input
            id="dob"
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            disabled={submitting}
            className="h-12 border-emerald-700/40 focus:ring-emerald-500 bg-white/5 [color-scheme:dark]"
          />
        </div>
      </div>
    </ToolFormWrapper>
  );
}
