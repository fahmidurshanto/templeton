/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'https://server.hutchinsonapac.com/api/v1/:path*',
        // destination: 'http://localhost:4000/api/v1/:path*',
      },
    ];
  },
};

export default nextConfig;