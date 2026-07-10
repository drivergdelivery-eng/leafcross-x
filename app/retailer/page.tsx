import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { paymentInstructions } from "@/lib/data/site";

const links = [
  { label: "Dashboard", href: "/retailer" },
  { label: "Product Menu", href: "/retailer/products" },
  { label: "Cart", href: "/retailer/cart" },
  { label: "Orders", href: "/retailer/orders" },
  { label: "Account", href: "/retailer/account" }
];

export default function RetailerDashboard() {
  return (
    <DashboardLayout title="Retailer dashboard" role="retailer" links={links}>
      <div className="grid statGrid">
        {[
          ["Menu access", "Requires valid license"],
          ["Open orders", "0"],
          ["Payment status", "Before shipment"],
          ["Cancellation", "Allowed while unpaid"]
        ].map(([label, value]) => (
          <article className="card" key={label}>
            <p className="eyebrow">{label}</p>
            <h2>{value}</h2>
          </article>
        ))}
      </div>
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
