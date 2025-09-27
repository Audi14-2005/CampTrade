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
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
  assetPrefix: 'https://camp-trade.vercel.app',
  // Only include mobile pages
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  // Exclude all non-mobile pages
  experimental: {
    outputFileTracingExcludes: {
      '*': [
        './app/api/**/*',
        './app/seller/**/*',
        './app/checkout/**/*',
        './app/auth/**/*',
        './app/notifications/**/*',
        './app/settings/**/*',
        './app/profile/**/*',
        './app/browse/**/*',
        './app/cart/**/*',
        './app/product/**/*',
        './app/help/**/*',
        './app/privacy/**/*',
        './app/tos/**/*',
        './app/login/**/*',
        './app/signup/**/*',
        './app/splash/**/*',
        './app/page.tsx',
        './app/layout.tsx'
      ]
    }
  }
}

export default nextConfig
