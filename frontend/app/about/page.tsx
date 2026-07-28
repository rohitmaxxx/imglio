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
import TechStackSection from "@/components/about/TechStackSection";
import FaqSection from "@/components/about/FaqSection";
import CtaSection from "@/components/about/CtaSection";

const description =
  "pixanzo is a free, browser-based toolkit for resizing, compressing, cropping, converting, and rotating images — no signup, no watermark, nothing stored.";

export const metadata: Metadata = {
  title: "About Us",
  description,
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About pixanzo",
    description,
    url: "/about",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About pixanzo",
    description,
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About pixanzo",
  description,
  mainEntity: {
    "@type": "Organization",
    name: "pixanzo",
    description,
  },
};

export default function AboutPage() {
  return (
    <div className={styles["about-page"]}>
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <HeroSection />
      <StorySection />
      <MissionVisionSection />
      <WhyChooseSection />
      <FeaturesSection />
      <StatsSection />
      <HowItWorksSection />
      <ValuesSection />
      <TechStackSection />
      <FaqSection />
      <CtaSection />
    </div>
  );
}
