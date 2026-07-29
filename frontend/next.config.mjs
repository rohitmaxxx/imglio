/** @type {import('next').NextConfig} */
const nextConfig = {
  // Produces a self-contained server bundle (only the node_modules actually
  // used are traced in) so the Docker production image doesn't need to ship
  // the full node_modules tree.
  output: "standalone",
};

export default nextConfig;
