import Image from "next/image";
import Link from "next/link";
import { extractedAssets } from "@/lib/data/assets";
import { PublicStyles } from "@/components/public/PublicStyles";
import SignOutButton from "@/components/auth/SignOutButton";

type DashboardLayoutProps = {
  title: React.ReactNode;
  role: "admin" | "retailer";
  links: Array<{ label: string; href: string }>;
  children: React.ReactNode;
};

export function DashboardLayout({ title, role, links, children }: DashboardLayoutProps) {
  return (
    <>
      <PublicStyles />
      <div className="dashboardShell">
        <aside className="dashboardNav">
          <Image src={extractedAssets.logo} alt="Leaf Cross Biomedical" width={150} height={52} style={{ filter: "brightness(0) invert(1)" }} />
          {links.map((link) => (
            <Link href={link.href} key={link.href}>
              {link.label}
            </Link>
          ))}
          <SignOutButton />
        </aside>
        <main className="dashboardMain">
          <p className="eyebrow">{role} portal</p>
          <h1 className="display" style={{ fontSize: "clamp(34px, 5vw, 62px)" }}>
            {title}
          </h1>
          {children}
        </main>
      </div>
    </>
  );
}
