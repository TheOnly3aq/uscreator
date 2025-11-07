import { NextRequest, NextResponse } from "next/server";
import { getPool, initializeDatabase } from "@/utils/db";
import { UserStoryData } from "@/types/userStory";

/**
 * POST handler - saves user story data
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

    await db.execute(
      `INSERT INTO user_stories 
       (session_id, role, action, benefit, background, acceptance_criteria, technical_info)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        sessionId,
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
    console.error("Error saving user story:", error);
    return NextResponse.json(
      { error: "Failed to save user story" },
      { status: 500 }
    );
  }
}

