import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { adminLinks } from "@/lib/data/adminNav";
import AdminDashboardCards from "@/components/admin/AdminDashboardCards";

export default function AdminDashboard() {
  return (
    <DashboardLayout title="Admin Panel" role="admin" links={adminLinks}>
      <AdminDashboardCards />
    </DashboardLayout>
  );
}
