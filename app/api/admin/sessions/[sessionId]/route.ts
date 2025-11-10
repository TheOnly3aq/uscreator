import { NextRequest, NextResponse } from "next/server";
import { getPool, initializeDatabase } from "@/utils/db";

/**
 * DELETE handler - deletes a session and all associated stories (requires authentication)
 * @param {NextRequest} request - The request object
 * @param {{ params: Promise<{ sessionId: string }> }} context - Route context with params promise
 * @returns {Promise<NextResponse>} Response indicating success or error
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const isAuthenticated =
      request.cookies.get("admin_authenticated")?.value === "true";
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await initializeDatabase();
    const db = getPool();

    const { sessionId } = await params;

    await db.execute(
      `DELETE FROM user_stories WHERE session_id = ?`,
      [sessionId]
    );

    await db.execute(
      `DELETE FROM sessions WHERE session_id = ?`,
      [sessionId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting session:", error);
    return NextResponse.json(
      { error: "Failed to delete session" },
      { status: 500 }
    );
  }
}

