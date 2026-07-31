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
      .from("contact_queries")
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

    const { id, read } = await req.json();

    const { error } = await admin()
      .from("contact_queries")
      .update({ read })
      .eq("id", id);

    if (error) return Response.json({ error: error.message }, { status: 400 });
    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
