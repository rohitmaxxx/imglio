import type { Metadata } from "next";
import Link from "next/link";
import toolCardStyles from "@/components/ToolCard.module.css";
import styles from "@/app/StaticPage.module.css";

const title = "More Free Image Tools";
const description = "Explore more free image tools from Pixanzo, including Rotate Image — with meme generation, color picking, and image enlarging coming soon.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/more" },
  openGraph: { title: `${title} | Pixanzo`, description, url: "/more", type: "website", images: ["/og-image.png"] },
  twitter: { card: "summary_large_image", title: `${title} | Pixanzo`, description, images: ["/og-image.png"] },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://pixanzo.com/" },
    { "@type": "ListItem", position: 2, name: "Image Tools", item: "https://pixanzo.com/#tools" },
    { "@type": "ListItem", position: 3, name: "More Tools", item: "https://pixanzo.com/more" },
  ],
};

export default function MorePage() {
  return (
    <main className={toolCardStyles["main-content"]}>
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <div className={toolCardStyles["tool-card"]}>
        <nav className={toolCardStyles["breadcrumbs"]}>
          <Link href="/">HOME</Link>
          <span className={toolCardStyles["sep"]}>&gt;</span>
          <Link href="/#tools">IMAGE TOOLS</Link>
          <span className={toolCardStyles["sep"]}>&gt;</span>
          <span className={toolCardStyles["current"]}>MORE TOOLS</span>
        </nav>

        <div className={toolCardStyles["tool-badge"]}>
          <span className={toolCardStyles["badge-dot"]}></span> TOOL
        </div>
        <h1 className={toolCardStyles["tool-title"]}>More Image Tools</h1>
        <p className={toolCardStyles["tool-desc"]}>Rotate Image is ready to use today, with more free utilities on the way.</p>

        <div className={styles["feature-grid"]}>
          <div className={`${styles["feature-card"]} ${styles["feature-card-disabled"]}`} aria-disabled="true">
            Meme Generator <span className={styles["feature-card-soon"]}>Soon</span>
          </div>
          <div className={`${styles["feature-card"]} ${styles["feature-card-disabled"]}`} aria-disabled="true">
            Color Picker <span className={styles["feature-card-soon"]}>Soon</span>
          </div>
          <Link className={styles["feature-card"]} href="/rotate">
            Rotate Image
          </Link>
          <div className={`${styles["feature-card"]} ${styles["feature-card-disabled"]}`} aria-disabled="true">
            Image Enlarger <span className={styles["feature-card-soon"]}>Soon</span>
          </div>
        </div>
      </div>
    </main>
  );
}
