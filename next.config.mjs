/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  async rewrites() {
    return [
      // Slash'li sitemap URL'sini redirect yerine 200 ile servis etmek için
      {
        source: '/sitemap.xml/',
        destination: '/sitemap.xml',
      },
      // (İsteğe bağlı) robots için de aynı mantık
      {
        source: '/robots.txt/',
        destination: '/robots.txt',
      },
    ];
  },
};

export default nextConfig;
