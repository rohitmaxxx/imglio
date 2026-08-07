import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import ScrollProgress from "@/components/ScrollProgress";
import { ToastProvider } from "@/components/ToastProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], display: "swap" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const SITE_NAME = "Pixanzo";
const DEFAULT_TITLE = "Pixanzo — Free Online Image Resizer, Compressor & Converter";
const DEFAULT_DESCRIPTION =
  "Resize, compress, crop, and convert images online for free. A fast, private, browser-based image editor — reduce photo file size in KB or MB, with social media presets, no signup, and no watermark.";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2563eb",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: DEFAULT_TITLE,
    template: "%s | Pixanzo",
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "image resizer",
    "resize image",
    "resize image online",
    "image resize",
    "resize photo",
    "photo resizer",
    "image compressor",
    "compress image",
    "crop image",
    "convert image",
    "resize image in KB",
    "resize image in MB",
    "image editor",
    "resize PNG",
    "resize JPG",
    "resize JPEG",
    "resize WebP",
    "image size reducer",
    "online image tools",
    "free image resizer",
    "free image compressor",
  ],
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: "Resize, compress, crop, and convert images online for free — right in your browser. No signup, no watermarks.",
    url: siteUrl,
    locale: "en_US",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Pixanzo — Free Online Image Resizer, Compressor & Converter" }],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: "Resize, compress, crop, and convert images online for free — right in your browser. No signup, no watermarks.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: siteUrl,
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: siteUrl,
  logo: `${siteUrl}/icon-512.png`,
  description: "Pixanzo builds free, browser-based image tools — resize, compress, crop, and convert images online with no signup and no watermark.",
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: siteUrl,
  description: DEFAULT_DESCRIPTION,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* eslint-disable-next-line react/no-danger */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([organizationJsonLd, websiteJsonLd]) }} />
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
