import { NextRequest, NextResponse } from "next/server";
import { verifyAndUnlockPayment } from "@/lib/payment-service";
import { z } from "zod";

const VerifyPaymentSchema = z.object({
  sessionId: z.string().min(1),
  razorpayOrderId: z.string().min(1),
  razorpayPaymentId: z.string().min(1),
  razorpaySignature: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = VerifyPaymentSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "VALIDATION_FAILED", details: validated.error.issues },
        { status: 400 }
      );
    }

    const result = await verifyAndUnlockPayment(validated.data);

    return NextResponse.json(result, { status: 200 });
  } catch (err: any) {
    console.error("Payment verification error:", err.message);

    const isSecurityMismatch = err.message?.includes("PAYMENT_SESSION_MISMATCH");
    const isSignatureFailed = err.message?.includes("INVALID_PAYMENT_SIGNATURE");

    const status = isSecurityMismatch ? 403 : isSignatureFailed ? 400 : 500;

    return NextResponse.json(
      {
        error: isSignatureFailed
          ? "INVALID_PAYMENT_SIGNATURE"
          : isSecurityMismatch
          ? "PAYMENT_SESSION_MISMATCH"
          : "VERIFICATION_FAILED",
        message: err.message,
      },
      { status }
    );
  }
}
