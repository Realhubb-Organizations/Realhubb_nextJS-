import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { RERA_STATE_COOKIE, isReraState, type ReraState } from "@/data/company";

// Vercel's Edge Network adds these on every request; they reflect the
// visitor's IP-based geolocation. See @vercel/functions `geolocation()`.
function detectReraState(request: NextRequest): ReraState | null {
  if (request.headers.get("x-vercel-ip-country") !== "IN") return null;
  const region = request.headers.get("x-vercel-ip-country-region");
  // Telangana was carved out of Andhra Pradesh; some geo providers still tag it "TS".
  if (region === "TS") return "TG";
  return isReraState(region) ? region : null;
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (
    pathname.startsWith("/admin") &&
    !pathname.startsWith("/admin/login")
  ) {
    const session = request.cookies.get("realhubb-admin-session");
    if (!session) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  const response = NextResponse.next();
  const reraState = detectReraState(request);
  if (reraState) {
    response.cookies.set(RERA_STATE_COOKIE, reraState, {
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day — re-detect periodically as the visitor moves
      sameSite: "lax",
    });
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|api|favicon.ico).*)"],
};
