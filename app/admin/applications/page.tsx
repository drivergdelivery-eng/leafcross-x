import { AdminSectionPage } from "@/components/admin/AdminSectionPage";

export default function AdminApplicationsPage() {
  return (
    <AdminSectionPage
      title="Retailer applications"
      description="Admin controls whether managers may approve or reject applications. Every application requires license number and expiry date."
      items={["Submitted", "Under review", "Approved", "Rejected"]}
    />
  );
}
