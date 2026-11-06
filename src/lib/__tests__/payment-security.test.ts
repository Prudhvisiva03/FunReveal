import {
  verifyRazorpayPaymentSignature,
  verifyRazorpayWebhookSignature,
} from "@/lib/razorpay";
import crypto from "crypto";

describe("Payment & Webhook Signature Verification", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = {
      ...originalEnv,
      RAZORPAY_KEY_ID: "rzp_test_1234567890abcdef",
      RAZORPAY_KEY_SECRET: "test_secret_key_12345",
      RAZORPAY_WEBHOOK_SECRET: "test_webhook_secret_67890",
    };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  test("valid payment signature passes verification", () => {
    const orderId = "order_N1234567890";
    const paymentId = "pay_P9876543210";
    const secret = "test_secret_key_12345";

    const body = `${orderId}|${paymentId}`;
    const signature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    const isValid = verifyRazorpayPaymentSignature({
      orderId,
      paymentId,
      signature,
    });

    expect(isValid).toBe(true);
  });

  test("tampered orderId rejects signature", () => {
    const orderId = "order_N1234567890";
    const paymentId = "pay_P9876543210";
    const secret = "test_secret_key_12345";

    const body = `${orderId}|${paymentId}`;
    const signature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    const isValid = verifyRazorpayPaymentSignature({
      orderId: "order_TAMPERED",
      paymentId,
      signature,
    });

    expect(isValid).toBe(false);
  });

  test("tampered paymentId rejects signature", () => {
    const orderId = "order_N1234567890";
    const paymentId = "pay_P9876543210";
    const secret = "test_secret_key_12345";

    const body = `${orderId}|${paymentId}`;
    const signature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    const isValid = verifyRazorpayPaymentSignature({
      orderId,
      paymentId: "pay_TAMPERED",
      signature,
    });

    expect(isValid).toBe(false);
  });

  test("invalid or fake signature string rejects", () => {
    const isValid = verifyRazorpayPaymentSignature({
      orderId: "order_N1234567890",
      paymentId: "pay_P9876543210",
      signature: "0000000000000000000000000000000000000000000000000000000000000000",
    });

    expect(isValid).toBe(false);
  });

  test("valid webhook signature passes verification", () => {
    const webhookSecret = "test_webhook_secret_67890";
    const rawPayload = JSON.stringify({
      event: "payment.captured",
      payload: { payment: { entity: { id: "pay_123", amount: 500 } } },
    });

    const signature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawPayload)
      .digest("hex");

    const isValid = verifyRazorpayWebhookSignature({
      rawBody: rawPayload,
      signature,
    });

    expect(isValid).toBe(true);
  });

  test("tampered webhook raw payload rejects signature", () => {
    const webhookSecret = "test_webhook_secret_67890";
    const rawPayload = JSON.stringify({ event: "payment.captured", amount: 500 });
    const tamperedPayload = JSON.stringify({ event: "payment.captured", amount: 1000 });

    const signature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawPayload)
      .digest("hex");

    const isValid = verifyRazorpayWebhookSignature({
      rawBody: tamperedPayload,
      signature,
    });

    expect(isValid).toBe(false);
  });
});
