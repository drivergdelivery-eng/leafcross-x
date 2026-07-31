// DISABLED — redirect to home. To restore, replace this file with _brandsPage.tsx contents.
import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";
export default function BrandsPage() {
  redirect("/");
}
