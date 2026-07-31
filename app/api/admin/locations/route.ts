import { createClient as createServiceClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";

function admin() {
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
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await admin()
      .from("retailer_locations")
      .select(`
        id, nickname, shipping_address, license_number, license_expiry_date,
        license_photo_url, status, reviewer_note, created_at, updated_at,
        retailers(id, business_name, contact_name, email)
      `)
      .order("created_at", { ascending: false });

    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json({ data: data ?? [] });
  } catch {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { id, action, reviewer_note } = await req.json() as {
      id: string;
      action: "approve" | "reject";
      reviewer_note?: string;
    };

    if (!id || !["approve", "reject"].includes(action)) {
      return Response.json({ error: "Invalid request" }, { status: 400 });
    }

    const db = admin();
    const { data: loc } = await db
      .from("retailer_locations")
      .select("id, status, nickname, shipping_address, retailers(email, contact_name, business_name)")
      .eq("id", id)
      .maybeSingle();

    if (!loc) return Response.json({ error: "Location not found" }, { status: 404 });

    const newStatus = action === "approve" ? "approved" : "rejected";
    const { error } = await db
      .from("retailer_locations")
      .update({ status: newStatus, reviewer_note: reviewer_note || null, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) return Response.json({ error: error.message }, { status: 500 });

    // Notify retailer by email
    const retailer = (loc as unknown as { retailers: { email: string; contact_name: string; business_name: string } | null }).retailers;
    if (retailer && process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const locData = loc as unknown as { nickname: string; shipping_address: string };
      const locationLabel = locData.nickname || locData.shipping_address;
      const subject = action === "approve"
        ? `Location Approved — ${locationLabel}`
        : `Location Update Required — ${locationLabel}`;
      const text = action === "approve"
        ? `Hi ${retailer.contact_name},\n\nYour new location "${locationLabel}" has been approved and is now active on your account. You can now select it when placing orders.\n\nLeaf Cross Biomedical Team`
        : `Hi ${retailer.contact_name},\n\nYour location request "${locationLabel}" could not be approved at this time.\n\n${reviewer_note ? `Reason: ${reviewer_note}\n\n` : ""}Please contact us at info@leafcross.com if you have questions.\n\nLeaf Cross Biomedical Team`;
      await resend.emails.send({
        from: "Leaf Cross Portal <noreply@leafcross.com>",
        to:   retailer.email,
        subject,
        text,
      }).catch(() => {});
    }

    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
