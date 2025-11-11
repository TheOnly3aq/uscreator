import { NextRequest, NextResponse } from "next/server";
import { getPool, initializeDatabase } from "@/utils/db";
import { RowDataPacket } from "mysql2";

interface UserStoryRecord extends RowDataPacket {
  id: number;
  session_id: string;
  type: string;
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
  user_agent: string | null;
  ip_addresses: string;
  first_seen: Date | null;
  last_seen: Date | null;
}

/**
 * GET handler - fetches all admin data (requires authentication)
 * @param {NextRequest} request - The request object
 * @returns {Promise<NextResponse>} Response with admin data including stories, session stats, and overall stats
 */
export async function GET(request: NextRequest) {
  try {
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

    const [userStories] = await db.execute<UserStoryRecord[]>(
      `SELECT id, session_id, type, role, action, benefit, background, 
       acceptance_criteria, technical_info, is_draft, created_at, updated_at
       FROM user_stories
       ORDER BY created_at DESC`
    );

    const [sessionStats] = await db.execute<SessionStats[]>(
      `SELECT 
        us.session_id,
        COUNT(*) as total_stories,
        SUM(CASE WHEN us.is_draft = TRUE THEN 1 ELSE 0 END) as drafts,
        SUM(CASE WHEN us.is_draft = FALSE THEN 1 ELSE 0 END) as saved_stories,
        MIN(us.created_at) as first_activity,
        MAX(us.updated_at) as last_activity,
        s.user_agent,
        s.ip_addresses,
        s.first_seen,
        s.last_seen
       FROM user_stories us
       LEFT JOIN sessions s ON us.session_id = s.session_id
       GROUP BY us.session_id, s.user_agent, s.ip_addresses, s.first_seen, s.last_seen
       ORDER BY last_activity DESC`
    );

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

    const formattedStories = userStories.map((story) => ({
      id: story.id,
      sessionId: story.session_id,
      type: (story.type === "bug" ? "bug" : "story") as "story" | "bug",
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

    const formattedSessionStats = sessionStats.map((stat) => {
      let ipAddresses: string[] = [];
      if (stat.ip_addresses) {
        const parsed = typeof stat.ip_addresses === "string"
          ? JSON.parse(stat.ip_addresses)
          : stat.ip_addresses;
        ipAddresses = Array.isArray(parsed) ? parsed : [];
      }
      
      return {
        sessionId: stat.session_id,
        totalStories: Number(stat.total_stories),
        drafts: Number(stat.drafts),
        savedStories: Number(stat.saved_stories),
        firstActivity: stat.first_activity,
        lastActivity: stat.last_activity,
        userAgent: stat.user_agent || null,
        ipAddresses,
        firstSeen: stat.first_seen || null,
        lastSeen: stat.last_seen || null,
      };
    });

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

