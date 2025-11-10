import { NextRequest, NextResponse } from "next/server";
import { getPool, initializeDatabase } from "@/utils/db";
import { randomBytes } from "crypto";
import { RowDataPacket } from "mysql2";

/**
 * Gets the client IP address from the request headers
 * @param {NextRequest} request - The request object
 * @returns {string} The client IP address or "unknown" if not found
 */
function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  if (realIp) {
    return realIp;
  }
  return "unknown";
}

/**
 * GET handler - gets or creates a session ID and saves/updates session metadata
 * @param {NextRequest} request - The request object
 * @returns {Promise<NextResponse>} Response with session ID
 */
export async function GET(request: NextRequest) {
  try {
    await initializeDatabase();
    const db = getPool();

    const sessionIdCookie = request.cookies.get("uscreator_session_id");
    let sessionId: string;

    if (sessionIdCookie?.value) {
      sessionId = sessionIdCookie.value;
      
      const userAgent = request.headers.get("user-agent") || null;
      const ipAddress = getClientIp(request);
      
      const [existingSessions] = await db.execute<RowDataPacket[]>(
        `SELECT ip_addresses FROM sessions WHERE session_id = ?`,
        [sessionId]
      );
      
      let ipAddresses: string[] = [];
      if (existingSessions.length > 0 && existingSessions[0].ip_addresses) {
        const existingIps = typeof existingSessions[0].ip_addresses === "string"
          ? JSON.parse(existingSessions[0].ip_addresses)
          : existingSessions[0].ip_addresses;
        ipAddresses = Array.isArray(existingIps) ? existingIps : [];
      }
      
      if (ipAddress && !ipAddresses.includes(ipAddress)) {
        ipAddresses.push(ipAddress);
      }
      
      await db.execute(
        `INSERT INTO sessions (session_id, user_agent, ip_addresses, last_seen)
         VALUES (?, ?, ?, NOW())
         ON DUPLICATE KEY UPDATE
         user_agent = COALESCE(?, user_agent),
         ip_addresses = ?,
         last_seen = NOW()`,
        [
          sessionId,
          userAgent,
          JSON.stringify(ipAddresses),
          userAgent,
          JSON.stringify(ipAddresses),
        ]
      );
      
      return NextResponse.json({ sessionId });
    }

    sessionId = randomBytes(32).toString("hex");
    const userAgent = request.headers.get("user-agent") || null;
    const ipAddress = getClientIp(request);

    await db.execute(
      `INSERT INTO sessions (session_id, user_agent, ip_addresses)
       VALUES (?, ?, ?)`,
      [sessionId, userAgent, JSON.stringify([ipAddress])]
    );

    const response = NextResponse.json({ sessionId });
    response.cookies.set("uscreator_session_id", sessionId, {
      maxAge: 365 * 24 * 60 * 60,
      httpOnly: true,
      sameSite: "strict",
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error in session route:", error);
    return NextResponse.json(
      { error: "Failed to get session" },
      { status: 500 }
    );
  }
}

