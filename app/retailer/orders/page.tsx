import { RetailerSectionPage } from "@/components/retailer/RetailerSectionPage";

export default function RetailerOrdersPage() {
  return (
    <RetailerSectionPage
      title="Orders"
      description="Retailers can view orders and invoices. They can cancel only while the order is unpaid."
      items={["Awaiting payment", "Payment received", "Shipped", "Completed"]}
    />
  );
}
