import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Pages anyone can open without signing in.
const PUBLIC_PATHS = ["/sign-in", "/api/health"];

// Runs from src/proxy.ts on every page request: refreshes the Supabase session
// cookie, sends signed-out visitors to /sign-in and signed-in users away from it.
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  let cacheHeaders: Record<string, string> = {};

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          // Pass refreshed cookies to the page (request) and to the browser (response).
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
          // No-cache headers, so a CDN never serves one person's session to another.
          cacheHeaders = headers;
          Object.entries(headers).forEach(([key, value]) =>
            response.headers.set(key, value),
          );
        },
      },
    },
  );

  // Must run before anything else: it checks the token and refreshes it if needed.
  const { data } = await supabase.auth.getClaims();
  const signedIn = Boolean(data?.claims);

  const { pathname } = request.nextUrl;
  const isPublic = PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

  if (!signedIn && !isPublic) {
    return redirectKeepingCookies(request, "/sign-in", response, cacheHeaders);
  }
  if (signedIn && pathname === "/sign-in") {
    return redirectKeepingCookies(request, "/", response, cacheHeaders);
  }

  return response;
}

// A redirect must carry the refreshed cookies too, or the session is lost.
function redirectKeepingCookies(
  request: NextRequest,
  pathname: string,
  from: NextResponse,
  cacheHeaders: Record<string, string>,
) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = "";
  const redirect = NextResponse.redirect(url);
  from.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
  Object.entries(cacheHeaders).forEach(([key, value]) =>
    redirect.headers.set(key, value),
  );
  return redirect;
}
