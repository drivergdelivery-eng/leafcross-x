import { DashboardLayout } from "@/components/shared/DashboardLayout";

const links = [
  { label: "Dashboard", href: "/admin" },
  { label: "Applications", href: "/admin/applications" },
  { label: "Retailers", href: "/admin/retailers" },
  { label: "Products", href: "/admin/products" },
  { label: "Orders", href: "/admin/orders" },
  { label: "Invoices", href: "/admin/invoices" },
  { label: "Settings", href: "/admin/settings" }
];

export function AdminSectionPage({
  title,
  description,
  items
}: {
  title: string;
  description: string;
  items: string[];
}) {
  return (
    <DashboardLayout title={title} role="admin" links={links}>
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
