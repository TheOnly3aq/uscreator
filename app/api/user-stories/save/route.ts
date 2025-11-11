import { NextRequest, NextResponse } from "next/server";
import { getPool, initializeDatabase } from "@/utils/db";
import { UserStoryData } from "@/types/userStory";

/**
 * POST handler - saves user story data as draft (auto-save, overwrites previous draft)
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

    // Delete existing draft for this session and type
    await db.execute(
      `DELETE FROM user_stories WHERE session_id = ? AND is_draft = TRUE AND type = ?`,
      [sessionId, data.type || "story"]
    );

    // Insert new draft
    await db.execute(
      `INSERT INTO user_stories 
       (session_id, type, role, action, benefit, background, additional_info, acceptance_criteria, technical_info, is_draft)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, TRUE)`,
      [
        sessionId,
        data.type || "story",
        data.role || null,
        data.action || null,
        data.benefit || null,
        data.background || null,
        data.additionalInfo || null,
        JSON.stringify(data.acceptanceCriteria || []),
        JSON.stringify(data.technicalInfo || []),
      ]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving user story:", error);
    return NextResponse.json(
      { error: "Failed to save user story" },
      { status: 500 }
    );
  }
}

