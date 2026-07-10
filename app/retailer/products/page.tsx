import { DashboardLayout } from "@/components/shared/DashboardLayout";
import ProductMenuClient from "@/components/retailer/ProductMenuClient";

const links = [
  { label: "Dashboard",    href: "/retailer" },
  { label: "Product Menu", href: "/retailer/products" },
  { label: "Cart",         href: "/retailer/cart" },
  { label: "Orders",       href: "/retailer/orders" },
  { label: "Account",      href: "/retailer/account" },
];

export default function RetailerProductsPage() {
  return (
    <DashboardLayout title="Product Menu" role="retailer" links={links}>
      <ProductMenuClient />
    </DashboardLayout>
  );
}
