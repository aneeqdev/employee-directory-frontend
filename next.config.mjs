/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "/api/proxy",
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Ensure proper handling of static assets and routing
  trailingSlash: false,
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: 'https://employee-directory-backend.vercel.app/api/v1/:path*',
      },
    ]
  },
}

export default nextConfig
