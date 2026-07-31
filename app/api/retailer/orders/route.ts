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
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return Response.json({ error: "Not authenticated" }, { status: 401 });

    const admin = adminClient();

    // Find retailer record
    const { data: retailer } = await admin
      .from("retailers")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!retailer) return Response.json({ data: [] });

    const { data: orders, error: ordersErr } = await admin
      .from("orders")
      .select("id, order_number, status, payment_status, subtotal, gst_total, shipping_total, grand_total, submitted_at")
      .eq("retailer_id", retailer.id)
      .order("submitted_at", { ascending: false });

    if (ordersErr) {
      if (ordersErr.code === "42P01") {
        return Response.json({ error: "SETUP_REQUIRED" }, { status: 500 });
      }
      return Response.json({ error: ordersErr.message }, { status: 500 });
    }

    if (!orders?.length) return Response.json({ data: [] });

    const orderIds = orders.map(o => o.id);
    const { data: items, error: itemsErr } = await admin
      .from("order_items")
      .select("id, order_id, sku, product_name, quantity, unit_price, line_total")
      .in("order_id", orderIds);

    if (itemsErr && itemsErr.code === "42P01") {
      return Response.json({ error: "SETUP_REQUIRED" }, { status: 500 });
    }

    const data = orders.map(order => ({
      ...order,
      order_items: (items ?? []).filter(i => i.order_id === order.id),
    }));

    return Response.json({ data });
  } catch {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
