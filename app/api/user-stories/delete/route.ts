import { NextRequest, NextResponse } from "next/server";
import { getPool, initializeDatabase } from "@/utils/db";

/**
 * DELETE handler - deletes a specific user story by ID
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

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID is required" },
        { status: 400 }
      );
    }

    const db = getPool();

    // Delete only if it belongs to the current session
    const [result] = await db.execute(
      `DELETE FROM user_stories 
       WHERE id = ? AND session_id = ?`,
      [id, sessionId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting user story:", error);
    return NextResponse.json(
      { error: "Failed to delete user story" },
      { status: 500 }
    );
  }
}

