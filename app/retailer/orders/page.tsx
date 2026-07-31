import { DashboardLayout } from "@/components/shared/DashboardLayout";
import RetailerOrdersClient from "@/components/retailer/RetailerOrdersClient";

const links = [
  { label: "Dashboard",    href: "/retailer" },
  { label: "Product Menu", href: "/retailer/products" },
  { label: "Orders",       href: "/retailer/orders" },
  { label: "Account",      href: "/retailer/account" },
];

export default function RetailerOrdersPage() {
  return (
    <DashboardLayout title="My Orders" role="retailer" links={links}>
      <RetailerOrdersClient />
    </DashboardLayout>
  );
}
