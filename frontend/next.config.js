/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**picsum.photos",
      },
      {
        protocol: "https",
        hostname: "**unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**amazonaws.com",
      },
    ],
    domains: ["picsum.photos", "fastify.picsum.photos", "amazonaws.com"],
  },
};

module.exports = nextConfig;
