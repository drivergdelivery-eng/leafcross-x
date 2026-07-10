import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { adminLinks } from "@/lib/data/adminNav";
import RetailerApprovalsClient from "@/components/admin/RetailerApprovalsClient";

export default function AdminRetailersPage() {
  return (
    <DashboardLayout title="Retailers / B2B" role="admin" links={adminLinks}>
      <RetailerApprovalsClient />
    </DashboardLayout>
  );
}
