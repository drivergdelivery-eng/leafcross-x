import { createClient as createServiceClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";

const MAX_LOCATIONS = 8;

function admin() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

async function getRetailerId(userId: string) {
  const { data } = await admin().from("retailers").select("id").eq("user_id", userId).maybeSingle();
  return data?.id as string | undefined;
}

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return Response.json({ error: "Not authenticated" }, { status: 401 });

    const retailerId = await getRetailerId(user.id);
    if (!retailerId) return Response.json({ error: "Retailer not found" }, { status: 404 });

    const { data, error } = await admin()
      .from("retailer_locations")
      .select("*")
      .eq("retailer_id", retailerId)
      .order("created_at", { ascending: true });

    if (error) return Response.json({ error: error.message }, { status: 400 });
    return Response.json({ data: data ?? [] });
  } catch {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return Response.json({ error: "Not authenticated" }, { status: 401 });

    const retailerId = await getRetailerId(user.id);
    if (!retailerId) return Response.json({ error: "Retailer not found" }, { status: 404 });

    // Enforce max 8 locations
    const { count } = await admin()
      .from("retailer_locations")
      .select("id", { count: "exact", head: true })
      .eq("retailer_id", retailerId);
    if ((count ?? 0) >= MAX_LOCATIONS) {
      return Response.json({ error: `Maximum of ${MAX_LOCATIONS} locations allowed.` }, { status: 400 });
    }

    const body = await req.json();
    const { error, data: newLoc } = await admin()
      .from("retailer_locations")
      .insert({
        retailer_id:         retailerId,
        nickname:            body.nickname            ?? "",
        shipping_address:    body.shipping_address    ?? "",
        license_number:      body.license_number      ?? "",
        license_expiry_date: body.license_expiry_date ?? null,
        license_photo_url:   body.license_photo_url   ?? null,
        status:              "pending",
      })
      .select()
      .single();

    if (error) return Response.json({ error: error.message }, { status: 400 });

    // Notify admin
    if (process.env.RESEND_API_KEY) {
      const { data: retailer } = await admin()
        .from("retailers")
        .select("business_name, contact_name, email")
        .eq("id", retailerId)
        .maybeSingle();
      if (retailer) {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from:    "Leaf Cross Portal <noreply@leafcross.com>",
          to:      "info@leafcross.com",
          subject: `New Location Request — ${retailer.business_name}`,
          text:    `${retailer.contact_name} (${retailer.email}) has submitted a new location for approval.\n\nLocation: ${body.nickname || body.shipping_address}\nShipping Address: ${body.shipping_address}\nLicence Number: ${body.license_number}\n\nPlease log in to the admin portal (Retailers → Location Requests) to approve or reject.`,
        }).catch(() => {});
      }
    }

    return Response.json({ data: newLoc });
  } catch {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return Response.json({ error: "Not authenticated" }, { status: 401 });

    const retailerId = await getRetailerId(user.id);
    if (!retailerId) return Response.json({ error: "Retailer not found" }, { status: 404 });

    const { id, ...fields } = await req.json();
    if (!id) return Response.json({ error: "Missing id" }, { status: 400 });

    // Editing resets location to pending for re-review
    const { error } = await admin()
      .from("retailer_locations")
      .update({ ...fields, status: "pending", reviewer_note: null, updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("retailer_id", retailerId);

    if (error) return Response.json({ error: error.message }, { status: 400 });

    // Notify admin of edit
    if (process.env.RESEND_API_KEY) {
      const { data: retailer } = await admin()
        .from("retailers")
        .select("business_name, contact_name, email")
        .eq("id", retailerId)
        .maybeSingle();
      if (retailer) {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from:    "Leaf Cross Portal <noreply@leafcross.com>",
          to:      "info@leafcross.com",
          subject: `Location Updated — ${retailer.business_name}`,
          text:    `${retailer.contact_name} (${retailer.email}) has updated a location and it requires re-approval.\n\nPlease log in to the admin portal (Retailers → Location Requests) to review.`,
        }).catch(() => {});
      }
    }

    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return Response.json({ error: "Not authenticated" }, { status: 401 });

    const retailerId = await getRetailerId(user.id);
    if (!retailerId) return Response.json({ error: "Retailer not found" }, { status: 404 });

    const { id } = await req.json();
    if (!id) return Response.json({ error: "Missing id" }, { status: 400 });

    const { error } = await admin()
      .from("retailer_locations")
      .delete()
      .eq("id", id)
      .eq("retailer_id", retailerId);

    if (error) return Response.json({ error: error.message }, { status: 400 });
    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
