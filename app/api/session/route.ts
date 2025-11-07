import { NextRequest, NextResponse } from "next/server";
import { initializeDatabase } from "@/utils/db";
import { randomBytes } from "crypto";

/**
 * GET handler - gets or creates a session ID
 */
export async function GET(request: NextRequest) {
  try {
    await initializeDatabase();

    const sessionIdCookie = request.cookies.get("uscreator_session_id");
    if (sessionIdCookie?.value) {
      return NextResponse.json({ sessionId: sessionIdCookie.value });
    }

    const sessionId = randomBytes(32).toString("hex");

    const response = NextResponse.json({ sessionId });
    response.cookies.set("uscreator_session_id", sessionId, {
      maxAge: 365 * 24 * 60 * 60, // 1 year
      httpOnly: true,
      sameSite: "strict",
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error in session route:", error);
    return NextResponse.json(
      { error: "Failed to get session" },
      { status: 500 }
    );
  }
}

