import { createClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email/send";
import { buildOrderStatusEmail, type StatusEmailKey } from "@/lib/email/templates";

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

    const { data: orders, error: ordersErr } = await admin()
      .from("orders")
      .select("*, retailers(business_name, email, phone, shipping_address)")
      .order("submitted_at", { ascending: false });

    if (ordersErr) return Response.json({ error: ordersErr.message }, { status: 400 });
    if (!orders?.length) return Response.json({ data: [] });

    const orderIds = orders.map(o => o.id);
    const { data: items, error: itemsErr } = await admin()
      .from("order_items")
      .select("id, order_id, sku, product_name, quantity, unit_price, line_total")
      .in("order_id", orderIds);

    if (itemsErr) console.error("[orders] order_items query error:", itemsErr.message);

    const data = orders.map(order => ({
      ...order,
      order_items: (items ?? []).filter(i => i.order_id === order.id),
    }));

    return Response.json({ data });
  } catch {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

const EMAIL_TRIGGER_STATUSES = new Set<string>([
  "processing", "shipped", "completed", "cancelled",
]);

export async function PATCH(req: Request) {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { id, items, ...patch } = await req.json();
    if (!id) return Response.json({ error: "Missing order id" }, { status: 400 });

    // Capture the previous status before updating (for change detection)
    const { data: prevOrder } = await admin()
      .from("orders")
      .select("status, order_number, retailers(business_name, email)")
      .eq("id", id)
      .single();

    // Update order-level fields (status, payment_status, notes, etc.)
    if (Object.keys(patch).length > 0) {
      const { error } = await admin().from("orders").update(patch).eq("id", id);
      if (error) return Response.json({ error: error.message }, { status: 400 });
    }

    // Replace all order items if provided
    if (Array.isArray(items)) {
      await admin().from("order_items").delete().eq("order_id", id);

      if (items.length > 0) {
        const GST_RATE = 0.05;
        const SHIPPING = 28.99;
        const rows = items.map((item: Record<string, unknown>) => ({
          order_id:     id,
          product_name: item.name as string,
          sku:          (item.type as string) || null,
          quantity:     item.qty as number,
          unit_price:   item.unitPrice as number,
          line_total:   (item.qty as number) * (item.unitPrice as number),
        }));

        const { error: itemsErr } = await admin().from("order_items").insert(rows);
        if (itemsErr) return Response.json({ error: itemsErr.message }, { status: 400 });

        // Recalculate and save order totals
        const subtotal = rows.reduce((s, r) => s + r.line_total, 0);
        const gst      = +(subtotal * GST_RATE).toFixed(2);
        const grand    = +(subtotal + gst + SHIPPING).toFixed(2);

        await admin().from("orders").update({
          subtotal:       +subtotal.toFixed(2),
          gst_total:      gst,
          shipping_total: SHIPPING,
          grand_total:    grand,
        }).eq("id", id);
      }
    }

    // Send order status email if status changed to a notifiable state
    const newStatus = patch.status as string | undefined;
    const prevStatus = prevOrder?.status as string | undefined;

    if (
      newStatus &&
      newStatus !== prevStatus &&
      EMAIL_TRIGGER_STATUSES.has(newStatus) &&
      prevOrder
    ) {
      const retailer = prevOrder.retailers as unknown as { business_name: string; email: string } | null;

      if (retailer?.email) {
        // Fetch current items to include in the email
        const { data: orderItems } = await admin()
          .from("order_items")
          .select("product_name, sku, quantity, unit_price")
          .eq("order_id", id);

        const emailItems = (orderItems ?? []).map(i => ({
          name:      i.product_name as string,
          type:      (i.sku as string) || "",
          qty:       i.quantity as number,
          unitPrice: i.unit_price as number,
        }));

        const { subject, html } = buildOrderStatusEmail(newStatus as StatusEmailKey, {
          orderNumber:  prevOrder.order_number as string,
          businessName: retailer.business_name,
          items:        emailItems,
          trackingCode: patch.tracking_code as string | undefined,
          notes:        patch.notes as string | undefined,
        });

        // Fire and forget — don't block the response
        sendEmail(retailer.email, subject, html).catch(err =>
          console.error("[orders] email send failed:", err)
        );
      }
    }

    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await req.json();
    if (!id) return Response.json({ error: "Missing order id" }, { status: 400 });

    // Delete items first (foreign key), then the order
    await admin().from("order_items").delete().eq("order_id", id);
    const { error } = await admin().from("orders").delete().eq("id", id);
    if (error) return Response.json({ error: error.message }, { status: 400 });

    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
