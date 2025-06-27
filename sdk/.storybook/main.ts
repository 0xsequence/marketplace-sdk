import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
	stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
	addons: [
		'@storybook/addon-essentials',
		'@storybook/addon-a11y',
		'msw-storybook-addon',
	],
	staticDirs: ['./static'],
	framework: {
		name: '@storybook/react-vite',
		options: {},
	},
	typescript: {
		check: false,
		reactDocgen: 'react-docgen-typescript',
		reactDocgenTypescriptOptions: {
			shouldExtractLiteralValuesFromEnum: true,
			propFilter: (prop) =>
				prop.parent ? !/node_modules/.test(prop.parent.fileName) : true,
		},
	},
	viteFinal: async (config) => {
		config.define = {
			...config.define,
			global: 'globalThis',
			'process.env': {},
		};
		config.resolve = config.resolve || {};
		config.resolve.alias = {
			...config.resolve.alias,
			'@test': new URL('../test', import.meta.url).pathname,
		};
		config.esbuild = {
			...config.esbuild,
			jsx: 'automatic',
		};
		return config;
	},
};

export default config;
