import { createClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { alldayProducts, blkProducts, type MenuProduct } from "@/lib/data/menu";

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

async function requireAdmin() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

function toRow(p: MenuProduct & { active?: boolean; sort_order?: number }, idx: number) {
  return {
    slug:          p.slug,
    name:          p.name,
    type:          p.type,
    brand:         p.brand ?? null,
    image:         p.image ?? "",
    images:        p.images ?? [],
    sku:           p.sku ?? null,
    price:         p.price,
    price_per_case: p.pricePerCase ?? null,
    unit:          p.unit ?? "3.5g",
    units_per_case: p.unitsPerCase ?? null,
    inventory:     p.inventory ?? 0,
    max_order_qty: p.maxOrderQty ?? null,
    description:   p.description ?? null,
    package_size:  p.packageSize ?? null,
    status:        p.status ?? "Available",
    terpene1:      p.terpene1 ?? null,
    terpene2:      p.terpene2 ?? null,
    terpene3:      p.terpene3 ?? null,
    thc:           p.thc ?? null,
    cbd:           p.cbd ?? null,
    cbg:           p.cbg ?? null,
    variants:      p.variants ?? [],
    active:        p.active ?? true,
    sort_order:    p.sort_order ?? idx,
    updated_at:    new Date().toISOString(),
  };
}

// GET — return all products (including inactive) for the admin menu manager
export async function GET() {
  const user = await requireAdmin();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await admin()
    .from("menu_products")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) return Response.json({ error: error.message }, { status: 400 });

  if (!data || data.length === 0) {
    return Response.json({ data: [], seeded: false });
  }

  const products = data.map(r => ({
    slug:         r.slug,
    name:         r.name,
    type:         r.type,
    brand:        r.brand ?? "",
    image:        r.image ?? "",
    images:       r.images ?? [],
    sku:          r.sku ?? undefined,
    price:        r.price,
    pricePerCase: r.price_per_case ?? undefined,
    unit:         r.unit ?? "3.5g",
    unitsPerCase: r.units_per_case ?? undefined,
    inventory:    r.inventory ?? 0,
    maxOrderQty:  r.max_order_qty ?? undefined,
    description:  r.description ?? undefined,
    packageSize:  r.package_size ?? undefined,
    status:       r.status ?? "Available",
    terpene1:     r.terpene1 ?? undefined,
    terpene2:     r.terpene2 ?? undefined,
    terpene3:     r.terpene3 ?? undefined,
    thc:          r.thc ?? undefined,
    cbd:          r.cbd ?? undefined,
    cbg:          r.cbg ?? undefined,
    variants:     r.variants ?? [],
    active:       r.active ?? true,
  }));

  return Response.json({ data: products, seeded: true });
}

// PUT — replace the full product list (delete removed products, upsert the rest)
export async function PUT(req: Request) {
  const user = await requireAdmin();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json() as (MenuProduct & { active?: boolean })[];
  if (!Array.isArray(body)) return Response.json({ error: "Expected array" }, { status: 400 });

  const rows = body.map((p, i) => toRow(p, i));
  const incomingSlugs = rows.map(r => r.slug);

  // Delete any products that are no longer in the list
  if (incomingSlugs.length > 0) {
    await admin()
      .from("menu_products")
      .delete()
      .not("slug", "in", `(${incomingSlugs.map(s => `"${s}"`).join(",")})`);
  } else {
    // All products deleted — clear the whole table
    await admin().from("menu_products").delete().neq("slug", "");
  }

  // Upsert what remains
  if (rows.length > 0) {
    const { error } = await admin()
      .from("menu_products")
      .upsert(rows, { onConflict: "slug" });
    if (error) return Response.json({ error: error.message }, { status: 400 });
  }

  return Response.json({ success: true, count: rows.length });
}

// POST — seed DB from the hardcoded static data (first-time setup)
export async function POST() {
  const user = await requireAdmin();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const all = [...alldayProducts, ...blkProducts];
  const rows = all.map((p, i) => toRow({ ...p, active: true }, i));

  const { error } = await admin()
    .from("menu_products")
    .upsert(rows, { onConflict: "slug" });

  if (error) return Response.json({ error: error.message }, { status: 400 });
  return Response.json({ success: true, count: rows.length });
}
