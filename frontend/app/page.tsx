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

export const metadata: Metadata = {
  title: "Image Resizer",
  description: "Resize images by exact size, percentage, or social media presets. Export with a target file size in KB or MB.",
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const config: AppConfig = await getConfig();

  return (
    <main>
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
