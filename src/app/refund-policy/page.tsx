import type { Metadata } from "next";
export const metadata: Metadata = { title: "Refund Policy" };

export default function RefundPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-purple-200/70 text-sm leading-relaxed">
      <h1 className="text-4xl font-black text-white mb-2">Refund <span className="gradient-text">Policy</span></h1>
      <p className="text-purple-300/60 text-sm mb-8">Last updated: November 2026</p>
      <div className="space-y-8">
        <section>
          <h2 className="text-white font-bold text-xl mb-3">General Policy</h2>
          <p>FunReveal offers digital entertainment services. The result you unlock is generated and displayed immediately upon successful payment verification. Due to the instantaneous and digital nature of this service, <strong className="text-purple-200">refunds are generally not available once a result has been successfully unlocked.</strong></p>
        </section>
        <section>
          <h2 className="text-white font-bold text-xl mb-3">When We May Issue a Refund</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong className="text-purple-200">Double charge:</strong> If you were charged twice for the same result session, we will refund the duplicate charge upon verification.</li>
            <li><strong className="text-purple-200">Technical failure:</strong> If your payment was deducted but the result was not unlocked due to a confirmed server error on our side, we will either unlock your result or issue a refund.</li>
            <li><strong className="text-purple-200">Legal requirement:</strong> Where required by applicable Indian consumer protection law.</li>
          </ul>
        </section>
        <section>
          <h2 className="text-white font-bold text-xl mb-3">How to Request a Refund</h2>
          <p>Contact us at <span className="text-pink-400">[YOUR_CONTACT_EMAIL]</span> with:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Your Razorpay Payment ID or Order ID</li>
            <li>The date of the transaction</li>
            <li>Reason for the refund request</li>
          </ul>
          <p className="mt-3">We will respond within 5 business days. Valid refunds will be processed within 7-10 business days to your original payment method.</p>
        </section>
        <section>
          <h2 className="text-white font-bold text-xl mb-3">No Refund Situations</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Dissatisfaction with the entertainment result content (all results are for amusement only)</li>
            <li>Disagreement with or disbelief in the generated result</li>
            <li>Accidental purchases where the result was successfully delivered</li>
            <li>Change of mind after the result is unlocked</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
