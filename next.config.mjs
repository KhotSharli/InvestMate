/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
      // Add support for .node files
      config.module.rules.push({
        test: /\.node$/,
        use: 'node-loader',
      });
  
      return config;
    },
  }

export default nextConfig;
