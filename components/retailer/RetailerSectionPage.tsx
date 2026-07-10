import { DashboardLayout } from "@/components/shared/DashboardLayout";

const links = [
  { label: "Dashboard", href: "/retailer" },
  { label: "Product Menu", href: "/retailer/products" },
  { label: "Cart", href: "/retailer/cart" },
  { label: "Orders", href: "/retailer/orders" },
  { label: "Account", href: "/retailer/account" }
];

export function RetailerSectionPage({
  title,
  description,
  items
}: {
  title: string;
  description: string;
  items: string[];
}) {
  return (
    <DashboardLayout title={title} role="retailer" links={links}>
      <p className="lead">{description}</p>
      <div className="grid brandGrid" style={{ marginTop: 28 }}>
        {items.map((item) => (
          <article className="card" key={item}>
            <h2>{item}</h2>
          </article>
        ))}
      </div>
    </DashboardLayout>
  );
}
