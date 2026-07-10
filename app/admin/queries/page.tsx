import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { adminLinks } from "@/lib/data/adminNav";
import QueriesClient from "@/components/admin/QueriesClient";

export default function AdminQueriesPage() {
  return (
    <DashboardLayout title="Queries" role="admin" links={adminLinks}>
      <QueriesClient />
    </DashboardLayout>
  );
}
