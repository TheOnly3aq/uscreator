import { NextRequest, NextResponse } from "next/server";
import { getPool, initializeDatabase } from "@/utils/db";
import { UserStoryData } from "@/types/userStory";
import { RowDataPacket } from "mysql2";
import { requireAppAuth } from "@/utils/appAuth";

interface UserStoryRecord extends RowDataPacket {
  id: number;
  type: string;
  story_id: string | null;
  title: string | null;
  role: string;
  action: string;
  benefit: string;
  background: string | null;
  additional_info: string | null;
  acceptance_criteria: string;
  technical_info: string;
  is_ai_generated: boolean;
  created_at: Date;
  updated_at: Date;
}

/**
 * GET handler - gets user story history for the current session
 */
export async function GET(request: NextRequest) {
  const authError = requireAppAuth(request);
  if (authError) {
    return authError;
  }

  try {
    await initializeDatabase();

    const sessionId = request.cookies.get("uscreator_session_id")?.value;
    if (!sessionId) {
      return NextResponse.json({ history: [] });
    }

    const db = getPool();
    const [rows] = await db.execute<UserStoryRecord[]>(
      `SELECT id, type, story_id, title, role, action, benefit, background, additional_info, acceptance_criteria, technical_info, is_ai_generated, created_at, updated_at
       FROM user_stories
       WHERE session_id = ? AND is_draft = FALSE
       ORDER BY updated_at DESC
       LIMIT 10`,
      [sessionId]
    );

    const history = rows.map((row) => ({
      id: row.id,
      data: {
        type: (row.type === "bug" ? "bug" : "story") as "story" | "bug",
        storyId: row.story_id || undefined,
        title: row.title || undefined,
        role: row.role || "",
        action: row.action || "",
        benefit: row.benefit || "",
        background: row.background || "",
        additionalInfo: row.additional_info || "",
        acceptanceCriteria:
          typeof row.acceptance_criteria === "string"
            ? JSON.parse(row.acceptance_criteria)
            : row.acceptance_criteria || [""],
        technicalInfo:
          typeof row.technical_info === "string"
            ? JSON.parse(row.technical_info)
            : row.technical_info || [""],
        isAiGenerated: row.is_ai_generated || false,
      } as UserStoryData,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    return NextResponse.json({ history });
  } catch (error) {
    console.error("Error loading history:", error);
    return NextResponse.json(
      { error: "Failed to load history" },
      { status: 500 }
    );
  }
}

