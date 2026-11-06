import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, Shield, Zap, Star, Lock, HelpCircle } from "lucide-react";

const TOOLS = [
  { href: "/tools/love-calculator", emoji: "💖", label: "Love Calculator", desc: "Calculate your love compatibility score" },
  { href: "/tools/friendship-calculator", emoji: "🤝", label: "Friendship Calculator", desc: "Measure your friendship bond strength" },
  { href: "/tools/future-partner", emoji: "💫", label: "Future Partner Generator", desc: "Discover a fictional future partner profile" },
  { href: "/tools/marriage-compatibility", emoji: "💍", label: "Marriage Compatibility", desc: "Fun entertainment compatibility report" },
  { href: "/tools/lucky-number", emoji: "🍀", label: "Lucky Number Generator", desc: "Find your personal lucky number" },
  { href: "/tools/best-friend-test", emoji: "🏆", label: "Best Friend Test", desc: "Quiz-based friendship scoring & analysis" },
];

const HOW_IT_WORKS = [
  { step: "01", emoji: "🎯", title: "Pick a Tool", desc: "Choose from 6 fun entertainment tools" },
  { step: "02", emoji: "✏️", title: "Enter Details", desc: "Fill in names, dates, or answer questions" },
  { step: "03", emoji: "🎁", title: "1st Free / ₹1", desc: "1st calculation 100% free, then ₹1 to unlock" },
  { step: "04", emoji: "🎉", title: "Discover & Share", desc: "Enjoy your result and share with friends!" },
];

const FAQS = [
  { q: "Are these results real or scientifically accurate?", a: "Absolutely not! All results are generated purely for entertainment using deterministic algorithms. They have no scientific basis and must not inform real-life decisions." },
  { q: "How much does it cost?", a: "Your first calculation is 100% FREE! From the second calculation onwards, it is just ₹1 (1 Rupee) to unlock your complete report." },
  { q: "Is my payment secure?", a: "Yes. All payments are processed by Razorpay, a leading Indian payment gateway. We never see or store your card details." },
  { q: "Will I see the same result for the same names?", a: "Yes! Results are deterministic — the same input names produce the same result every time, backed by SHA-256 hashing with an algorithm version." },
  { q: "Can I get a refund?", a: "Since results are digital and displayed immediately after payment, refunds are generally not issued. See our Refund Policy for full details." },
];

export default function HomePage() {
  return (
    <div className="relative overflow-x-hidden">
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center justify-center px-4 py-24">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-violet-700/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-pink-700/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-purple-900/10 rounded-full blur-3xl" />
        </div>

        <div className="relative text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-800/40 border border-purple-600/30 text-purple-300 text-sm font-medium mb-8">
            ✨ 6 Fun Entertainment Tools — 1st Result Free!
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-6 leading-tight">
            <span className="gradient-text">Discover Something</span>
            <br />
            <span className="text-white">Fun About You</span>
          </h1>

          <p className="text-lg sm:text-xl text-purple-200/70 mb-10 max-w-2xl mx-auto leading-relaxed">
            Love compatibility, friendship scores, lucky numbers, and future partner generator — 
            all generated for <strong className="text-pink-400">pure entertainment</strong>. 
            Discover your full report instantly with animated reveals!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="xl" asChild>
              <Link href="/tools">🎯 Explore All Tools <ChevronRight className="ml-1 w-5 h-5" /></Link>
            </Button>
            <Button size="xl" variant="outline" asChild>
              <Link href="/how-it-works">How It Works</Link>
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-purple-300/60">
            <span className="flex items-center gap-1.5"><Shield className="w-4 h-4 text-emerald-400" /> Razorpay Secured</span>
            <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-yellow-400" /> Instant Results</span>
            <span className="flex items-center gap-1.5"><Lock className="w-4 h-4 text-blue-400" /> Private & Safe</span>
            <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-pink-400" /> Entertainment Only</span>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-20 px-4" id="tools">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
              Choose Your <span className="gradient-text">Fun Tool</span>
            </h2>
            <p className="text-purple-300/60 max-w-xl mx-auto">
              Pick from 6 entertaining tools. 1st result free, then just ₹1 per unlock.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TOOLS.map((tool) => (
              <Link key={tool.href} href={tool.href} className="group block">
                <Card className="h-full hover:border-purple-500/40 hover:scale-[1.02] card-glow group-hover:shadow-purple-500/20">
                  <CardContent className="p-6">
                    <div className="text-4xl mb-3">{tool.emoji}</div>
                    <h3 className="text-white font-bold mb-1 text-base">{tool.label}</h3>
                    <p className="text-purple-300/60 text-sm mb-4">{tool.desc}</p>
                    <div className="flex items-center text-pink-400 text-sm font-semibold">
                      Try Now <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-white/[0.015]" id="how-it-works">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="text-purple-300/60">Simple, secure, and instant — four easy steps</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={i} className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-600/20 to-violet-700/20 border border-purple-600/30 text-4xl mb-5">
                  {step.emoji}
                </div>
                <div className="text-purple-500 text-xs font-black mb-1 tracking-widest">{step.step}</div>
                <h3 className="text-white font-bold mb-2">{step.title}</h3>
                <p className="text-purple-300/60 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
              Why Choose <span className="gradient-text">FunReveal?</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <Shield className="w-6 h-6 text-emerald-400" />, title: "Safe & Secure Payments", desc: "All transactions handled by Razorpay. Your card details never touch our servers." },
              { icon: <Zap className="w-6 h-6 text-yellow-400" />, title: "Instant Results", desc: "Calculations happen server-side instantly. Unlock in seconds with a simple ₹5 payment." },
              { icon: <Star className="w-6 h-6 text-pink-400" />, title: "Deterministic & Consistent", desc: "Same inputs always produce the same result — powered by cryptographic SHA-256 hashing." },
            ].map((item, i) => (
              <Card key={i} className="p-6 card-glow">
                <CardContent className="p-0">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-purple-700/30 flex items-center justify-center mb-4">
                    {item.icon}
                  </div>
                  <h3 className="text-white font-bold mb-2">{item.title}</h3>
                  <p className="text-purple-300/60 text-sm leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-white/[0.015]" id="faq">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
              <span className="gradient-text">Frequently Asked</span> Questions
            </h2>
          </div>
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <Card key={i} className="p-6 card-glow">
                <CardContent className="p-0">
                  <div className="flex gap-3">
                    <HelpCircle className="w-5 h-5 text-pink-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-white font-semibold mb-2 text-sm">{faq.q}</h4>
                      <p className="text-purple-300/60 text-sm leading-relaxed">{faq.a}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-600/20 via-violet-700/20 to-purple-700/20 blur-3xl" />
            <Card className="relative p-10 sm:p-14 card-glow-pink">
              <CardContent className="p-0">
                <div className="text-6xl mb-5">🎊</div>
                <h2 className="text-3xl font-black text-white mb-4">
                  Ready to <span className="gradient-text">Have Fun?</span>
                </h2>
                <p className="text-purple-300/60 mb-8 leading-relaxed">
                  Discover your personalized entertainment result in seconds. Pure fun guaranteed!
                </p>
                <Button size="xl" asChild>
                  <Link href="/tools">🎯 Start Now <ChevronRight className="ml-2 w-5 h-5" /></Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
