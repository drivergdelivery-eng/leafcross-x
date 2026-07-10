import Image from "next/image";
import Link from "next/link";
import { extractedAssets } from "@/lib/data/assets";

export function PublicHeader() {
  return (
    <header className="publicHeader">
      <Link href="/" className="brandMark" aria-label="Leaf Cross Biomedical home">
        <Image src={extractedAssets.logo} alt="" width={138} height={46} priority />
      </Link>
      <nav className="publicNav" aria-label="Main navigation">
        <Link href="/login">Partner Login</Link>
        <Link href="/about">About</Link>
        <Link href="/contact-us">Contact</Link>
      </nav>
      <div className="headerActions" />
    </header>
  );
}
