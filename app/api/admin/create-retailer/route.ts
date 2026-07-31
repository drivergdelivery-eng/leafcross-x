import { createClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const { email, password, business, name, type, applicationId } = await req.json();

    if (!email || !password || !business) {
      return Response.json({ error: "Email, password, and business name are required." }, { status: 400 });
    }
    if (password.length < 8) {
      return Response.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    // Pull application data if available (phone, license, address)
    let appData: Record<string, unknown> = {};
    if (applicationId) {
      const { data: app } = await supabaseAdmin
        .from("retailer_applications")
        .select("phone, business_license_number, license_expiry_date, business_address, city, province, postal_code")
        .eq("id", applicationId)
        .maybeSingle();
      if (app) appData = app;
    }

    // Create auth user
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { role: type === "B2B" ? "b2b" : "retailer", business, name },
    });

    if (error) return Response.json({ error: error.message }, { status: 400 });

    const userId = data.user?.id;
    if (!userId) return Response.json({ error: "Failed to get user ID" }, { status: 500 });

    // Create retailers record — include all available application fields
    const shippingAddress = appData.business_address
      ? `${appData.business_address}, ${appData.city ?? ""}, ${appData.province ?? ""} ${appData.postal_code ?? ""}`.trim()
      : null;

    await supabaseAdmin.from("retailers").insert({
      user_id:                 userId,
      application_id:          applicationId || null,
      business_name:           business,
      contact_name:            name || "",
      email:                   email,
      phone:                   (appData.phone as string) || null,
      business_license_number: (appData.business_license_number as string) || null,
      license_expiry_date:     (appData.license_expiry_date as string) || null,
      shipping_address:        shippingAddress,
      status:                  "active",
      approved_at:             new Date().toISOString(),
    });

    return Response.json({ success: true, userId });
  } catch {
    return Response.json({ error: "Server error. Please try again." }, { status: 500 });
  }
}
