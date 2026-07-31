import { createClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function GET() {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await admin()
      .from("retailer_applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return Response.json({ error: error.message }, { status: 400 });
    return Response.json({ data });
  } catch {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { id, status, rejection_reason, admin_notes } = await req.json();

    const patch: Record<string, unknown> = {};
    if (status !== undefined)           patch.status           = status;
    if (rejection_reason !== undefined)  patch.rejection_reason = rejection_reason || null;
    if (admin_notes !== undefined)       patch.admin_notes      = admin_notes;
    if (status !== undefined)            patch.reviewed_at      = new Date().toISOString();

    const { error } = await admin()
      .from("retailer_applications")
      .update(patch)
      .eq("id", id);

    if (error) return Response.json({ error: error.message }, { status: 400 });
    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
