import type { Metadata } from "next";
import Link from "next/link";
import toolCardStyles from "@/components/ToolCard.module.css";
import styles from "@/app/StaticPage.module.css";

const title = "Image Converter — Convert JPG, PNG & WebP Online Free";
const description =
  "Convert images between JPG, PNG, and WebP for free. Upload an image, pick your export format, and download instantly — no signup, no watermark, no quality loss.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/convert" },
  openGraph: { title: `${title} | Pixanzo`, description, url: "/convert", type: "website", images: ["/og-image.png"] },
  twitter: { card: "summary_large_image", title: `${title} | Pixanzo`, description, images: ["/og-image.png"] },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://pixanzo.com/" },
    { "@type": "ListItem", position: 2, name: "Image Tools", item: "https://pixanzo.com/#tools" },
    { "@type": "ListItem", position: 3, name: "Image Converter", item: "https://pixanzo.com/convert" },
  ],
};

export default function ConvertPage() {
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
          <span className={toolCardStyles["current"]}>IMAGE CONVERTER</span>
        </nav>

        <div className={toolCardStyles["tool-badge"]}>
          <span className={toolCardStyles["badge-dot"]}></span> TOOL
        </div>
        <h1 className={toolCardStyles["tool-title"]}>Image Converter</h1>
        <p className={toolCardStyles["tool-desc"]}>
          Convert images to JPG, PNG, or WebP with a single upload — pick your export format in the Image Resizer&apos;s export settings.
        </p>

        <div className={styles["feature-grid"]}>
          <Link className={styles["feature-card"]} href="/">
            BMP to JPG
          </Link>
          <Link className={styles["feature-card"]} href="/">
            WebP to PNG
          </Link>
          <Link className={styles["feature-card"]} href="/">
            PNG to JPG
          </Link>
          <Link className={styles["feature-card"]} href="/">
            JPG to WebP
          </Link>
        </div>
      </div>
    </main>
  );
}
