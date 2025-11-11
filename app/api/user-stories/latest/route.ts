import { NextRequest, NextResponse } from "next/server";
import { getPool, initializeDatabase } from "@/utils/db";
import { UserStoryData } from "@/types/userStory";
import { RowDataPacket } from "mysql2";

interface UserStoryRecord extends RowDataPacket {
  type: string;
  role: string;
  action: string;
  benefit: string;
  background: string | null;
  acceptance_criteria: string;
  technical_info: string;
}

/**
 * GET handler - gets the latest user story data for auto-restore
 * Accepts optional type query parameter to get draft for specific type
 */
export async function GET(request: NextRequest) {
  try {
    await initializeDatabase();

    const sessionId = request.cookies.get("uscreator_session_id")?.value;
    if (!sessionId) {
      return NextResponse.json({ data: null });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") as "story" | "bug" | null;

    const db = getPool();
    let query: string;
    let params: (string | undefined)[];

    if (type) {
      query = `SELECT type, role, action, benefit, background, acceptance_criteria, technical_info
               FROM user_stories
               WHERE session_id = ? AND is_draft = TRUE AND type = ?
               ORDER BY updated_at DESC
               LIMIT 1`;
      params = [sessionId, type];
    } else {
      query = `SELECT type, role, action, benefit, background, acceptance_criteria, technical_info
               FROM user_stories
               WHERE session_id = ? AND is_draft = TRUE
               ORDER BY updated_at DESC
               LIMIT 1`;
      params = [sessionId];
    }

    const [rows] = await db.execute<UserStoryRecord[]>(query, params);

    if (rows.length === 0) {
      return NextResponse.json({ data: null });
    }

    const row = rows[0];
    const data: UserStoryData = {
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
    };

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error loading latest user story:", error);
    return NextResponse.json({ data: null });
  }
}

