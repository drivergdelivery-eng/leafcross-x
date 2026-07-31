import { createClient } from "@supabase/supabase-js";

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const get = (key: string) => (formData.get(key) as string | null)?.trim() || null;

    let license_document_path: string | null = null;

    const licenseFile = formData.get("license") as File | null;
    if (licenseFile && licenseFile.size > 0) {
      const ext  = licenseFile.name.split(".").pop() ?? "bin";
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const bytes = await licenseFile.arrayBuffer();

      const { error: uploadErr } = await admin()
        .storage
        .from("retailer-licenses")
        .upload(path, Buffer.from(bytes), { contentType: licenseFile.type, upsert: false });

      if (!uploadErr) {
        const { data: urlData } = admin()
          .storage
          .from("retailer-licenses")
          .getPublicUrl(path);
        license_document_path = urlData.publicUrl;
      }
    }

    const { error } = await admin().from("retailer_applications").insert({
      business_name:           get("business_name"),
      contact_name:            get("contact_name"),
      email:                   get("email"),
      phone:                   get("phone"),
      website:                 get("website") || null,
      business_address:        get("business_address"),
      city:                    get("city"),
      province:                get("province"),
      postal_code:             get("postal_code"),
      country:                 get("country") || "Canada",
      business_license_number: get("business_license_number"),
      license_expiry_date:     get("license_expiry_date") || null,
      notes:                   get("notes") || null,
      license_document_path,
      status:                  "pending",
    });

    if (error) return Response.json({ error: error.message }, { status: 400 });
    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
