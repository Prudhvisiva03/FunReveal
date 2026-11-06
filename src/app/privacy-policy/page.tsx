import type { Metadata } from "next";
export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 prose prose-invert prose-purple max-w-none">
      <h1 className="text-4xl font-black text-white mb-2">Privacy <span className="gradient-text">Policy</span></h1>
      <p className="text-purple-300/60 text-sm mb-8">Last updated: November 2026</p>

      <div className="space-y-8 text-purple-200/70 text-sm leading-relaxed">
        <section>
          <h2 className="text-white font-bold text-xl mb-3">1. Overview</h2>
          <p>FunReveal (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is an entertainment platform. We are committed to handling your information responsibly and transparently. This policy explains what we collect, why we collect it, and how we protect it.</p>
        </section>

        <section>
          <h2 className="text-white font-bold text-xl mb-3">2. Information We Collect</h2>
          <h3 className="text-purple-200 font-semibold mb-2">2.1 Information You Provide</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Names or text inputs for calculations (not stored as raw text — only hashed)</li>
            <li>Optional dates of birth used only during calculation (not stored raw)</li>
            <li>Quiz answers for Best Friend Test and Personality Test (stored only as part of result, not separately identified)</li>
          </ul>
          <h3 className="text-purple-200 font-semibold mt-4 mb-2">2.2 Payment Information</h3>
          <p>We use Razorpay as our payment processor. We never see, receive, or store your card numbers, CVV, or banking credentials. We only receive a Razorpay Order ID and Payment ID to verify your transaction.</p>
          <h3 className="text-purple-200 font-semibold mt-4 mb-2">2.3 Technical Data</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>IP address (used for rate limiting and security logs, not marketing)</li>
            <li>Browser type and device information (for compatibility)</li>
            <li>Session cookies (for navigation only)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-white font-bold text-xl mb-3">3. How We Use Your Information</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>To generate and store your entertainment result session</li>
            <li>To verify payments via Razorpay</li>
            <li>To prevent fraud and abuse (rate limiting, security)</li>
            <li>To improve platform performance</li>
            <li>We do not sell your information to third parties</li>
            <li>We do not use your information for advertising or marketing profiling</li>
          </ul>
        </section>

        <section>
          <h2 className="text-white font-bold text-xl mb-3">4. Data Retention</h2>
          <p>Result sessions expire after 48 hours. Payment records are retained for legal and accounting compliance. Input hashes (not raw inputs) may be retained to prevent duplicate abuse. You may request deletion of your data by contacting us.</p>
        </section>

        <section>
          <h2 className="text-white font-bold text-xl mb-3">5. Cookies</h2>
          <p>We use minimal session cookies required for the platform to function. We do not use advertising or tracking cookies. You can disable cookies in your browser, but some features may not work correctly.</p>
        </section>

        <section>
          <h2 className="text-white font-bold text-xl mb-3">6. Third-Party Services</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong className="text-purple-200">Razorpay</strong>: Payment processing — governed by Razorpay&apos;s Privacy Policy</li>
            <li><strong className="text-purple-200">Vercel</strong>: Hosting — governed by Vercel&apos;s Privacy Policy</li>
          </ul>
        </section>

        <section>
          <h2 className="text-white font-bold text-xl mb-3">7. Children&apos;s Privacy</h2>
          <p>FunReveal is not directed at children under 13. We do not knowingly collect personal information from children under 13.</p>
        </section>

        <section>
          <h2 className="text-white font-bold text-xl mb-3">8. Contact</h2>
          <p>For privacy-related inquiries: <span className="text-pink-400">[YOUR_CONTACT_EMAIL — configure in settings]</span></p>
        </section>
      </div>
    </div>
  );
}
