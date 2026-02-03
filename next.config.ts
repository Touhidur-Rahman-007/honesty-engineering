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

  // React compiler for better performance
  reactCompiler: true,

  // Disable type checking during build (run separately)
  typescript: {
    ignoreBuildErrors: false,
  },

  // Production optimizations
  compress: true,

  // Generate source maps for debugging (disable in production if needed)
  productionBrowserSourceMaps: false,

  // Optimize package imports
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },
};

export default nextConfig;
