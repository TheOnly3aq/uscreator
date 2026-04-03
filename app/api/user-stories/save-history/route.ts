import { NextRequest, NextResponse } from "next/server";
import { getPool, initializeDatabase } from "@/utils/db";
import { UserStoryData } from "@/types/userStory";
import { RowDataPacket } from "mysql2";
import { requireAppAuth } from "@/utils/appAuth";

export async function POST(request: NextRequest) {
  const authError = requireAppAuth(request);
  if (authError) {
    return authError;
  }

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

    if (data.storyId && data.storyId.trim()) {
      const [existingRows] = await db.execute<RowDataPacket[]>(
        `SELECT id FROM user_stories 
         WHERE session_id = ? AND story_id = ? AND is_draft = FALSE
         LIMIT 1`,
        [sessionId, data.storyId.trim()]
      );

      if (existingRows.length > 0) {
        await db.execute(
          `UPDATE user_stories 
           SET type = ?, title = ?, role = ?, action = ?, benefit = ?, background = ?, additional_info = ?, acceptance_criteria = ?, technical_info = ?, is_ai_generated = ?, updated_at = CURRENT_TIMESTAMP
           WHERE id = ?`,
          [
            data.type || "story",
            data.title || null,
            data.role || null,
            data.action || null,
            data.benefit || null,
            data.background || null,
            data.additionalInfo || null,
            JSON.stringify(data.acceptanceCriteria || []),
            JSON.stringify(data.technicalInfo || []),
            data.isAiGenerated || false,
            existingRows[0].id,
          ]
        );
        return NextResponse.json({ success: true, updated: true });
      }
    }

    const [countRows] = await db.execute<RowDataPacket[]>(
      `SELECT COUNT(*) as count FROM user_stories 
       WHERE session_id = ? AND is_draft = FALSE`,
      [sessionId]
    );

    const count = (countRows[0] as { count: number })?.count || 0;

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

    await db.execute(
      `INSERT INTO user_stories 
       (session_id, type, story_id, title, role, action, benefit, background, additional_info, acceptance_criteria, technical_info, is_draft, is_ai_generated)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, FALSE, ?)`,
      [
        sessionId,
        data.type || "story",
        data.storyId || null,
        data.title || null,
        data.role || null,
        data.action || null,
        data.benefit || null,
        data.background || null,
        data.additionalInfo || null,
        JSON.stringify(data.acceptanceCriteria || []),
        JSON.stringify(data.technicalInfo || []),
        data.isAiGenerated || false,
      ]
    );

    return NextResponse.json({ success: true, updated: false });
  } catch (error) {
    console.error("Error saving to history:", error);
    return NextResponse.json(
      { error: "Failed to save to history" },
      { status: 500 }
    );
  }
}

