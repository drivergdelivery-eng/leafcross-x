import { RetailerSectionPage } from "@/components/retailer/RetailerSectionPage";

export default function RetailerAccountPage() {
  return (
    <RetailerSectionPage
      title="Account"
      description="Retailers can update profile information and submit license updates for admin or manager verification."
      items={["Business profile", "License expiry", "Billing address", "Shipping address"]}
    />
  );
}
