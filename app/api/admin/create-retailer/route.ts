import { createClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const { email, password, business, name, type } = await req.json();

    if (!email || !password || !business) {
      return Response.json({ error: "Email, password, and business name are required." }, { status: 400 });
    }
    if (password.length < 8) {
      return Response.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // skip verification email — admin is creating the account
      user_metadata: {
        role: type === "B2B" ? "b2b" : "retailer",
        business,
        name,
      },
    });

    if (error) return Response.json({ error: error.message }, { status: 400 });

    return Response.json({ success: true, userId: data.user?.id });
  } catch {
    return Response.json({ error: "Server error. Please try again." }, { status: 500 });
  }
}
