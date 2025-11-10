import { NextRequest, NextResponse } from "next/server";

/**
 * POST handler for admin password authentication
 */
export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json(
        { error: "Admin password not configured" },
        { status: 500 }
      );
    }

    if (password === adminPassword) {
      const response = NextResponse.json({ success: true });
      // Set admin session cookie
      response.cookies.set("admin_authenticated", "true", {
        maxAge: 24 * 60 * 60, // 24 hours
        httpOnly: true,
        sameSite: "strict",
        path: "/",
      });
      return response;
    }

    return NextResponse.json(
      { error: "Invalid password" },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}

/**
 * GET handler - checks if admin is authenticated
 */
export async function GET(request: NextRequest) {
  const isAuthenticated =
    request.cookies.get("admin_authenticated")?.value === "true";
  return NextResponse.json({ authenticated: isAuthenticated });
}

/**
 * DELETE handler - logs out admin
 */
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete("admin_authenticated");
  return response;
}

