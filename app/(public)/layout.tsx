import { AgeGate } from "@/components/public/AgeGate";
import { PublicFooter } from "@/components/public/PublicFooter";
import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicStyles } from "@/components/public/PublicStyles";

export default function PublicLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <PublicStyles />
      <AgeGate />
      <PublicHeader />
      <main>{children}</main>
      <PublicFooter />
    </>
  );
}
