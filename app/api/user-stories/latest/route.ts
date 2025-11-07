import { NextRequest, NextResponse } from "next/server";
import { getPool, initializeDatabase } from "@/utils/db";
import { UserStoryData } from "@/types/userStory";
import { RowDataPacket } from "mysql2";

interface UserStoryRecord extends RowDataPacket {
  role: string;
  action: string;
  benefit: string;
  background: string | null;
  acceptance_criteria: string;
  technical_info: string;
}

/**
 * GET handler - gets the latest user story data for auto-restore
 */
export async function GET(request: NextRequest) {
  try {
    await initializeDatabase();

    const sessionId = request.cookies.get("uscreator_session_id")?.value;
    if (!sessionId) {
      return NextResponse.json({ data: null });
    }

    const db = getPool();
    const [rows] = await db.execute<UserStoryRecord[]>(
      `SELECT role, action, benefit, background, acceptance_criteria, technical_info
       FROM user_stories
       WHERE session_id = ?
       ORDER BY updated_at DESC
       LIMIT 1`,
      [sessionId]
    );

    if (rows.length === 0) {
      return NextResponse.json({ data: null });
    }

    const row = rows[0];
    const data: UserStoryData = {
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
    };

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error loading latest user story:", error);
    return NextResponse.json({ data: null });
  }
}

