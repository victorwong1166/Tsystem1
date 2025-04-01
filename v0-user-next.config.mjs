/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'vercel.app'],
  },
  experimental: {
    serverActions: true,
  },
  // 禁用对管理员页面的静态生成
  unstable_staticGeneration: {
    basePath: '/admin',
    exclude: ['**/*'],
  },
};

export default nextConfig;

