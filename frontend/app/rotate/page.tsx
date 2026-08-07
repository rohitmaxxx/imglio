import type { Metadata } from "next";
import RotateForm from "@/components/rotate/RotateForm";

const title = "Rotate Image Online Free — Any Angle";
const description =
  "Rotate your images online for free — left, right, or any custom angle. The canvas automatically expands to fit. Fast, private, and browser-based, no signup required.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/rotate" },
  openGraph: { title: `${title} | Pixanzo`, description, url: "/rotate", type: "website", images: ["/og-image.png"] },
  twitter: { card: "summary_large_image", title: `${title} | Pixanzo`, description, images: ["/og-image.png"] },
};

const softwareAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Pixanzo Image Rotator",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any (runs in any modern web browser)",
  description,
  url: "https://pixanzo.com/rotate",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://pixanzo.com/" },
    { "@type": "ListItem", position: 2, name: "Image Tools", item: "https://pixanzo.com/#tools" },
    { "@type": "ListItem", position: 3, name: "Rotate Image", item: "https://pixanzo.com/rotate" },
  ],
};

export default function RotatePage() {
  return (
    <>
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([softwareAppJsonLd, breadcrumbJsonLd]) }} />
      <RotateForm />
    </>
  );
}
