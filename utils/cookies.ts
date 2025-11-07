/**
 * Cookie utility functions
 */

const AUTH_COOKIE_NAME = "uscreator_auth";
const SESSION_COOKIE_NAME = "uscreator_session_id";

/**
 * Sets a cookie with the given value
 */
export function setCookie(value: string, days: number = 7): void {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${AUTH_COOKIE_NAME}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
}

/**
 * Gets a cookie value by name
 */
export function getCookie(): string | null {
  if (typeof document === "undefined") return null;
  const name = AUTH_COOKIE_NAME + "=";
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
}

/**
 * Removes a cookie
 */
export function removeCookie(): void {
  document.cookie = `${AUTH_COOKIE_NAME}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
}

/**
 * Sets the session ID cookie
 */
export function setSessionId(sessionId: string, days: number = 365): void {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${SESSION_COOKIE_NAME}=${sessionId};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
}

/**
 * Gets the session ID from cookies
 */
export function getSessionId(): string | null {
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
}

