import { NextResponse } from "next/server";

/**
 * Sets cookie names that Wappalyzer associates with Magento (see technologies JSON).
 */
export const middleware = () => {
  const response = NextResponse.next();

  response.cookies.set("X-Magento-Vary", "", { path: "/" });
  response.cookies.set("mage-cache-storage", "{}", { path: "/" });
  response.cookies.set("mage-cache-storage-section-invalidation", "{}", {
    path: "/",
  });
  response.cookies.set("mage-translation-file-version", "{}", { path: "/" });
  response.cookies.set("mage-translation-storage", "{}", { path: "/" });

  return response;
};

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon\\.svg|.*\\.(?:ico|svg|png|jpg|jpeg|gif|webp|woff2?)$).*)",
  ],
};
