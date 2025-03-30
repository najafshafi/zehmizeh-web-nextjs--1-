import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This middleware will run on all routes specified in the matcher
export function middleware(request: NextRequest) {
  // Get the token from the cookies
  const token = request.cookies.get("token")?.value;
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
    pathname === "/terms" ||
    pathname.startsWith("/home");

  // Special case for freelancer profiles - allow viewing without authentication
  // Use a more permissive pattern to match freelancer profiles
  const isFreelancerProfileRoute = pathname.includes("/freelancer/");

  // // Log the path and whether it's a freelancer profile for debugging
  // console.log(`Middleware Path: ${pathname}`);
  // console.log(`Is Public Route: ${isPublicRoute}`);
  // console.log(`Is Freelancer Profile: ${isFreelancerProfileRoute}`);
  // console.log(`Has Token: ${!!token}`);

  // If the user is not authenticated and trying to access a protected route
  if (!token && !isPublicRoute && !isFreelancerProfileRoute) {
    // Log the redirect
    // console.log(`Redirecting to login from ${pathname}`);

    // Create the URL for the login page with a redirect parameter
    const url = new URL("/login", request.url);
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  // Log that we're allowing access
  // console.log(`Allowing access to ${pathname}`);
  return NextResponse.next();
}

// Configure paths that should trigger this middleware
export const config = {
  matcher: [
    // Include all routes that need authentication check
    "/((?!api||favicon.ico).*)",
  ],
};
