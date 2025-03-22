import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This middleware will run on all routes specified in the matcher
export function middleware(request: NextRequest) {
  // For now, we'll just pass through all requests
  return NextResponse.next();
}

// Only run middleware on specific paths
export const config = {
  matcher: [
    // We're excluding the messaging routes to avoid interference
    // "/((?!api|_next/static|_next/image|favicon.ico|messages|messages-new).*)",
  ],
};
