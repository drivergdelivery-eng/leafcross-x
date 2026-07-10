import Link from "next/link";
import { extractedAssets } from "@/lib/data/assets";
import Image from "next/image";

export function PublicFooter() {
  return (
    <footer className="publicFooter">
      <div className="container footerGrid">
        <div>
          <Image src={extractedAssets.logo} alt="Leaf Cross Biomedical" width={154} height={52} />
          <p>
            Health Canada licensed cannabis processor and retailer-only ordering
            partner in Nelson, BC.
          </p>
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
          <Link href="/b2b">B2B</Link>
          <Link href="/login">Partner Login</Link>
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
