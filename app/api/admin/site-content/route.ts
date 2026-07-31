import { createClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { getSiteContent } from "@/lib/data/getSiteContent";
import type { SiteContent } from "@/lib/data/siteContent";

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function GET() {
  const content = await getSiteContent();
  return Response.json(content);
}

export async function PUT(req: Request) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const content = await req.json() as SiteContent;

  const { error } = await admin()
    .from("site_settings")
    .upsert({ key: "main", content, updated_at: new Date().toISOString() }, { onConflict: "key" });

  if (error) return Response.json({ error: error.message }, { status: 400 });
  return Response.json({ success: true });
}
