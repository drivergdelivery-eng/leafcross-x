import { DashboardLayout } from "@/components/shared/DashboardLayout";
import CartClient from "@/components/retailer/CartClient";

const links = [
  { label: "Dashboard",    href: "/retailer" },
  { label: "Product Menu", href: "/retailer/products" },
  { label: "Cart",         href: "/retailer/cart" },
  { label: "Orders",       href: "/retailer/orders" },
  { label: "Account",      href: "/retailer/account" },
];

export default function RetailerCartPage() {
  return (
    <DashboardLayout title="Cart" role="retailer" links={links}>
      <CartClient />
    </DashboardLayout>
  );
}
