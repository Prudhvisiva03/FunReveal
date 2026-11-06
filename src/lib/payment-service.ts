import { prisma, withDb } from "./db";
import { PaymentStatus, SessionStatus } from "@prisma/client";
import {
  getRazorpayConfig,
  createRazorpayOrder,
  verifyRazorpayPaymentSignature,
  verifyRazorpayWebhookSignature,
} from "./razorpay";
import { getToolPricePaise } from "./settings";
import { getSessionById, unlockSession } from "./session-service";

export async function initiatePaymentForSession(sessionId: string) {
  const session = await getSessionById(sessionId);

  if (!session) {
    throw new Error("RESULT_SESSION_NOT_FOUND: The requested session was not found.");
  }

  if (session.status === SessionStatus.PAID) {
    throw new Error("SESSION_ALREADY_PAID: This result has already been unlocked.");
  }

  if (new Date() > session.expiresAt) {
    throw new Error("SESSION_EXPIRED: This calculation session has expired. Please calculate again.");
  }

  const amountPaise = session.pricePaise || (await getToolPricePaise());
  const config = getRazorpayConfig();

  // If Razorpay keys are not configured in local environment, provide seamless test order
  if (!config.isConfigured) {
    const demoOrderId = `demo_order_${sessionId.slice(0, 12)}_${Date.now()}`;
    return {
      orderId: demoOrderId,
      amount: amountPaise,
      currency: "INR",
      keyId: "rzp_test_demo",
      isDemo: true,
      paymentId: `pay_demo_${Date.now()}`,
    };
  }

  // Create Razorpay Order via official SDK
  const receipt = `rcpt_${sessionId.slice(0, 14)}_${Date.now().toString().slice(-6)}`;
  const order = await createRazorpayOrder({
    amountPaise,
    receipt,
    notes: {
      sessionId: session.id,
      toolType: session.toolType,
    },
  });

  // Store payment in database if available
  const payment = await withDb(
    (client) =>
      client.payment.create({
        data: {
          resultSessionId: session.id,
          razorpayOrderId: order.orderId,
          amount: amountPaise,
          currency: order.currency,
          status: PaymentStatus.PENDING,
        },
      }),
    null
  );

  return {
    orderId: order.orderId,
    amount: amountPaise,
    currency: order.currency,
    keyId: config.keyId,
    paymentId: payment?.id || `pay_${Date.now()}`,
    isDemo: false,
  };
}

export async function verifyAndUnlockPayment({
  sessionId,
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
}: {
  sessionId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}) {
  const session = await getSessionById(sessionId);

  if (!session) {
    throw new Error("RESULT_SESSION_NOT_FOUND");
  }

  // Idempotency: if already paid
  if (session.status === SessionStatus.PAID) {
    return { success: true, sessionId, message: "Payment already verified" };
  }

  // Demo order bypass for local testing without active Razorpay account
  if (razorpayOrderId.startsWith("demo_order_")) {
    await unlockSession(sessionId);
    return { success: true, sessionId, isDemo: true };
  }

  // Cryptographic signature verification for real Razorpay orders
  const isValid = verifyRazorpayPaymentSignature({
    orderId: razorpayOrderId,
    paymentId: razorpayPaymentId,
    signature: razorpaySignature,
  });

  if (!isValid) {
    throw new Error("INVALID_PAYMENT_SIGNATURE: The Razorpay signature could not be verified on the server.");
  }

  // Unlock session in database & memory
  await unlockSession(sessionId);

  // Update payment record in database if DB is online
  const now = new Date();
  await withDb(
    (client) =>
      client.payment.updateMany({
        where: { razorpayOrderId },
        data: {
          status: PaymentStatus.COMPLETED,
          razorpayPaymentId,
          razorpaySignature,
          verifiedAt: now,
        },
      }),
    null
  );

  return {
    success: true,
    sessionId,
  };
}

export async function processRazorpayWebhook(rawBody: string, signature: string) {
  const config = getRazorpayConfig();
  if (!config.webhookSecret) {
    throw new Error("RAZORPAY_WEBHOOK_SECRET_NOT_CONFIGURED");
  }

  // Verify HMAC SHA-256 signature of the raw body
  const isValid = verifyRazorpayWebhookSignature({
    rawBody,
    signature,
  });

  if (!isValid) {
    throw new Error("INVALID_WEBHOOK_SIGNATURE");
  }

  const payload = JSON.parse(rawBody);
  const eventId = payload.event_id || payload.id;
  const eventType = payload.event;

  // Idempotency: Check if webhook event already recorded
  if (eventId) {
    const existing = await prisma.webhookEvent.findUnique({
      where: { razorpayEventId: eventId },
    });
    if (existing && existing.processed) {
      return { handled: true, duplicate: true, eventId };
    }
  }

  // Record incoming webhook event
  const webhookRecord = await prisma.webhookEvent.create({
    data: {
      razorpayEventId: eventId || `ev_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      eventType: eventType || "unknown",
      rawPayload: payload,
      processed: false,
    },
  });

  try {
    if (eventType === "payment.captured" || eventType === "order.paid") {
      const paymentEntity = payload.payload?.payment?.entity;
      const orderId = paymentEntity?.order_id;
      const paymentId = paymentEntity?.id;

      if (orderId) {
        const payment = await prisma.payment.findUnique({
          where: { razorpayOrderId: orderId },
        });

        if (payment && payment.status !== PaymentStatus.COMPLETED) {
          const now = new Date();
          await prisma.$transaction([
            prisma.payment.update({
              where: { id: payment.id },
              data: {
                status: PaymentStatus.COMPLETED,
                razorpayPaymentId: paymentId || payment.razorpayPaymentId,
                verifiedAt: now,
              },
            }),
            prisma.resultSession.update({
              where: { id: payment.resultSessionId },
              data: {
                status: SessionStatus.PAID,
                paidAt: now,
              },
            }),
          ]);
        }
      }
    }

    // Mark processed
    await prisma.webhookEvent.update({
      where: { id: webhookRecord.id },
      data: {
        processed: true,
        processedAt: new Date(),
      },
    });

    return { handled: true, eventId };
  } catch (err: any) {
    await prisma.webhookEvent.update({
      where: { id: webhookRecord.id },
      data: {
        processed: false,
        error: err.message,
      },
    });
    throw err;
  }
}
