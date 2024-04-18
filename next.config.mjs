/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals = config.externals || {};

    config.externals["react-native-sqlite-storage"] = "{}";
    config.externals["@sap/hana-client/extension/Stream"] = "{}";
    config.externals.mysql = "{}";
    config.externals.critters = "{}";

    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "prod-code-uploads.s3.eu-central-1.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
