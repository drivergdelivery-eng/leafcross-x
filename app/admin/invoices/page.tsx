import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { adminLinks } from "@/lib/data/adminNav";
import InvoicesClient from "@/components/admin/InvoicesClient";

export default function AdminInvoicesPage() {
  return (
    <DashboardLayout title="Invoices" role="admin" links={adminLinks}>
      <p style={{ margin: "0 0 28px", color: "rgba(0,0,0,0.5)", fontSize: 14 }}>
        Auto-generated invoices for every order. Grouped by store. Status syncs automatically when you mark an order paid or declined.
      </p>
      <InvoicesClient />
    </DashboardLayout>
  );
}
