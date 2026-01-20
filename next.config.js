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
      },
      { 
        protocol: 'http', 
        hostname: '127.0.0.1',
        port: '3050',
      }
    ],
    unoptimized: true,
  },
  experimental: {
    typedRoutes: true
  },
  reactStrictMode: true,
};

export default nextConfig;
