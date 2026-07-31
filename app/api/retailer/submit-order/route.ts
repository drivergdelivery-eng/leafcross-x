import { createClient as createServiceClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { NextRequest } from "next/server";
import { Resend } from "resend";

const SHIPPING = 28.99;
const GST_RATE = 0.05;

type CartItem = {
  slug: string;
  name: string;
  type: string;
  price: number;
  unit: string;
  quantity: number;
  inventory?: number;
  maxOrderQty?: number;
  selectedVariant?: { size: string; sku: string; price: number };
};

function adminClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function POST(req: NextRequest) {
  try {
    // ── Auth check ────────────────────────────────────────────────────────
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return Response.json({ error: "Not authenticated. Please log in and try again." }, { status: 401 });
    }

    const admin = adminClient();
    const { items, locationId, shippingAddress } = await req.json() as {
      items: CartItem[];
      locationId?: string | null;
      shippingAddress?: string | null;
    };

    if (!items?.length) {
      return Response.json({ error: "Your cart is empty." }, { status: 400 });
    }

    // ── Validate quantities ───────────────────────────────────────────────
    for (const item of items) {
      if (!item.quantity || item.quantity < 1) {
        return Response.json({ error: `Invalid quantity for ${item.name}.` }, { status: 400 });
      }
      if (item.maxOrderQty && item.quantity > item.maxOrderQty) {
        return Response.json({
          error: `${item.name}: quantity ${item.quantity} exceeds the max order limit of ${item.maxOrderQty} units.`,
        }, { status: 400 });
      }
      if (item.inventory != null && item.quantity > item.inventory) {
        return Response.json({
          error: `${item.name}: only ${item.inventory} units in stock but ${item.quantity} requested.`,
        }, { status: 400 });
      }
    }

    // ── Look up / create retailer record ──────────────────────────────────
    let { data: retailer, error: retailerErr } = await admin
      .from("retailers")
      .select("id, business_name, contact_name, email, shipping_address")
      .eq("user_id", user.id)
      .maybeSingle();

    if (retailerErr && !retailerErr.message.includes("does not exist")) {
      return Response.json({ error: `Retailer lookup failed: ${retailerErr.message}` }, { status: 500 });
    }

    if (!retailer) {
      const { data: profile } = await admin
        .from("profiles")
        .select("email, full_name")
        .eq("id", user.id)
        .maybeSingle();

      const { data: newRetailer, error: createErr } = await admin
        .from("retailers")
        .insert({
          user_id:       user.id,
          business_name: profile?.full_name || (user.email ?? "").split("@")[0],
          contact_name:  profile?.full_name || "",
          email:         user.email!,
          status:        "active",
        })
        .select("id, business_name, contact_name, email, shipping_address")
        .single();

      if (createErr) {
        return Response.json({
          error: "Could not find your retailer account. Please contact support.",
        }, { status: 500 });
      }
      retailer = newRetailer;
    }

    // ── Compute totals ────────────────────────────────────────────────────
    const subtotal    = items.reduce((s, i) => s + (i.selectedVariant?.price ?? i.price) * i.quantity, 0);
    const gst         = +(subtotal * GST_RATE).toFixed(2);
    const total       = +(subtotal + gst + SHIPPING).toFixed(2);
    const orderNumber = `LC-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;

    // ── Insert order ──────────────────────────────────────────────────────
    const { data: order, error: orderErr } = await admin
      .from("orders")
      .insert({
        retailer_id:      retailer.id,
        order_number:     orderNumber,
        status:           "awaiting_payment",
        payment_status:   "pending",
        subtotal:         +subtotal.toFixed(2),
        gst_rate:         GST_RATE,
        gst_total:        gst,
        shipping_total:   SHIPPING,
        grand_total:      total,
        shipping_address: shippingAddress || retailer.shipping_address || null,
        location_id:      locationId || null,
        submitted_at:     new Date().toISOString(),
      })
      .select("id")
      .single();

    if (orderErr) {
      // Table missing — return a clear message with setup instructions
      if (orderErr.message.includes("does not exist") || orderErr.code === "42P01") {
        return Response.json({
          error: "SETUP_REQUIRED",
          detail: "The orders table has not been created in Supabase yet. Please run the SQL migration in your Supabase SQL Editor.",
          sql: `
CREATE TABLE public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  retailer_id UUID REFERENCES retailers(id),
  order_number TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'awaiting_payment',
  payment_status TEXT NOT NULL DEFAULT 'pending',
  subtotal NUMERIC(10,2) NOT NULL,
  gst_rate NUMERIC(5,4) DEFAULT 0.05,
  gst_total NUMERIC(10,2) NOT NULL,
  shipping_total NUMERIC(10,2) NOT NULL,
  grand_total NUMERIC(10,2) NOT NULL,
  shipping_address TEXT,
  notes TEXT,
  submitted_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  sku TEXT NOT NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(10,2) NOT NULL,
  line_total NUMERIC(10,2) NOT NULL
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Retailers can insert own orders" ON public.orders
  FOR INSERT TO authenticated WITH CHECK (
    retailer_id IN (SELECT id FROM retailers WHERE user_id = auth.uid())
  );
CREATE POLICY "Retailers can read own orders" ON public.orders
  FOR SELECT TO authenticated USING (
    retailer_id IN (SELECT id FROM retailers WHERE user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','manager'))
  );
CREATE POLICY "Admins can update orders" ON public.orders
  FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','manager'))
  );

CREATE POLICY "Anyone authenticated can insert order items" ON public.order_items
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can read their own order items" ON public.order_items
  FOR SELECT TO authenticated USING (
    order_id IN (
      SELECT id FROM orders WHERE retailer_id IN (
        SELECT id FROM retailers WHERE user_id = auth.uid()
      )
    )
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','manager'))
  );`,
        }, { status: 500 });
      }
      return Response.json({ error: orderErr.message }, { status: 500 });
    }

    // ── Insert order items ────────────────────────────────────────────────
    const orderItems = items.map(item => {
      const unitPrice = item.selectedVariant?.price ?? item.price;
      return {
        order_id:     order.id,
        sku:          item.selectedVariant?.sku || item.slug,
        product_name: item.selectedVariant
          ? `${item.name} (${item.selectedVariant.size})`
          : item.name,
        quantity:     item.quantity,
        unit_price:   unitPrice,
        line_total:   +(unitPrice * item.quantity).toFixed(2),
      };
    });

    const { error: itemsErr } = await admin.from("order_items").insert(orderItems);
    if (itemsErr) {
      // Clean up orphan order
      await admin.from("orders").delete().eq("id", order.id);
      return Response.json({ error: itemsErr.message }, { status: 500 });
    }

    // ── Send emails ───────────────────────────────────────────────────────
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      const resend = new Resend(apiKey);

      const itemsTableHtml = items.map(i => {
        const unitPrice = i.selectedVariant?.price ?? i.price;
        const unitLabel = i.selectedVariant?.size ?? i.unit;
        const displayName = i.selectedVariant ? `${i.name} (${i.selectedVariant.size})` : i.name;
        return `<tr>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;font-size:13px">${displayName}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;font-size:13px;text-align:center">${unitLabel}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;font-size:13px;text-align:center">${i.quantity}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;font-size:13px;text-align:right">$${unitPrice.toFixed(2)}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;font-size:13px;text-align:right;font-weight:600">$${(unitPrice * i.quantity).toFixed(2)}</td>
        </tr>`;
      }).join("");

      const totalsHtml = `
        <tr><td colspan="4" style="padding:6px 12px;text-align:right;font-size:13px;color:#666">Subtotal</td><td style="padding:6px 12px;text-align:right;font-size:13px">$${subtotal.toFixed(2)}</td></tr>
        <tr><td colspan="4" style="padding:6px 12px;text-align:right;font-size:13px;color:#666">GST (5%)</td><td style="padding:6px 12px;text-align:right;font-size:13px">$${gst.toFixed(2)}</td></tr>
        <tr><td colspan="4" style="padding:6px 12px;text-align:right;font-size:13px;color:#666">Flat Shipping</td><td style="padding:6px 12px;text-align:right;font-size:13px">$${SHIPPING.toFixed(2)}</td></tr>
        <tr><td colspan="4" style="padding:8px 12px;text-align:right;font-size:15px;font-weight:800;border-top:2px solid #000">Total</td><td style="padding:8px 12px;text-align:right;font-size:15px;font-weight:800;border-top:2px solid #000;color:#00b8c8">$${total.toFixed(2)}</td></tr>`;

      const tableHtml = `
        <table style="width:100%;border-collapse:collapse">
          <thead>
            <tr style="background:#f5f5f5">
              <th style="padding:10px 12px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#999">Product</th>
              <th style="padding:10px 12px;text-align:center;font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#999">Unit</th>
              <th style="padding:10px 12px;text-align:center;font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#999">Qty</th>
              <th style="padding:10px 12px;text-align:right;font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#999">Unit Price</th>
              <th style="padding:10px 12px;text-align:right;font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#999">Line Total</th>
            </tr>
          </thead>
          <tbody>${itemsTableHtml}${totalsHtml}</tbody>
        </table>`;

      // Notification to Leaf Cross
      resend.emails.send({
        from:    "Leaf Cross Orders <noreply@leafcross.com>",
        to:      ["info@leafcross.com"],
        replyTo: retailer.email,
        subject: `New Order ${orderNumber} — ${retailer.business_name}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:680px;margin:0 auto">
            <div style="background:#000;padding:24px 28px">
              <p style="margin:0;color:#00f6ff;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase">Leaf Cross Biomedical — New Order</p>
              <h1 style="margin:8px 0 0;color:#fff;font-size:22px;font-weight:800">${orderNumber}</h1>
            </div>
            <div style="background:#f9f9f9;padding:24px 28px">
              <table style="width:100%;margin-bottom:20px">
                <tr><td style="padding:4px 0;color:#666;font-size:13px;width:140px">Retailer</td><td style="font-size:14px;font-weight:700">${retailer.business_name}</td></tr>
                <tr><td style="padding:4px 0;color:#666;font-size:13px">Contact</td><td style="font-size:14px">${retailer.contact_name || "—"}</td></tr>
                <tr><td style="padding:4px 0;color:#666;font-size:13px">Email</td><td style="font-size:14px"><a href="mailto:${retailer.email}">${retailer.email}</a></td></tr>
                ${(shippingAddress || retailer.shipping_address) ? `<tr><td style="padding:4px 0;color:#666;font-size:13px">Ship To</td><td style="font-size:14px">${shippingAddress || retailer.shipping_address}</td></tr>` : ""}
                <tr><td style="padding:4px 0;color:#666;font-size:13px">Submitted</td><td style="font-size:14px">${new Date().toLocaleString("en-CA", { timeZone: "America/Vancouver" })} PT</td></tr>
              </table>
              ${tableHtml}
              <div style="margin-top:20px;padding:14px 16px;background:#fff3cd;border-radius:6px;font-size:13px;color:#856404">
                ⚠ Awaiting payment from retailer. Payment must be received within 48 hours to guarantee shipment.
              </div>
            </div>
          </div>`,
      }).catch(err => console.warn("Order notification email failed:", err));

      // Confirmation to retailer
      resend.emails.send({
        from:    "Leaf Cross Biomedical <noreply@leafcross.com>",
        to:      [retailer.email],
        subject: `Order Confirmed — ${orderNumber} — Leaf Cross Biomedical`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:680px;margin:0 auto">
            <div style="background:#000;padding:24px 28px">
              <p style="margin:0;color:#00f6ff;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase">Leaf Cross Biomedical</p>
              <h1 style="margin:8px 0 0;color:#fff;font-size:22px;font-weight:800">Order Received</h1>
            </div>
            <div style="background:#f9f9f9;padding:24px 28px">
              <p style="font-size:15px;line-height:1.6;margin:0 0 16px">Hi <strong>${retailer.contact_name || retailer.business_name}</strong>,</p>
              <p style="font-size:14px;line-height:1.6;color:#555;margin:0 0 20px">Your order has been received and is awaiting payment. Your order number is:</p>
              <div style="background:#000;color:#00f6ff;font-family:monospace;font-size:22px;font-weight:800;text-align:center;padding:16px;border-radius:8px;margin:0 0 24px;letter-spacing:0.05em">${orderNumber}</div>
              ${tableHtml}
              <div style="margin-top:24px;padding:20px 22px;background:#f9f9f7;border:1px solid #e5e5e5;border-radius:6px">
                <p style="margin:0 0 10px;font-size:12px;font-weight:700;color:#999;text-transform:uppercase;letter-spacing:0.08em">Payment Instructions</p>
                <p style="margin:0 0 16px;font-size:13px;color:#555;line-height:1.65">
                  Payment must be received within <strong>48 hours</strong> of your order to guarantee shipment.
                  Include your order number <strong style="color:#00909a">${orderNumber}</strong> in all payment references.
                </p>
                <div style="margin-bottom:10px;padding:12px 14px;background:#fff;border:1px solid #ddd;border-left:4px solid #00b8c8;border-radius:4px">
                  <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:#00909a;text-transform:uppercase;letter-spacing:0.08em">Option 1 — Interac E-Transfer</p>
                  <p style="margin:0;font-size:13px;color:#444">Send to <strong><a href="mailto:payment@leafcross.com" style="color:#00b8c8">payment@leafcross.com</a></strong></p>
                </div>
                <div style="padding:12px 14px;background:#fff;border:1px solid #ddd;border-radius:4px">
                  <p style="margin:0 0 10px;font-size:11px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:0.08em">Option 2 — Wire / EFT Transfer</p>
                  <table style="width:100%;border-collapse:collapse;font-size:12px">
                    <tr><td style="padding:4px 12px 4px 0;color:#aaa;width:150px">Bank</td><td style="padding:4px 0;color:#333;font-weight:600">CIBC — Canadian Imperial Bank of Commerce</td></tr>
                    <tr><td style="padding:4px 12px 4px 0;color:#aaa">Branch Address</td><td style="padding:4px 0;color:#333;font-weight:600">6204 Fraser St, Vancouver, BC, Canada V5W 3A1</td></tr>
                    <tr><td style="padding:4px 12px 4px 0;color:#aaa">SWIFT Code</td><td style="padding:4px 0;color:#333;font-weight:600">CIBCCATT</td></tr>
                    <tr><td style="padding:4px 12px 4px 0;color:#aaa">Branch / Transit #</td><td style="padding:4px 0;color:#333;font-weight:600">00810</td></tr>
                    <tr><td style="padding:4px 12px 4px 0;color:#aaa">Institution #</td><td style="padding:4px 0;color:#333;font-weight:600">010</td></tr>
                    <tr><td style="padding:4px 12px 4px 0;color:#aaa">Account #</td><td style="padding:4px 0;color:#333;font-weight:600">9249311</td></tr>
                    <tr><td style="padding:4px 12px 4px 0;color:#aaa">CC Code</td><td style="padding:4px 0;color:#333;font-weight:600">CC001000810</td></tr>
                  </table>
                </div>
              </div>
              <p style="margin:20px 0 0;font-size:12px;color:#999;text-align:center">Questions? Reply to this email or contact us at <a href="mailto:info@leafcross.com" style="color:#00b8c8">info@leafcross.com</a></p>
            </div>
          </div>`,
      }).catch(err => console.warn("Order confirmation email failed:", err));
    }

    return Response.json({ success: true, orderNumber });
  } catch {
    return Response.json({ error: "Server error. Please try again." }, { status: 500 });
  }
}
