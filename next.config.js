/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { 
        protocol: 'https', 
        hostname: 'images.unsplash.com',
      },
      { 
        protocol: 'https', 
        hostname: 'picsum.photos',
      },
      { 
        protocol: 'http', 
        hostname: 'localhost',
        port: '3050',
        pathname: '/uploads/**',
      },
      { 
        protocol: 'http', 
        hostname: '127.0.0.1',
        port: '3050',
        pathname: '/uploads/**',
      }
    ],
    unoptimized: false,
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Improve image loading
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  experimental: {
    typedRoutes: true
  },
  // Suppress hydration warnings from browser extensions
  reactStrictMode: true,
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
};

export default nextConfig;
