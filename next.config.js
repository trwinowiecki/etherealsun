/** @type {import('next').NextConfig} */
const withTM = require('next-transpile-modules')([
  '@square/web-sdk',
  'react-square-web-payments-sdk',
]);

const nextConfig = withTM({
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    esmExternals: 'loose',
  },
  images: {
    domains: ['items-images-production.s3.us-west-2.amazonaws.com'],
  },
});

module.exports = nextConfig;
