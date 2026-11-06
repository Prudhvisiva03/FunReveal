import Razorpay from "razorpay";
import crypto from "crypto";

export interface RazorpayConfig {
  keyId: string;
  keySecret: string;
  webhookSecret: string;
  isConfigured: boolean;
}

export function getRazorpayConfig(): RazorpayConfig {
  const keyId = process.env.RAZORPAY_KEY_ID || "";
  const keySecret = process.env.RAZORPAY_KEY_SECRET || "";
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || "";

  // Check if real or placeholder
  const isConfigured = Boolean(
    keyId &&
    keySecret &&
    !keyId.includes("placeholder") &&
    !keySecret.includes("placeholder") &&
    keyId.startsWith("rzp_")
  );

  return {
    keyId,
    keySecret,
    webhookSecret,
    isConfigured,
  };
}

let razorpayInstance: Razorpay | null = null;

export function getRazorpayClient(): Razorpay | null {
  const config = getRazorpayConfig();
  if (!config.isConfigured) {
    return null;
  }

  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: config.keyId,
      key_secret: config.keySecret,
    });
  }

  return razorpayInstance;
}

/**
 * Creates an order via Razorpay API
 */
export async function createRazorpayOrder({
  amountPaise,
  receipt,
  notes,
}: {
  amountPaise: number;
  receipt: string;
  notes?: Record<string, string>;
}): Promise<{ orderId: string; currency: string; amount: number }> {
  const client = getRazorpayClient();
  if (!client) {
    throw new Error(
      "RAZORPAY_NOT_CONFIGURED: Please configure valid RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your environment."
    );
  }

  const order = await client.orders.create({
    amount: amountPaise,
    currency: "INR",
    receipt,
    notes: notes || {},
  });

  return {
    orderId: order.id,
    currency: order.currency,
    amount: typeof order.amount === "number" ? order.amount : Number(order.amount),
  };
}

/**
 * Verifies Razorpay Checkout Payment Signature
 * Formula: HMAC_SHA256(order_id + "|" + razorpay_payment_id, secret) === razorpay_signature
 */
export function verifyRazorpayPaymentSignature({
  orderId,
  paymentId,
  signature,
}: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  const config = getRazorpayConfig();
  if (!config.keySecret) {
    return false;
  }

  const body = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac("sha256", config.keySecret)
    .update(body)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature, "utf-8"),
    Buffer.from(signature, "utf-8")
  );
}

/**
 * Verifies Razorpay Webhook Signature
 * Formula: HMAC_SHA256(rawBody, webhookSecret) === razorpaySignatureHeader
 */
export function verifyRazorpayWebhookSignature({
  rawBody,
  signature,
}: {
  rawBody: string;
  signature: string;
}): boolean {
  const config = getRazorpayConfig();
  if (!config.webhookSecret) {
    return false;
  }

  const expectedSignature = crypto
    .createHmac("sha256", config.webhookSecret)
    .update(rawBody)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature, "utf-8"),
    Buffer.from(signature, "utf-8")
  );
}
