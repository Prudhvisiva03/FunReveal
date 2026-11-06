import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PaymentStatus, SessionStatus } from "@prisma/client";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = 20;
  const skip = (page - 1) * limit;

  const [
    totalSessions,
    paidSessions,
    pendingSessions,
    totalRevenuePaise,
    recentPayments,
    totalPayments,
    failedPayments,
  ] = await Promise.all([
    prisma.resultSession.count(),
    prisma.resultSession.count({ where: { status: SessionStatus.PAID } }),
    prisma.resultSession.count({ where: { status: SessionStatus.PENDING_PAYMENT } }),
    prisma.payment.aggregate({ where: { status: PaymentStatus.COMPLETED }, _sum: { amount: true } }),
    prisma.payment.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      skip,
      include: { resultSession: { select: { toolType: true } } },
    }),
    prisma.payment.count(),
    prisma.payment.count({ where: { status: PaymentStatus.FAILED } }),
  ]);

  return NextResponse.json({
    stats: {
      totalSessions,
      paidSessions,
      pendingSessions,
      totalRevenuePaise: totalRevenuePaise._sum.amount || 0,
      totalPayments,
      failedPayments,
    },
    payments: recentPayments.map((p) => ({
      id: p.id,
      toolType: p.resultSession.toolType,
      orderId: p.razorpayOrderId,
      paymentId: p.razorpayPaymentId,
      amount: p.amount,
      currency: p.currency,
      status: p.status,
      createdAt: p.createdAt,
      verifiedAt: p.verifiedAt,
    })),
    pagination: { page, limit, total: totalPayments, pages: Math.ceil(totalPayments / limit) },
  });
}
