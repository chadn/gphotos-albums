/** @type {import('next').NextConfig} */
const nextConfig = {
  logging: {
    fetches: {
      fullUrl: true, // Log the full URL for fetches
      hmrRefreshes: true // Log fetches from HMR cache
    }
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: 'lh3.googleusercontent.com'
      },
    ],
  },
};

export default nextConfig;
