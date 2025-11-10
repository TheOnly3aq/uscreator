import { NextRequest, NextResponse } from "next/server";
import { getPool, initializeDatabase } from "@/utils/db";

/**
 * DELETE handler - deletes a user story (requires authentication)
 * @param {NextRequest} request - The request object
 * @param {{ params: Promise<{ storyId: string }> }} context - Route context with params promise
 * @returns {Promise<NextResponse>} Response indicating success or error
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ storyId: string }> }
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

    const { storyId } = await params;

    await db.execute(
      `DELETE FROM user_stories WHERE id = ?`,
      [storyId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting story:", error);
    return NextResponse.json(
      { error: "Failed to delete story" },
      { status: 500 }
    );
  }
}

