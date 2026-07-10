import { AdminSectionPage } from "@/components/admin/AdminSectionPage";
import { excludedMedicalProducts, retailerProducts } from "@/lib/data/products";

export default function AdminProductsPage() {
  return (
    <AdminSectionPage
      title="Product management"
      description={`${retailerProducts.length} retailer-safe products are staged from the export. Excluded medical-patient products: ${excludedMedicalProducts.join(", ")}.`}
      items={["Products", "Brands", "Categories", "Availability"]}
    />
  );
}
