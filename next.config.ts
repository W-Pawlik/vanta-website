import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // The dev overlay badge sits in the bottom-left corner and ends up in
  // screenshots, which instantly reads as "local development" in a portfolio.
  devIndicators: false,
  images: {
    // Photography carries most of this site's visual weight — serve the smallest
    // format the browser accepts. See .agents/08-accessibility-and-performance.md.
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizePackageImports: ['motion', 'gsap'],
  },
}

export default nextConfig
