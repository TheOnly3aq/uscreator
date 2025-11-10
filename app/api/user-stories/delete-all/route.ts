import { NextRequest, NextResponse } from "next/server";
import { getPool, initializeDatabase } from "@/utils/db";

/**
 * DELETE handler - deletes only draft user stories for the current session (not history)
 */
export async function DELETE(request: NextRequest) {
  try {
    await initializeDatabase();

    const sessionId = request.cookies.get("uscreator_session_id")?.value;
    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID not found" },
        { status: 401 }
      );
    }

    const db = getPool();
    await db.execute(
      `DELETE FROM user_stories WHERE session_id = ? AND is_draft = TRUE`,
      [sessionId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting draft user stories:", error);
    return NextResponse.json(
      { error: "Failed to delete draft user stories" },
      { status: 500 }
    );
  }
}

