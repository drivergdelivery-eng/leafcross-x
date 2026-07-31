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
      .from("retailers")
      .select("*, orders(count)")
      .order("created_at", { ascending: false });

    if (error) return Response.json({ error: error.message }, { status: 400 });

    const mapped = (data || []).map((r: Record<string, unknown>) => ({
      ...r,
      order_count: Array.isArray(r.orders) ? (r.orders[0] as Record<string, unknown>)?.count ?? 0 : 0,
    }));

    return Response.json({ data: mapped });
  } catch {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { id, ...patch } = await req.json();
    if (!id) return Response.json({ error: "Missing retailer id" }, { status: 400 });

    const { error } = await admin()
      .from("retailers")
      .update(patch)
      .eq("id", id);

    if (error) return Response.json({ error: error.message }, { status: 400 });
    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
