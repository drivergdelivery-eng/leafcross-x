import { DashboardLayout } from "@/components/shared/DashboardLayout";
import AccountClient from "@/components/retailer/AccountClient";

const links = [
  { label: "Dashboard",    href: "/retailer" },
  { label: "Product Menu", href: "/retailer/products" },
  { label: "Orders",       href: "/retailer/orders" },
  { label: "Account",      href: "/retailer/account" },
];

export default function RetailerAccountPage() {
  return (
    <DashboardLayout title="My Account" role="retailer" links={links}>
      <AccountClient />
    </DashboardLayout>
  );
}
