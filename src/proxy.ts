import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

// Next.js 16 "Proxy" (was called Middleware). Keeps the Supabase session fresh
// and protects pages. Pages also check the session themselves: see src/app/page.tsx.
export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  // Every route except Next.js build files, images and files with an extension
  // (favicon, fonts, etc.), so CSS and JS always load.
  matcher: ["/((?!_next/static|_next/image|.*\\.[a-zA-Z0-9]+$).*)"],
};
