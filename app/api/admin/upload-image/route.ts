import { createClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function POST(req: Request) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return Response.json({ error: "No file provided" }, { status: 400 });

  const ext  = file.name.split(".").pop() ?? "jpg";
  const name = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const sb   = admin();

  // Ensure bucket exists
  await sb.storage.createBucket("site-images", { public: true }).catch(() => {});

  const { error } = await sb.storage
    .from("site-images")
    .upload(name, file, { contentType: file.type, upsert: false });

  if (error) return Response.json({ error: error.message }, { status: 400 });

  const { data: { publicUrl } } = sb.storage.from("site-images").getPublicUrl(name);
  return Response.json({ url: publicUrl });
}
