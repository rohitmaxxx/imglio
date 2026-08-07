import type { Metadata } from "next";
import CropForm from "@/components/crop/CropForm";

const title = "Crop Image Online Free — Pixel-Accurate Cropping";
const description =
  "Crop any image online for free with pixel-accurate precision. Drag to select the exact area you want, then crop and download instantly. No signup, no watermark.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/crop" },
  openGraph: { title: `${title} | Pixanzo`, description, url: "/crop", type: "website", images: ["/og-image.png"] },
  twitter: { card: "summary_large_image", title: `${title} | Pixanzo`, description, images: ["/og-image.png"] },
};

const softwareAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Pixanzo Image Cropper",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any (runs in any modern web browser)",
  description,
  url: "https://pixanzo.com/crop",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://pixanzo.com/" },
    { "@type": "ListItem", position: 2, name: "Image Tools", item: "https://pixanzo.com/#tools" },
    { "@type": "ListItem", position: 3, name: "Crop Image", item: "https://pixanzo.com/crop" },
  ],
};

export default function CropPage() {
  return (
    <>
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([softwareAppJsonLd, breadcrumbJsonLd]) }} />
      <CropForm />
    </>
  );
}
