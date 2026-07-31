import { DashboardLayout } from "@/components/shared/DashboardLayout";
import RetailerDashboardStats from "@/components/retailer/RetailerDashboardStats";
import RetailerGreeting from "@/components/retailer/RetailerGreeting";
import { paymentInstructions } from "@/lib/data/site";

const links = [
  { label: "Dashboard", href: "/retailer" },
  { label: "Product Menu", href: "/retailer/products" },
  { label: "Orders", href: "/retailer/orders" },
  { label: "Account", href: "/retailer/account" }
];

export default function RetailerDashboard() {
  return (
    <DashboardLayout title={<RetailerGreeting />} role="retailer" links={links}>
      <RetailerDashboardStats />
      <section className="card" style={{ marginTop: 24 }}>
        <h2>Payment instructions</h2>
        <p>{paymentInstructions.eTransfer}</p>
        <p>{paymentInstructions.bankWire}</p>
        <p>{paymentInstructions.directDeposit}</p>
        <p>{paymentInstructions.policy}</p>
      </section>
    </DashboardLayout>
  );
}
