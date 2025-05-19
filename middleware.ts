import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// This middleware will run on all routes specified in the matcher
export async function middleware(request: NextRequest) {
  // Get the path
  const { pathname } = request.nextUrl;

  // Allow access to public routes without authentication
  const isPublicRoute =
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/register/employer" ||
    pathname === "/register/freelancer" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password" ||
    pathname === "/2fa" ||
    pathname === "/customer-support" ||
    pathname === "/finding-us" ||
    pathname === "/cookies" ||
    pathname === "/privacy" ||
    pathname === "/terms-of-service" ||
    pathname === "/404" ||
    pathname.startsWith("/home");

  // Special case for freelancer profiles - allow viewing without authentication
  const isFreelancerProfileRoute = pathname.includes("/freelancer/");

  // API routes should be handled by NextAuth directly
  const isApiAuthRoute = pathname.startsWith("/api/auth");

  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  // Check for authentication - first try NextAuth token
  const session = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Check for legacy token in cookie
  const legacyToken = request.cookies.get("token")?.value;

  // Remove client-side code from middleware, which only runs server-side
  // We'll handle localStorage in a useEffect in the app

  // User is authenticated if they have either a NextAuth session or a legacy token
  const isAuthenticated = !!session || !!legacyToken;

  // If the user is not authenticated and trying to access a protected route
  if (!isAuthenticated && !isPublicRoute && !isFreelancerProfileRoute) {
    // Create the URL for the login page with a redirect parameter
    const url = new URL("/login", request.url);
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  // Pass the request through
  const response = NextResponse.next();

  // If user is authenticated with NextAuth but doesn't have a legacy token cookie,
  // add it for compatibility with legacy code
  if (session?.apiToken && !legacyToken) {
    response.cookies.set({
      name: "token",
      value: session.apiToken as string,
      path: "/",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      sameSite: "lax",
    });
  }

  return response;
}

// Configure paths that should trigger this middleware
export const config = {
  matcher: [
    // Include all routes that need authentication check
    "/((?!api||favicon.ico).*)",
  ],
};
