import AdminNotifications from "@/components/admin/AdminNotifications";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div style={{ position: "fixed", top: 16, right: 16, zIndex: 100 }}>
        <AdminNotifications />
      </div>
      {children}
    </>
  );
}
