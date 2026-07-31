import { createClient } from "@supabase/supabase-js";
import { alldayProducts, blkProducts } from "@/lib/data/menu";

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function GET() {
  try {
    const { data, error } = await admin()
      .from("menu_products")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      // Table not created yet — fall back to static seed data
      return Response.json({
        data:   [...alldayProducts, ...blkProducts],
        source: "static",
      });
    }

    // Map DB row to MenuProduct shape
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

    return Response.json({ data: products, source: "db" });
  } catch {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
