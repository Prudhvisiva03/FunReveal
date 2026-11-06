"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ToolFormWrapper } from "@/components/tools/ToolFormWrapper";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function MarriageCompatibilityPage() {
  const router = useRouter();
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [dob1, setDob1] = useState("");
  const [dob2, setDob2] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name1.trim() || !name2.trim() || name1.trim().length < 2 || name2.trim().length < 2) {
      setError("Please enter both names (at least 2 characters each).");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/session/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolType: "MARRIAGE_COMPATIBILITY",
          payload: { name1: name1.trim(), name2: name2.trim(), dob1: dob1 || undefined, dob2: dob2 || undefined },
        }),
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
      toolType="MARRIAGE_COMPATIBILITY"
      toolName="Marriage Compatibility Calculator"
      toolEmoji="💍"
      tagline="Explore communication harmony, life synergy & domestic team balance"
      onSubmit={handleSubmit}
      submitting={submitting}
      error={error}
      submitButtonText="Calculate Marriage Compatibility"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name1" className="text-pink-200 text-sm font-semibold flex items-center gap-1.5">
              <span>First Person&apos;s Name</span>
              <span className="text-pink-400">*</span>
            </Label>
            <Input
              id="name1"
              placeholder="e.g. Arjun"
              value={name1}
              onChange={(e) => setName1(e.target.value)}
              maxLength={60}
              disabled={submitting}
              autoFocus
              className="h-12 border-pink-700/40 focus:ring-pink-500 bg-white/5"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name2" className="text-pink-200 text-sm font-semibold flex items-center gap-1.5">
              <span>Second Person&apos;s Name</span>
              <span className="text-pink-400">*</span>
            </Label>
            <Input
              id="name2"
              placeholder="e.g. Divya"
              value={name2}
              onChange={(e) => setName2(e.target.value)}
              maxLength={60}
              disabled={submitting}
              className="h-12 border-pink-700/40 focus:ring-pink-500 bg-white/5"
            />
          </div>
        </div>

        <div className="flex items-center justify-center py-1">
          <div className="w-12 h-12 rounded-full bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-2xl animate-pulse shadow-lg">
            💍
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dob1" className="text-purple-200 text-xs font-medium">
              Person 1 Date of Birth (optional)
            </Label>
            <Input
              id="dob1"
              type="date"
              value={dob1}
              onChange={(e) => setDob1(e.target.value)}
              disabled={submitting}
              className="h-12 border-purple-700/40 focus:ring-purple-500 bg-white/5 [color-scheme:dark]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dob2" className="text-purple-200 text-xs font-medium">
              Person 2 Date of Birth (optional)
            </Label>
            <Input
              id="dob2"
              type="date"
              value={dob2}
              onChange={(e) => setDob2(e.target.value)}
              disabled={submitting}
              className="h-12 border-purple-700/40 focus:ring-purple-500 bg-white/5 [color-scheme:dark]"
            />
          </div>
        </div>
      </div>
    </ToolFormWrapper>
  );
}
