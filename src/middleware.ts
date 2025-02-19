import { NextResponse, NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Forward visit data to our server-side API
  fetch(`${request.nextUrl.origin}/api/track-visit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ page: pathname }),
  }).catch(console.error); // Catch but don't await to avoid blocking

  const response = NextResponse.next();
  return response;
}

// Configure which paths to monitor
export const config = {
  matcher: [
    /*
     * Match all paths except:
     * 1. /api/auth/* (auth routes)
     * 2. /metrics (metrics endpoint)
     * 3. /_next/* (Next.js internals)
     * 4. /static/* (static files)
     * 5. /favicon.ico, /robots.txt, etc. (static files)
     */
    '/((?!api/auth|api/track-visit|metrics|_next/|static/|favicon.ico|robots.txt).*)',
  ],
};