import { createClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function GET(req: Request) {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const retailer_id = searchParams.get("retailer_id");
    if (!retailer_id) return Response.json({ error: "Missing retailer_id" }, { status: 400 });

    const { data, error } = await admin()
      .from("retailer_notes")
      .select("id, note, admin_email, created_at")
      .eq("retailer_id", retailer_id)
      .order("created_at", { ascending: false });

    if (error) return Response.json({ error: error.message }, { status: 400 });
    return Response.json({ data });
  } catch {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { retailer_id, note } = await req.json();
    if (!retailer_id || !note?.trim()) {
      return Response.json({ error: "retailer_id and note are required" }, { status: 400 });
    }

    const { data: profile } = await admin()
      .from("profiles")
      .select("email")
      .eq("id", user.id)
      .maybeSingle();

    const { data, error } = await admin()
      .from("retailer_notes")
      .insert({
        retailer_id,
        note:        note.trim(),
        admin_email: profile?.email ?? user.email ?? "admin",
        created_at:  new Date().toISOString(),
      })
      .select("id, note, admin_email, created_at")
      .single();

    if (error) return Response.json({ error: error.message }, { status: 400 });
    return Response.json({ data });
  } catch {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
