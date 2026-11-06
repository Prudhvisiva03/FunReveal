import { NextRequest, NextResponse } from "next/server";
import { processRazorpayWebhook } from "@/lib/payment-service";

export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "MISSING_SIGNATURE", message: "x-razorpay-signature header is required" },
        { status: 400 }
      );
    }

    const rawBody = await req.text();
    const result = await processRazorpayWebhook(rawBody, signature);

    return NextResponse.json({ status: "ok", ...result }, { status: 200 });
  } catch (err: any) {
    console.error("Webhook processing error:", err.message);

    if (err.message === "INVALID_WEBHOOK_SIGNATURE") {
      return NextResponse.json({ error: "INVALID_SIGNATURE" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "WEBHOOK_FAILED", message: err.message },
      { status: 500 }
    );
  }
}
