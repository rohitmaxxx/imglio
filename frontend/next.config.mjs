/** @type {import('next').NextConfig} */
const nextConfig = {
  // Produces a self-contained server bundle (only the node_modules actually
  // used are traced in) so the Docker production image doesn't need to ship
  // the full node_modules tree.
  output: "standalone",
  // Drops the `X-Powered-By: Next.js` response header (minor perf/security cleanup).
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        // Brand/preview assets are content-hashed by filename only in intent, not by
        // build — cache them long-term but let a hard refresh still pick up changes.
        source: "/:file(og-image.png|icon-192.png|icon-512.png|apple-touch-icon.png|site.webmanifest)",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }],
      },
    ];
  },
};

export default nextConfig;
