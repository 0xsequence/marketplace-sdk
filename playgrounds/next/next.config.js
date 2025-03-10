/** @type {import('next').NextConfig} */
const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin');
const withVanillaExtract = createVanillaExtractPlugin();

const nextConfig = {
	transpilePackages: ['@0xsequence/marketplace-sdk'],
};

module.exports = withVanillaExtract(nextConfig);
