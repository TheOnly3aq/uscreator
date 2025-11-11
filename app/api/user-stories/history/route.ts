import { NextRequest, NextResponse } from "next/server";
import { getPool, initializeDatabase } from "@/utils/db";
import { UserStoryData } from "@/types/userStory";
import { RowDataPacket } from "mysql2";

interface UserStoryRecord extends RowDataPacket {
  id: number;
  type: string;
  role: string;
  action: string;
  benefit: string;
  background: string | null;
  acceptance_criteria: string;
  technical_info: string;
  created_at: Date;
  updated_at: Date;
}

/**
 * GET handler - gets user story history for the current session
 */
export async function GET(request: NextRequest) {
  try {
    await initializeDatabase();

    const sessionId = request.cookies.get("uscreator_session_id")?.value;
    if (!sessionId) {
      return NextResponse.json({ history: [] });
    }

    const db = getPool();
    const [rows] = await db.execute<UserStoryRecord[]>(
      `SELECT id, type, role, action, benefit, background, acceptance_criteria, technical_info, created_at, updated_at
       FROM user_stories
       WHERE session_id = ? AND is_draft = FALSE
       ORDER BY created_at DESC
       LIMIT 10`,
      [sessionId]
    );

    const history = rows.map((row) => ({
      id: row.id,
      data: {
        type: (row.type === "bug" ? "bug" : "story") as "story" | "bug",
        role: row.role || "",
        action: row.action || "",
        benefit: row.benefit || "",
        background: row.background || "",
        acceptanceCriteria:
          typeof row.acceptance_criteria === "string"
            ? JSON.parse(row.acceptance_criteria)
            : row.acceptance_criteria || [""],
        technicalInfo:
          typeof row.technical_info === "string"
            ? JSON.parse(row.technical_info)
            : row.technical_info || [""],
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

