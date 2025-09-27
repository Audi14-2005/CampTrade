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
  // Only use static export for mobile builds
  ...(process.env.MOBILE_BUILD === 'true' && {
    output: 'export',
    trailingSlash: true,
    distDir: 'out',
    assetPrefix: 'https://camp-trade.vercel.app',
  }),
}

export default nextConfig
