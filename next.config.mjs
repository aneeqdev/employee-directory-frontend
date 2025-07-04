/** @type {import('next').NextConfig} */
const nextConfig = {
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
