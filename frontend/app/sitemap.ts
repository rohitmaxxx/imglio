import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

// Priority reflects target-keyword importance: home + core editing tools rank highest,
// utility/info pages lower. /login and /signup are excluded — auth pages, see robots.ts.
const routes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "", priority: 1.0, changeFrequency: "weekly" },
  { path: "/compress", priority: 0.9, changeFrequency: "weekly" },
  { path: "/crop", priority: 0.9, changeFrequency: "weekly" },
  { path: "/convert", priority: 0.9, changeFrequency: "weekly" },
  { path: "/rotate", priority: 0.8, changeFrequency: "weekly" },
  { path: "/more", priority: 0.6, changeFrequency: "monthly" },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" },
  { path: "/pricing", priority: 0.5, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.5, changeFrequency: "monthly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
