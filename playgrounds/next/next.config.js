/** @type {import('next').NextConfig} */
const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin');
const withVanillaExtract = createVanillaExtractPlugin();

const nextConfig = {
	eslint: {
		ignoreDuringBuilds: true,
	},
	transpilePackages: ['@0xsequence/marketplace-sdk'],
};

module.exports = withVanillaExtract(nextConfig);
