import { createClient } from "@/lib/supabase/server";

// Health check: proves the app can reach Supabase.
// Asks only for a row count (head: true), so no data ever comes back.
// Anonymous callers see 0 rows because of RLS, which is fine here.
export async function GET() {
  const supabase = await createClient();
  const { error } = await supabase
    .from("master_cv")
    .select("id", { count: "exact", head: true });

  if (error) {
    console.error("Health check failed:", error.code);
    return Response.json({ ok: false }, { status: 503 });
  }

  return Response.json({ ok: true });
}
