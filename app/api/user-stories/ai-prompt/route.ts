import { NextRequest, NextResponse } from "next/server";
import { getPool, initializeDatabase } from "@/utils/db";
import { RowDataPacket } from "mysql2";

/**
 * GET handler - retrieves the AI prompt from the session
 */
export async function GET(request: NextRequest) {
  try {
    await initializeDatabase();
    const db = getPool();

    const sessionId = request.cookies.get("uscreator_session_id")?.value;
    if (!sessionId) {
      return NextResponse.json({ prompt: "" });
    }

    const [rows] = await db.execute<RowDataPacket[]>(
      `SELECT ai_prompt FROM sessions WHERE session_id = ?`,
      [sessionId]
    );

    const prompt = rows.length > 0 && rows[0].ai_prompt ? rows[0].ai_prompt : "";

    return NextResponse.json({ prompt });
  } catch (error) {
    console.error("Error retrieving AI prompt:", error);
    return NextResponse.json(
      { error: "Failed to retrieve AI prompt" },
      { status: 500 }
    );
  }
}

/**
 * POST handler - saves the AI prompt to the session
 */
export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();
    const db = getPool();

    const sessionId = request.cookies.get("uscreator_session_id")?.value;
    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID not found" },
        { status: 401 }
      );
    }

    const { prompt } = await request.json();

    await db.execute(
      `UPDATE sessions SET ai_prompt = ? WHERE session_id = ?`,
      [prompt || null, sessionId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving AI prompt:", error);
    return NextResponse.json(
      { error: "Failed to save AI prompt" },
      { status: 500 }
    );
  }
}

/**
 * DELETE handler - clears the AI prompt from the session
 */
export async function DELETE(request: NextRequest) {
  try {
    await initializeDatabase();
    const db = getPool();

    const sessionId = request.cookies.get("uscreator_session_id")?.value;
    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID not found" },
        { status: 401 }
      );
    }

    await db.execute(
      `UPDATE sessions SET ai_prompt = NULL WHERE session_id = ?`,
      [sessionId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error clearing AI prompt:", error);
    return NextResponse.json(
      { error: "Failed to clear AI prompt" },
      { status: 500 }
    );
  }
}

