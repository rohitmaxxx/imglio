import type { Metadata } from "next";
import styles from "@/components/about/About.module.css";
import HeroSection from "@/components/about/HeroSection";
import StorySection from "@/components/about/StorySection";
import MissionVisionSection from "@/components/about/MissionVisionSection";
import WhyChooseSection from "@/components/about/WhyChooseSection";
import FeaturesSection from "@/components/about/FeaturesSection";
import StatsSection from "@/components/about/StatsSection";
import HowItWorksSection from "@/components/about/HowItWorksSection";
import ValuesSection from "@/components/about/ValuesSection";
import FaqSection from "@/components/about/FaqSection";
import CtaSection from "@/components/about/CtaSection";

const description =
  "Pixanzo is a free, browser-based image editor for resizing, compressing, cropping, converting, and rotating images — no signup, no watermark, nothing stored.";

export const metadata: Metadata = {
  title: "About Pixanzo — Free Online Image Editor",
  description,
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Pixanzo — Free Online Image Editor",
    description,
    url: "/about",
    type: "website",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Pixanzo — Free Online Image Editor",
    description,
    images: ["/og-image.png"],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About Pixanzo",
  description,
  mainEntity: {
    "@type": "Organization",
    name: "Pixanzo",
    description,
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://pixanzo.com/" },
    { "@type": "ListItem", position: 2, name: "About", item: "https://pixanzo.com/about" },
  ],
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
      name: "What image formats are supported?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "PNG, JPG/JPEG, GIF, WebP, BMP, and TIFF are all supported for upload, with JPG, PNG, and WebP available as export formats.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need to create an account?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No — every image tool works immediately without signing up. An account is only needed for optional future features.",
      },
    },
    {
      "@type": "Question",
      name: "Is there a file size limit?",
      acceptedAnswer: { "@type": "Answer", text: "There's no artificial cap on upload size. Very large images simply take a little longer to process." },
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

export default function AboutPage() {
  return (
    <div className={styles["about-page"]}>
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([structuredData, breadcrumbJsonLd, faqJsonLd]) }} />
      <HeroSection />
      <StorySection />
      <MissionVisionSection />
      <WhyChooseSection />
      <FeaturesSection />
      <StatsSection />
      <HowItWorksSection />
      <ValuesSection />
      <FaqSection />
      <CtaSection />
    </div>
  );
}
