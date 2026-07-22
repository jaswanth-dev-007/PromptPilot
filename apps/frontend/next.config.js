/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@promptpilot/ui',
    '@promptpilot/types',
    '@promptpilot/shared',
  ],
}

module.exports = nextConfig
