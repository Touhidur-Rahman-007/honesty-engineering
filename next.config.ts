import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export for shared hosting (Hostinger) and Vercel
  output: "export",

  // Trailing slash for static hosting compatibility
  trailingSlash: true,

  // Base path - leave empty for root domain
  // basePath: "",

  // Image optimization disabled for static export
  images: {
    unoptimized: true,
  },

  // Disable type checking during build (run separately)
  typescript: {
    ignoreBuildErrors: false,
  },

  // Production optimizations
  compress: true,

  // Generate source maps for debugging (disable in production if needed)
  productionBrowserSourceMaps: false,

  // Keep config stable for shared hosting builds
};

export default nextConfig;
