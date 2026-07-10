import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { adminLinks } from "@/lib/data/adminNav";
import AdminOrdersClient from "@/components/admin/AdminOrdersClient";

export default function AdminOrdersPage() {
  return (
    <DashboardLayout title="Orders" role="admin" links={adminLinks}>
      <AdminOrdersClient />
    </DashboardLayout>
  );
}
