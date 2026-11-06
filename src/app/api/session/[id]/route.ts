import { NextRequest, NextResponse } from "next/server";
import { getSessionById } from "@/lib/session-service";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Invalid session ID" }, { status: 400 });
    }

    const session = await getSessionById(id);

    if (!session) {
      return NextResponse.json(
        { error: "SESSION_NOT_FOUND", message: "Session not found or expired" },
        { status: 404 }
      );
    }

    return NextResponse.json(session);
  } catch (err: any) {
    console.error("Get session error:", err);
    return NextResponse.json(
      { error: "SERVER_ERROR", message: err.message },
      { status: 500 }
    );
  }
}
