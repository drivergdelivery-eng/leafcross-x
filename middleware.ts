import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;

  // Redirect unauthenticated users to login
  if (!user && (path.startsWith("/retailer") || path.startsWith("/admin"))) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect logged-in users away from the login page based on role cookie
  if (user && path === "/login") {
    // Role check happens client-side in LoginForm; default to /retailer here
    return NextResponse.redirect(new URL("/retailer", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/retailer/:path*", "/admin/:path*", "/login"],
};
