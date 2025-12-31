import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Security headers to add to all responses
const securityHeaders = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-XSS-Protection': '1; mode=block',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

export default withAuth(
  function middleware(req: NextRequest) {
    const response = NextResponse.next();
    
    // Add security headers to all responses
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    
    // Add CSP header (separate for readability)
    response.headers.set(
      'Content-Security-Policy',
      [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https: blob:",
        "font-src 'self' data:",
        "connect-src 'self' https:",
        "frame-ancestors 'none'",
      ].join('; ')
    );
    
    return response;
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;

        // Public paths that don't require authentication
        const publicPaths = ["/", "/login", "/signup", "/api/auth"];
        
        // Check if the path is public
        if (publicPaths.some(p => path === p || path.startsWith(p + "/"))) {
          return true;
        }

        // Protected paths require authentication
        if (path.startsWith("/dashboard") || path.startsWith("/api/")) {
          return !!token;
        }

        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    // Match all paths except static files and images
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
