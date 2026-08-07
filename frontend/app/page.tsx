import type { Metadata } from "next";
import ResizeForm from "@/components/resize/ResizeForm";
import HomeHero from "@/components/home/HomeHero";
import ToolCardsSection from "@/components/home/ToolCardsSection";
import HomeStats from "@/components/home/HomeStats";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import FaqPreviewSection from "@/components/home/FaqPreviewSection";
import FinalCtaSection from "@/components/home/FinalCtaSection";
import { getConfig } from "@/services/api";
import type { AppConfig } from "@/types";

const title = "Image Resizer — Resize Images Online Free";
const description =
  "Resize images online for free — by exact pixels, percentage, or a target file size in KB or MB. Fast, private, browser-based image resizer. No signup, no watermark.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: { title: `${title} | Pixanzo`, description, url: "/", type: "website", images: ["/og-image.png"] },
  twitter: { card: "summary_large_image", title: `${title} | Pixanzo`, description, images: ["/og-image.png"] },
};

const softwareAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Pixanzo Image Resizer",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any (runs in any modern web browser)",
  description,
  url: "https://pixanzo.com/",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is Pixanzo really free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Resize, compress, crop, and rotate are free to use with no limits on how often you use them and no account required.",
      },
    },
    {
      "@type": "Question",
      name: "Do you store my uploaded images?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Images are processed in memory and streamed straight back to you as a download — they are never written to disk or kept after your request completes.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need to create an account?",
      acceptedAnswer: { "@type": "Answer", text: "No — every image tool works immediately without signing up." },
    },
    {
      "@type": "Question",
      name: "Can I use Pixanzo on my phone?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. The entire interface is fully responsive and works the same way on mobile, tablet, and desktop browsers.",
      },
    },
  ],
};

export default async function HomePage() {
  const config: AppConfig = await getConfig();

  return (
    <main>
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([softwareAppJsonLd, faqJsonLd]) }} />
      <HomeHero />
      <ResizeForm defaults={config.defaults} socialPresets={config.social_presets} />
      <ToolCardsSection />
      <HomeStats />
      <TestimonialsSection />
      <FaqPreviewSection />
      <FinalCtaSection />
    </main>
  );
}
