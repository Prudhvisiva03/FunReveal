import { NextRequest, NextResponse } from "next/server";
import { createToolResultSession } from "@/lib/session-service";
import { CreateSessionRequestSchema } from "@/lib/validations/tools";
import { getClientIp, hasClaimedFreeResult, markFreeResultClaimed } from "@/lib/ip-tracker";

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const validated = CreateSessionRequestSchema.safeParse(json);

    if (!validated.success) {
      return NextResponse.json(
        {
          error: "VALIDATION_FAILED",
          details: validated.error.issues.map((e) => ({
            path: e.path.join("."),
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }

    // 1. Extract Client Device IP and User Agent
    const clientIp = getClientIp(req.headers);
    const userAgent = req.headers.get("user-agent") || "unknown";
    const cookieHeader = req.headers.get("cookie") || "";
    const cookiePresent =
      req.cookies.get("fr_free_used")?.value === "true" ||
      cookieHeader.includes("fr_free_used=true");

    // 2. Multi-layer verification: Cloud DB + IP Address + Device Fingerprint + Cookie
    const alreadyClaimed = await hasClaimedFreeResult(clientIp, userAgent, cookiePresent);
    const isFree = !alreadyClaimed;

    // 3. Create calculation session
    const result = await createToolResultSession(
      validated.data.toolType,
      validated.data.payload,
      isFree
    );

    // 4. If this is their 1st free calculation, immediately record IP and Device in Cloud DB & memory
    if (isFree) {
      await markFreeResultClaimed(clientIp, userAgent);
    }

    const response = NextResponse.json(result, { status: 201 });

    // 5. Set persistent browser cookie
    if (isFree) {
      response.cookies.set({
        name: "fr_free_used",
        value: "true",
        path: "/",
        maxAge: 60 * 60 * 24 * 365, // 1 year
        sameSite: "lax",
      });
    }

    return response;
  } catch (err: any) {
    console.error("Session creation error:", err);
    return NextResponse.json(
      {
        error: err.message || "Failed to create result session",
      },
      { status: 500 }
    );
  }
}
