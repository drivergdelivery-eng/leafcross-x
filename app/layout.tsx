import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Leaf Cross Biomedical",
  description:
    "Retailer-only portal for Leaf Cross Biomedical products, applications, ordering, invoices, and payment instructions."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="site-shell">{children}</div>
      </body>
    </html>
  );
}
