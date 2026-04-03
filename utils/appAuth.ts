import { NextRequest, NextResponse } from "next/server";

/** HttpOnly cookie set by POST /api/auth when PASSWORD matches. Not readable from JS. */
export const APP_AUTH_COOKIE = "uscreator_app_auth";

export const isAppAuthenticated = (request: NextRequest): boolean =>
  request.cookies.get(APP_AUTH_COOKIE)?.value === "true";

export const requireAppAuth = (request: NextRequest): NextResponse | null => {
  if (!isAppAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
};

export const appAuthCookieOptions = {
  httpOnly: true,
  sameSite: "strict" as const,
  path: "/",
  maxAge: 7 * 24 * 60 * 60,
  secure: process.env.NODE_ENV === "production",
};
