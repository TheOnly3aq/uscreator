import { NextRequest, NextResponse } from "next/server";
import { getPool, initializeDatabase } from "@/utils/db";
import { RowDataPacket } from "mysql2";

interface UserStoryRecord extends RowDataPacket {
  id: number;
  session_id: string;
  role: string | null;
  action: string | null;
  benefit: string | null;
  background: string | null;
  acceptance_criteria: string;
  technical_info: string;
  is_draft: boolean;
  created_at: Date;
  updated_at: Date;
}

interface SessionStats extends RowDataPacket {
  session_id: string;
  total_stories: number;
  drafts: number;
  saved_stories: number;
  first_activity: Date;
  last_activity: Date;
}

/**
 * GET handler - fetches all admin data (requires authentication)
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
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

    // Get all user stories
    const [userStories] = await db.execute<UserStoryRecord[]>(
      `SELECT id, session_id, role, action, benefit, background, 
       acceptance_criteria, technical_info, is_draft, created_at, updated_at
       FROM user_stories
       ORDER BY created_at DESC`
    );

    // Get session statistics
    const [sessionStats] = await db.execute<SessionStats[]>(
      `SELECT 
        session_id,
        COUNT(*) as total_stories,
        SUM(CASE WHEN is_draft = TRUE THEN 1 ELSE 0 END) as drafts,
        SUM(CASE WHEN is_draft = FALSE THEN 1 ELSE 0 END) as saved_stories,
        MIN(created_at) as first_activity,
        MAX(updated_at) as last_activity
       FROM user_stories
       GROUP BY session_id
       ORDER BY last_activity DESC`
    );

    // Get overall statistics
    const [totalStats] = await db.execute<RowDataPacket[]>(
      `SELECT 
        COUNT(*) as total_stories,
        COUNT(DISTINCT session_id) as unique_sessions,
        SUM(CASE WHEN is_draft = TRUE THEN 1 ELSE 0 END) as total_drafts,
        SUM(CASE WHEN is_draft = FALSE THEN 1 ELSE 0 END) as total_saved,
        MIN(created_at) as first_story_date,
        MAX(updated_at) as last_activity_date
       FROM user_stories`
    );

    // Format user stories
    const formattedStories = userStories.map((story) => ({
      id: story.id,
      sessionId: story.session_id,
      role: story.role,
      action: story.action,
      benefit: story.benefit,
      background: story.background,
      acceptanceCriteria:
        typeof story.acceptance_criteria === "string"
          ? JSON.parse(story.acceptance_criteria)
          : story.acceptance_criteria || [],
      technicalInfo:
        typeof story.technical_info === "string"
          ? JSON.parse(story.technical_info)
          : story.technical_info || [],
      isDraft: story.is_draft,
      createdAt: story.created_at,
      updatedAt: story.updated_at,
    }));

    // Format session stats
    const formattedSessionStats = sessionStats.map((stat) => ({
      sessionId: stat.session_id,
      totalStories: Number(stat.total_stories),
      drafts: Number(stat.drafts),
      savedStories: Number(stat.saved_stories),
      firstActivity: stat.first_activity,
      lastActivity: stat.last_activity,
    }));

    return NextResponse.json({
      stories: formattedStories,
      sessionStats: formattedSessionStats,
      overallStats: {
        totalStories: Number(totalStats[0]?.total_stories || 0),
        uniqueSessions: Number(totalStats[0]?.unique_sessions || 0),
        totalDrafts: Number(totalStats[0]?.total_drafts || 0),
        totalSaved: Number(totalStats[0]?.total_saved || 0),
        firstStoryDate: totalStats[0]?.first_story_date || null,
        lastActivityDate: totalStats[0]?.last_activity_date || null,
      },
    });
  } catch (error) {
    console.error("Error fetching admin data:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin data" },
      { status: 500 }
    );
  }
}

