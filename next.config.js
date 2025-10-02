/** @type {import('next').NextConfig} */
const nextConfig = {
  
  webpack: (config) => {
    // Handle Blockly's dynamic imports
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
    };
    return config;
  },
}

export default nextConfig
