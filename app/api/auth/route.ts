import { NextRequest, NextResponse } from "next/server";
import {
  APP_AUTH_COOKIE,
  appAuthCookieOptions,
  isAppAuthenticated,
} from "@/utils/appAuth";

/**
 * GET — whether the browser has a valid app auth cookie (httpOnly; cannot be forged from JS).
 */
export async function GET(request: NextRequest) {
  return NextResponse.json({
    authenticated: isAppAuthenticated(request),
  });
}

/**
 * POST — verify PASSWORD and set httpOnly session cookie for API access.
 */
export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    const correctPassword = process.env.PASSWORD;

    if (!correctPassword) {
      return NextResponse.json(
        { error: "Password not configured" },
        { status: 500 }
      );
    }

    if (password === correctPassword) {
      const response = NextResponse.json({ success: true });
      response.cookies.set(APP_AUTH_COOKIE, "true", appAuthCookieOptions);
      return response;
    }

    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

/**
 * DELETE — clear app auth (logout).
 */
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete(APP_AUTH_COOKIE);
  return response;
}

