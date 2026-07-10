import { OrdersProvider } from "@/lib/store/ordersContext";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <OrdersProvider>{children}</OrdersProvider>;
}
