import type { Metadata } from "next";
export const metadata: Metadata = { title: "Contact Us" };

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-white mb-3">Contact <span className="gradient-text">Us</span></h1>
        <p className="text-purple-300/60">Have a question or need support? Reach out to us.</p>
      </div>
      <div className="space-y-6 text-purple-200/70 text-sm">
        <div className="p-6 rounded-2xl glass-panel border border-purple-800/30">
          <h2 className="text-white font-bold mb-4">📧 Email Support</h2>
          <p className="text-pink-400">[YOUR_SUPPORT_EMAIL — configure in Admin Settings]</p>
          <p className="text-purple-300/50 mt-2 text-xs">We respond within 2–3 business days.</p>
        </div>
        <div className="p-6 rounded-2xl glass-panel border border-purple-800/30">
          <h2 className="text-white font-bold mb-4">🏢 Business Address</h2>
          <p>[YOUR_BUSINESS_ADDRESS — configure in Admin Settings]</p>
          <p className="text-purple-300/50 mt-2 text-xs">This is not a walk-in location.</p>
        </div>
        <div className="p-6 rounded-2xl glass-panel border border-purple-800/30">
          <h2 className="text-white font-bold mb-4">⚡ Common Issues</h2>
          <ul className="space-y-2">
            <li>• <strong className="text-purple-200">Payment not processed:</strong> Include your Razorpay Order ID</li>
            <li>• <strong className="text-purple-200">Result not unlocking:</strong> Include your Result Session ID from the URL</li>
            <li>• <strong className="text-purple-200">Double charge:</strong> Send both Razorpay Payment IDs</li>
            <li>• <strong className="text-purple-200">Other queries:</strong> Describe your issue in detail</li>
          </ul>
        </div>
        <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-center">
          <p className="text-amber-400/70 text-xs">⚠️ FunReveal provides entertainment services only. We cannot provide relationship advice or validate entertainment results.</p>
        </div>
      </div>
    </div>
  );
}
