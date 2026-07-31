import { createClient as createServiceClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

function adminClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user }, error: authErr } = await supabase.auth.getUser();

  if (!user) return Response.json({ step: "auth", error: authErr?.message ?? "No user session" });

  const admin = adminClient();

  // Check retailer lookup by user_id
  const { data: retailer, error: rErr } = await admin
    .from("retailers")
    .select("id, business_name, email, user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  // Check orders if retailer found
  let orders = null, ordersErr = null;
  if (retailer) {
    const r = await admin
      .from("orders")
      .select("id, order_number, status, submitted_at")
      .eq("retailer_id", retailer.id)
      .order("submitted_at", { ascending: false });
    orders    = r.data;
    ordersErr = r.error;
  }

  return Response.json({
    user_id:      user.id,
    user_email:   user.email,
    retailer:     retailer ?? null,
    retailerErr:  rErr?.message ?? null,
    orders:       orders ?? [],
    ordersErr:    ordersErr?.message ?? null,
  });
}
