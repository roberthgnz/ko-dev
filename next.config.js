/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
}

module.exports = nextConfig
