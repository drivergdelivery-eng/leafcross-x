import { createClient as createServiceClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";

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

    const { data: retailer, error } = await admin
      .from("retailers")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) return Response.json({ error: error.message }, { status: 500 });
    if (!retailer) return Response.json({ error: "Account not found" }, { status: 404 });

    const { data: changes } = await admin
      .from("retailer_account_changes")
      .select("id, changes, old_values, status, submitted_at, reviewed_at, reviewer_note")
      .eq("retailer_id", retailer.id)
      .order("submitted_at", { ascending: false })
      .limit(20);

    return Response.json({ data: retailer, changes: changes ?? [] });
  } catch {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

const SELF_SERVICE: (string)[] = [
  "contact_name", "phone", "email", "store_address",
  "billing_address", "shipping_address",
  "primary_purchasing_contact", "payment_contact",
];
const COMPLIANCE: (string)[] = ["business_license_number", "license_expiry_date"];

export async function PUT(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return Response.json({ error: "Not authenticated" }, { status: 401 });

    const body: Record<string, string> = await req.json();
    const admin = adminClient();

    const { data: retailer, error: fetchErr } = await admin
      .from("retailers")
      .select("id, email, business_name, contact_name, business_license_number, license_expiry_date")
      .eq("user_id", user.id)
      .maybeSingle();

    if (fetchErr || !retailer) return Response.json({ error: "Account not found" }, { status: 404 });

    // Split fields
    const selfUpdate: Record<string, string> = {};
    const complianceNew: Record<string, string> = {};
    const complianceOld: Record<string, string> = {};

    for (const [key, value] of Object.entries(body)) {
      const trimmed = String(value).trim();
      if (SELF_SERVICE.includes(key)) {
        selfUpdate[key] = trimmed;
      } else if (COMPLIANCE.includes(key) && trimmed) {
        const oldVal = (retailer as Record<string, unknown>)[key] as string ?? "";
        if (trimmed !== oldVal) {
          complianceNew[key] = trimmed;
          complianceOld[key] = oldVal;
        }
      }
    }

    // Apply self-service immediately
    if (Object.keys(selfUpdate).length > 0) {
      const { error } = await admin
        .from("retailers")
        .update({ ...selfUpdate, updated_at: new Date().toISOString() })
        .eq("id", retailer.id);
      if (error) return Response.json({ error: error.message }, { status: 500 });
    }

    // Queue compliance changes for admin review
    if (Object.keys(complianceNew).length > 0) {
      const { error: insErr } = await admin
        .from("retailer_account_changes")
        .insert({
          retailer_id: retailer.id,
          changes:     complianceNew,
          old_values:  complianceOld,
          status:      "pending",
        });
      if (insErr) return Response.json({ error: insErr.message }, { status: 500 });

      // Notify admin
      if (process.env.RESEND_API_KEY) {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const lines = Object.entries(complianceNew)
          .map(([k, v]) => {
            const label = k === "business_license_number" ? "Licence Number" : "Licence Expiry Date";
            return `  ${label}: ${v} (was: ${complianceOld[k] || "—"})`;
          })
          .join("\n");

        await resend.emails.send({
          from: "Leaf Cross Portal <noreply@leafcross.com>",
          to:   "info@leafcross.com",
          subject: `Compliance Update Request — ${retailer.business_name}`,
          text:  `${retailer.contact_name} (${retailer.email}) has submitted a compliance update requiring admin review.\n\nProposed changes:\n${lines}\n\nPlease log in to the admin portal (Retailers → Account Changes) to review and approve or reject.`,
        }).catch(() => {});
      }
    }

    return Response.json({
      success:            true,
      selfServiceUpdated: Object.keys(selfUpdate).length > 0,
      complianceQueued:   Object.keys(complianceNew).length > 0,
    });
  } catch {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
