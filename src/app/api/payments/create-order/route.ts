import { NextRequest, NextResponse } from "next/server";
import { initiatePaymentForSession } from "@/lib/payment-service";

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json();

    if (!sessionId || typeof sessionId !== "string") {
      return NextResponse.json({ error: "Missing or invalid sessionId" }, { status: 400 });
    }

    const orderData = await initiatePaymentForSession(sessionId);

    return NextResponse.json(orderData, { status: 200 });
  } catch (err: any) {
    console.error("Create order error:", err.message);

    const isConfigError = err.message?.includes("RAZORPAY_CONFIG_REQUIRED");
    return NextResponse.json(
      {
        error: isConfigError ? "RAZORPAY_CONFIG_REQUIRED" : "ORDER_CREATION_FAILED",
        message: err.message,
      },
      { status: isConfigError ? 422 : 500 }
    );
  }
}
