import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "How It Works" };

export default function HowItWorksPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-14">
        <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">How It <span className="gradient-text">Works</span></h1>
        <p className="text-purple-300/60 max-w-xl mx-auto">FunReveal makes it simple to get your entertainment result in just 4 steps.</p>
      </div>
      <div className="space-y-6 mb-14">
        {[
          { emoji: "🎯", step: "1", title: "Choose a Fun Tool", desc: "Browse our 6 entertainment tools: Love Calculator, Friendship Calculator, Future Partner Generator, Marriage Compatibility, Lucky Number Generator, and Best Friend Test." },
          { emoji: "✏️", step: "2", title: "Enter Your Information", desc: "Fill in the required details — usually just names and optionally dates of birth. For quiz-based tools, answer the fun multiple-choice questions. All inputs are processed securely server-side." },
          { emoji: "🎁", step: "3", title: "1st Result Free / ₹1 Unlock", desc: "Your very first calculation is 100% FREE! For subsequent calculations, click 'Unlock Result' and complete a quick ₹1 payment via Razorpay / UPI. Payment is verified server-side before your report is revealed." },
          { emoji: "🎉", step: "4", title: "Discover & Share", desc: "Enjoy your complete result — scores, categories, descriptions, and fun insights! Share it with friends or try another tool for more laughs." },
        ].map((s) => (
          <Card key={s.step} className="card-glow p-6">
            <CardContent className="p-0 flex gap-5">
              <div className="text-4xl flex-shrink-0">{s.emoji}</div>
              <div>
                <div className="text-purple-500 font-black text-xs mb-1 tracking-widest">STEP {s.step}</div>
                <h3 className="text-white font-bold text-lg mb-2">{s.title}</h3>
                <p className="text-purple-300/60 text-sm leading-relaxed">{s.desc}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="text-center">
        <Button size="xl" asChild>
          <Link href="/tools">🎯 Get Started Now</Link>
        </Button>
      </div>
      <div className="mt-10 p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-center">
        <p className="text-amber-400/70 text-sm">⚠️ All tools are for entertainment only. Results are not scientifically accurate.</p>
      </div>
    </div>
  );
}
