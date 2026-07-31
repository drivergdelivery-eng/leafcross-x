import { createClient as createServiceClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";
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
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await admin()
      .from("retailer_account_changes")
      .select(`
        id, changes, old_values, status, submitted_at, reviewed_at, reviewer_note,
        retailers(id, business_name, contact_name, email)
      `)
      .order("submitted_at", { ascending: false });

    if (error) {
      if (error.code === "42P01") return Response.json({ error: "SETUP_REQUIRED" }, { status: 500 });
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ data: data ?? [] });
  } catch {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const supabase = await createServerClient();
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

    // Fetch the change record with retailer info
    const { data: changeRaw, error: fetchErr } = await db
      .from("retailer_account_changes")
      .select(`id, status, changes, retailer_id`)
      .eq("id", id)
      .maybeSingle();

    if (fetchErr || !changeRaw) return Response.json({ error: "Change record not found" }, { status: 404 });
    if ((changeRaw as { status: string }).status !== "pending") return Response.json({ error: "Already reviewed" }, { status: 409 });

    // Fetch retailer for email notification
    const { data: retailerRow } = await db
      .from("retailers")
      .select("email, contact_name, business_name")
      .eq("id", (changeRaw as { retailer_id: string }).retailer_id)
      .maybeSingle();

    const change = changeRaw as { id: string; status: string; changes: Record<string, string>; retailer_id: string };

    // Apply the changes to the retailers table if approved
    if (action === "approve") {
      const { error: updateErr } = await db
        .from("retailers")
        .update({ ...change.changes, updated_at: new Date().toISOString() })
        .eq("id", change.retailer_id);
      if (updateErr) return Response.json({ error: updateErr.message }, { status: 500 });
    }

    // Update the change record status
    await db
      .from("retailer_account_changes")
      .update({
        status:        action === "approve" ? "approved" : "rejected",
        reviewed_at:   new Date().toISOString(),
        reviewer_note: reviewer_note || null,
      })
      .eq("id", id);

    // Notify retailer
    const retailer = retailerRow as { email: string; contact_name: string; business_name: string } | null;
    if (retailer && process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const fieldLabels: Record<string, string> = {
        business_license_number: "Cannabis Retail Licence Number",
        license_expiry_date:     "Licence Expiry Date",
      };
      const changeLines = Object.entries(change.changes as Record<string, string>)
        .map(([k, v]) => `  ${fieldLabels[k] ?? k}: ${v}`)
        .join("\n");

      const subject = action === "approve"
        ? "Your account update has been approved — Leaf Cross Biomedical"
        : "Account update requires attention — Leaf Cross Biomedical";

      const text = action === "approve"
        ? `Hi ${retailer.contact_name},\n\nYour compliance information update has been reviewed and approved. The following changes are now active on your account:\n\n${changeLines}\n\nThank you,\nLeaf Cross Biomedical Team`
        : `Hi ${retailer.contact_name},\n\nYour recent compliance information update could not be approved at this time.\n\nProposed changes:\n${changeLines}\n\n${reviewer_note ? `Reason: ${reviewer_note}\n\n` : ""}Please contact us at info@leafcross.com if you have questions.\n\nLeaf Cross Biomedical Team`;

      await resend.emails.send({
        from:    "Leaf Cross Portal <noreply@leafcross.com>",
        to:      retailer.email,
        subject,
        text,
      }).catch(() => {});
    }

    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
