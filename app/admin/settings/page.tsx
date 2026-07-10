import { AdminSectionPage } from "@/components/admin/AdminSectionPage";

export default function AdminSettingsPage() {
  return (
    <AdminSectionPage
      title="Settings"
      description="Admin-only settings for payment instructions, manager approval permissions, invoice identity, monthly subscription handling, public content, and notification emails."
      items={["Manager approval toggle", "Payment instructions", "GST and shipping", "Monthly subscription", "Email notifications"]}
    />
  );
}
