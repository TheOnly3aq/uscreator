import { NextRequest, NextResponse } from "next/server";
import { getPool, initializeDatabase } from "@/utils/db";
import { UserStoryData } from "@/types/userStory";
import { RowDataPacket } from "mysql2";

/**
 * POST handler - saves user story to history (when Copy is clicked)
 * Limits to 10 history items per user, deletes oldest if exceeded
 */
export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();

    const sessionId = request.cookies.get("uscreator_session_id")?.value;
    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID not found" },
        { status: 401 }
      );
    }

    const data: UserStoryData = await request.json();
    const db = getPool();

    // Count existing history items
    const [countRows] = await db.execute<RowDataPacket[]>(
      `SELECT COUNT(*) as count FROM user_stories 
       WHERE session_id = ? AND is_draft = FALSE`,
      [sessionId]
    );

    const count = (countRows[0] as { count: number })?.count || 0;

    // If we have 10 or more, delete the oldest ones
    if (count >= 10) {
      const deleteCount = count - 9;
      await db.execute(
        `DELETE FROM user_stories 
         WHERE id IN (
           SELECT id FROM (
             SELECT id FROM user_stories
             WHERE session_id = ? AND is_draft = FALSE
             ORDER BY created_at ASC
             LIMIT ?
           ) AS temp
         )`,
        [sessionId, deleteCount]
      );
    }

    // Insert new history entry
    await db.execute(
      `INSERT INTO user_stories 
       (session_id, type, role, action, benefit, background, acceptance_criteria, technical_info, is_draft)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, FALSE)`,
      [
        sessionId,
        data.type || "story",
        data.role || null,
        data.action || null,
        data.benefit || null,
        data.background || null,
        JSON.stringify(data.acceptanceCriteria || []),
        JSON.stringify(data.technicalInfo || []),
      ]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving to history:", error);
    return NextResponse.json(
      { error: "Failed to save to history" },
      { status: 500 }
    );
  }
}

