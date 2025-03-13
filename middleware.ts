import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Add diagnostic response headers for API routes
  if (request.nextUrl.pathname.startsWith('/api/') || request.nextUrl.pathname.startsWith('/auth/')) {
    response.headers.set('X-API-Request-Time', new Date().toISOString());
    
    // Add server environment info
    response.headers.set('X-Server-Environment', process.env.NODE_ENV || 'unknown');
    
    // Log request details in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Middleware] ${request.method} ${request.nextUrl.pathname}`);
    }
  }
  
  return response;
}

export const config = {
  matcher: [
    // Match all API routes
    '/api/:path*',
    // Match all auth routes
    '/auth/:path*',
  ],
};