import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Allow the request to proceed
    return NextResponse.next();
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
        if (path.startsWith("/dashboard")) {
          return !!token;
        }

        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/videos/:path*",
    "/api/clips/:path*",
    "/api/schedule/:path*",
    "/api/user/:path*",
  ],
};
