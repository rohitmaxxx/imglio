import type { Metadata } from "next";
import Link from "next/link";
import toolCardStyles from "@/components/ToolCard.module.css";
import styles from "@/app/StaticPage.module.css";

const title = "Pricing — 100% Free Image Tools";
const description =
  "Pixanzo's image resizer, compressor, cropper, and converter are completely free to use — no hidden fees, no credit card, no premium tier required.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/pricing" },
  openGraph: { title: `${title} | Pixanzo`, description, url: "/pricing", type: "website", images: ["/og-image.png"] },
  twitter: { card: "summary_large_image", title: `${title} | Pixanzo`, description, images: ["/og-image.png"] },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://pixanzo.com/" },
    { "@type": "ListItem", position: 2, name: "Pricing", item: "https://pixanzo.com/pricing" },
  ],
};

export default function PricingPage() {
  return (
    <main className={toolCardStyles["main-content"]}>
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <div className={toolCardStyles["tool-card"]}>
        <nav className={toolCardStyles["breadcrumbs"]}>
          <Link href="/">HOME</Link>
          <span className={toolCardStyles["sep"]}>&gt;</span>
          <span className={toolCardStyles["current"]}>Pricing</span>
        </nav>

        <div className={toolCardStyles["tool-badge"]}>
          <span className={toolCardStyles["badge-dot"]}></span> INFO
        </div>
        <h1 className={toolCardStyles["tool-title"]}>Pricing Plans</h1>
        <p className={toolCardStyles["tool-desc"]}>Everything you need for free today, with premium features coming soon.</p>

        <div className={styles["plan-grid"]}>
          <div className={styles["plan-card"]}>
            <h2>Free</h2>
            <p>All basic resize, compress, crop, rotate tools at no cost.</p>
            <strong>Always free</strong>
          </div>
          <div className={`${styles["plan-card"]} ${styles["plan-card-highlight"]}`}>
            <h2>Pro</h2>
            <p>Coming soon — faster processing, larger uploads, and priority support.</p>
            <strong>Launch soon</strong>
          </div>
        </div>
      </div>
    </main>
  );
}
