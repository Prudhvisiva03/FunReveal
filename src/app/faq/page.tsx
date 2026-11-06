import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "FAQ" };

const FAQS = [
  { q: "Are FunReveal results real or scientifically accurate?", a: "No. All results are algorithmically generated for fun and entertainment only. They use deterministic SHA-256 hashing with algorithm versioning to produce consistent but entirely non-scientific results. Never use them for real decisions." },
  { q: "Why do I need to pay ₹5 per result?", a: "The ₹5 fee covers platform development and maintenance costs. Each payment unlocks one complete result. If you calculate the same inputs again, the same result is generated — but each unlock session requires its own payment." },
  { q: "Is my payment secure?", a: "Yes. FunReveal uses Razorpay, a leading Indian payment gateway with PCI-DSS compliance. We never see, store, or process your card details. Payment verification happens server-side using cryptographic HMAC-SHA256 signatures." },
  { q: "Will I see the same result every time I enter the same names?", a: "Yes! Results are deterministic. The same inputs always produce the same result, powered by versioned SHA-256 algorithms. This prevents result inflation and ensures consistency." },
  { q: "What tools are available?", a: "We currently offer 7 tools: Love Calculator, Friendship Calculator, Future Partner Generator, Marriage Compatibility Calculator, Lucky Number Generator, Best Friend Test, and Personality Test." },
  { q: "Can I get a refund?", a: "Since results are digital and displayed immediately after payment verification, refunds are generally not available. For exceptional cases, see our Refund Policy or contact support." },
  { q: "Is my personal information stored?", a: "We store minimal information. For input-based tools, we store a one-way hash of your inputs — not the raw names or dates themselves. We never log personal information in production. See our Privacy Policy for full details." },
  { q: "How long does my result session last?", a: "Result sessions are valid for 48 hours from creation. After that, they expire and you would need to calculate again." },
  { q: "What is the Best Friend Test?", a: "Both friends answer the same 6 fun multiple-choice questions separately. The app then compares answers and calculates a fun friendship score based on how many match. It's a playful activity — not a measure of real friendship quality." },
  { q: "How is the Personality Test scored?", a: "10 questions each have 4 options mapped to personality traits (Vibrant Social/Reflective Deep/Creative Spontaneous/Analytical Organized). Your most-chosen trait becomes your dominant archetype. For entertainment only." },
];

export default function FAQPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="text-center mb-14">
        <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">Frequently Asked <span className="gradient-text">Questions</span></h1>
        <p className="text-purple-300/60">Everything you need to know about FunReveal.</p>
      </div>
      <div className="space-y-4 mb-12">
        {FAQS.map((faq, i) => (
          <Card key={i} className="card-glow p-5">
            <CardContent className="p-0">
              <h3 className="text-white font-semibold text-sm mb-2">{faq.q}</h3>
              <p className="text-purple-300/60 text-sm leading-relaxed">{faq.a}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="text-center">
        <p className="text-purple-300/60 mb-4">Still have questions?</p>
        <Button variant="outline" asChild>
          <Link href="/contact">Contact Us</Link>
        </Button>
      </div>
    </div>
  );
}
