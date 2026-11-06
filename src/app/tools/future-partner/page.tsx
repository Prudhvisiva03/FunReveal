"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ToolFormWrapper } from "@/components/tools/ToolFormWrapper";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function FuturePartnerPage() {
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
        body: JSON.stringify({ toolType: "FUTURE_PARTNER", payload: { name: name.trim(), dob: dob.trim() || undefined } }),
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
      toolType="FUTURE_PARTNER"
      toolName="Future Partner Generator"
      toolEmoji="💫"
      tagline="Dream up a whimsical, fictional soulmate profile & meet-cute story"
      onSubmit={handleSubmit}
      submitting={submitting}
      error={error}
      submitButtonText="Generate Fictional Partner"
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-indigo-200 text-sm font-semibold flex items-center gap-1.5">
            <span>Your Name</span>
            <span className="text-indigo-400">*</span>
          </Label>
          <Input
            id="name"
            placeholder="e.g. Maya"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={60}
            disabled={submitting}
            autoFocus
            className="h-12 border-indigo-700/40 focus:ring-indigo-500 bg-white/5"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dob" className="text-indigo-200 text-sm font-semibold flex items-center justify-between">
            <span>Date of Birth</span>
            <span className="text-indigo-400/60 text-xs font-normal">Optional — adds cosmic flavor</span>
          </Label>
          <Input
            id="dob"
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            disabled={submitting}
            className="h-12 border-indigo-700/40 focus:ring-indigo-500 bg-white/5 [color-scheme:dark]"
          />
        </div>
      </div>
    </ToolFormWrapper>
  );
}
