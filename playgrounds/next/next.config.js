/** @type {import('next').NextConfig} */

const nextConfig = {
	eslint: {
		ignoreDuringBuilds: true,
	},
	transpilePackages: ['@0xsequence/marketplace-sdk'],
};

module.exports = nextConfig;
