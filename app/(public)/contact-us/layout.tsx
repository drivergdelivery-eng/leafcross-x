import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Leaf Cross Biomedical",
  description: "Get in touch with the Leaf Cross Biomedical team in Nelson, BC. We're available to answer questions about wholesale, licensing, and partnerships.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
