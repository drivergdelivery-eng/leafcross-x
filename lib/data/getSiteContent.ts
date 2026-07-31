import { createClient } from "@supabase/supabase-js";
import { defaultSiteContent, type SiteContent } from "./siteContent";

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function getSiteContent(): Promise<SiteContent> {
  try {
    const { data } = await admin()
      .from("site_settings")
      .select("content")
      .eq("key", "main")
      .maybeSingle();
    if (data?.content && Object.keys(data.content as object).length > 0) {
      return { ...defaultSiteContent, ...(data.content as Partial<SiteContent>) };
    }
  } catch { /* table not yet created — fall back to defaults */ }
  return defaultSiteContent;
}
