import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const status = process.env.NEXT_PUBLIC_APP_STATUS;
  const { pathname } = request.nextUrl;

  // If APP_STATUS is "coming-soon", protect all routes except:
  // - Homepage (/) — shows the coming soon landing
  // - API subscribe endpoint
  // - Static assets
  if (
    status === "coming-soon" &&
    pathname !== "/" &&
    !pathname.startsWith("/api/subscribe") &&
    !pathname.startsWith("/_next") &&
    !pathname.startsWith("/fonts") &&
    !pathname.startsWith("/favicon")
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
