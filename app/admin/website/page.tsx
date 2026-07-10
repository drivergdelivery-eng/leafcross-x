import { Suspense } from "react";
import WebsiteVisualEditor from "@/components/admin/WebsiteVisualEditor";

export default function AdminWebsitePage() {
  return (
    <Suspense>
      <WebsiteVisualEditor />
    </Suspense>
  );
}
