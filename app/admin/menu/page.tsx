import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { adminLinks } from "@/lib/data/adminNav";
import MenuManagerClient from "@/components/admin/MenuManagerClient";

export default function AdminMenuPage() {
  return (
    <DashboardLayout title="Update Menu" role="admin" links={adminLinks}>
      <p style={{ margin: "0 0 24px", color: "rgba(0,0,0,0.5)", fontSize: 14 }}>
        Edit prices and toggle product availability. Changes apply to the retailer-facing product menu.
      </p>
      <MenuManagerClient />
    </DashboardLayout>
  );
}
