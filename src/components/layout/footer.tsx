import Link from "next/link";
import { Sparkles } from "lucide-react";

const TOOL_LINKS = [
  { href: "/tools/love-calculator", label: "💖 Love Calculator" },
  { href: "/tools/friendship-calculator", label: "🤝 Friendship Calculator" },
  { href: "/tools/future-partner", label: "💫 Future Partner Generator" },
  { href: "/tools/marriage-compatibility", label: "💍 Marriage Compatibility" },
  { href: "/tools/lucky-number", label: "🍀 Lucky Number Generator" },
  { href: "/tools/best-friend-test", label: "🏆 Best Friend Test" },
];

const LEGAL_LINKS = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-and-conditions", label: "Terms & Conditions" },
  { href: "/refund-policy", label: "Refund Policy" },
  { href: "/disclaimer", label: "Entertainment Disclaimer" },
  { href: "/contact", label: "Contact Us" },
];

export function Footer() {
  return (
    <footer className="border-t border-purple-900/50 bg-black/30 backdrop-blur-sm mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-500 to-violet-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-extrabold gradient-text">FunReveal</span>
            </Link>
            <p className="text-purple-300/60 text-sm leading-relaxed max-w-sm">
              FunReveal is a playful entertainment platform. All results are algorithmically generated for fun and do not represent scientific predictions of love, personality, luck, or relationships.
            </p>
            <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <p className="text-amber-400/80 text-xs leading-relaxed">
                ⚠️ <strong>Entertainment Only:</strong> Do not use results for real-life decisions.
              </p>
            </div>
          </div>

          {/* Tools */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest">Our Tools</h3>
            <ul className="space-y-2">
              {TOOL_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-purple-300/60 hover:text-purple-200 text-sm transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest">Legal & Help</h3>
            <ul className="space-y-2">
              {LEGAL_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-purple-300/60 hover:text-purple-200 text-sm transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-purple-900/40 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-purple-400/40 text-xs">
            © {new Date().getFullYear()} FunReveal. All rights reserved. For entertainment purposes only.
          </p>
          <p className="text-purple-400/40 text-xs">
            Payments secured by Razorpay. We never store sensitive payment data.
          </p>
        </div>
      </div>
    </footer>
  );
}
