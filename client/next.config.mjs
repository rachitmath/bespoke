/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Disable canvas module resolution for pdfjs client-side usage
    config.resolve.alias.canvas = false;
    config.resolve.fallback = {
      ...config.resolve.fallback,
      canvas: false,
      fs: false,
      path: false,
      crypto: false,
    };
    return config;
  },
};

export default nextConfig;
