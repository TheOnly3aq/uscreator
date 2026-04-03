/**
 * Client-side session cookie helpers. App login uses httpOnly cookies from /api/auth (see utils/appAuth.ts).
 */

const SESSION_COOKIE_NAME = "uscreator_session_id";

/**
 * Sets the session ID cookie (mirrors server session for client reads where needed).
 */
export const setSessionId = (sessionId: string, days: number = 365): void => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${SESSION_COOKIE_NAME}=${sessionId};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
};

/**
 * Gets the session ID from cookies
 */
export const getSessionId = (): string | null => {
  if (typeof document === "undefined") return null;
  const name = SESSION_COOKIE_NAME + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return null;
};
