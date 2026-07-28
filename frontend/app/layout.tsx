import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import ScrollProgress from "@/components/ScrollProgress";
import { ToastProvider } from "@/components/ToastProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], display: "swap" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "imglio — Free Online Image Resizer, Compressor & Converter",
    template: "%s · imglio",
  },
  description:
    "Resize, compress, crop, rotate, and convert images for free — right in your browser. No signup, no watermarks, with social media presets and exact target file sizes.",
  keywords: ["image resizer", "image compressor", "crop image", "rotate image", "convert image", "resize photo online"],
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: "imglio",
    title: "imglio — Free Online Image Resizer, Compressor & Converter",
    description: "Resize, compress, crop, rotate, and convert images for free — right in your browser.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "imglio — Free Online Image Resizer, Compressor & Converter",
    description: "Resize, compress, crop, rotate, and convert images for free — right in your browser.",
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ScrollProgress />
        <ToastProvider>
          <Header />
          {children}
          <Footer />
          <BackToTop />
        </ToastProvider>
      </body>
    </html>
  );
}
