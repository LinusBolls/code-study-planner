/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack:(
        config,
      ) => {
        config.externals = config.externals || {};
        config.externals['react-native-sqlite-storage'] = 'react-native-sqlite-storage';
        config.externals['@sap/hana-client/extension/Stream'] = '@sap/hana-client/extension/Stream';
        config.externals.mysql = 'mysql';
        config.externals.critters = 'critters';

        return config;
      },
};

export default nextConfig;
