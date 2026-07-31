import Link from "next/link";
import { extractedAssets } from "@/lib/data/assets";
import Image from "next/image";

export function PublicFooter() {
  return (
    <footer className="publicFooter">
      <div className="container footerGrid">
        <div>
          <Image src={extractedAssets.logo} alt="Leaf Cross Biomedical" width={220} height={73} style={{ width: 220, height: "auto", objectFit: "contain" }} />
        </div>
        <div>
          <strong>Company</strong>
          <Link href="/about">About</Link>
          <Link href="/brands">Brands</Link>
          <Link href="/services">Services</Link>
        </div>
        <div>
          <strong>Partners</strong>
          <Link href="/retailers">Retailers</Link>
          <Link href="/login">Login</Link>
          <Link href="/contact-us">Contact</Link>
        </div>
        <div>
          <strong>Legal</strong>
          <Link href="/privacy-policy">Privacy Policy</Link>
          <Link href="/terms-of-use">Terms of Use</Link>
        </div>
      </div>
    </footer>
  );
}
