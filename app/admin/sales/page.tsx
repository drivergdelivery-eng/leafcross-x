import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { adminLinks } from "@/lib/data/adminNav";
import SalesAnalytics from "@/components/admin/SalesAnalytics";

export default function AdminSalesPage() {
  return (
    <DashboardLayout title="Track Sales" role="admin" links={adminLinks}>
      <p style={{ margin: "0 0 24px", color: "rgba(0,0,0,0.5)", fontSize: 14 }}>
        Sales performance, product rankings, brand comparison, and order history.
      </p>
      <SalesAnalytics />
    </DashboardLayout>
  );
}
