import type { Metadata } from "next";
import CompressForm from "@/components/compress/CompressForm";

const title = "Image Compressor — Compress JPG, PNG & WebP Online Free";
const description =
  "Compress images online for free without losing much quality. Reduce JPG, PNG, and WebP file size instantly, or target an exact size in KB or MB. No signup, no watermark.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/compress" },
  openGraph: { title: `${title} | Pixanzo`, description, url: "/compress", type: "website", images: ["/og-image.png"] },
  twitter: { card: "summary_large_image", title: `${title} | Pixanzo`, description, images: ["/og-image.png"] },
};

const softwareAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Pixanzo Image Compressor",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any (runs in any modern web browser)",
  description,
  url: "https://pixanzo.com/compress",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://pixanzo.com/" },
    { "@type": "ListItem", position: 2, name: "Image Tools", item: "https://pixanzo.com/#tools" },
    { "@type": "ListItem", position: 3, name: "Image Compressor", item: "https://pixanzo.com/compress" },
  ],
};

export default function CompressPage() {
  return (
    <>
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([softwareAppJsonLd, breadcrumbJsonLd]) }} />
      <CompressForm />
    </>
  );
}
