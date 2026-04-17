/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: (process.env.API_HOST || process.env.LOCAL_API_HOST) + '/:path*',
      },
    ];
  },
};

export default nextConfig;