import type { StorybookConfig } from '@storybook/react-vite';
import tailwindcssPostcss from '@tailwindcss/postcss';
import path from 'path';

const config: StorybookConfig = {
	stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
	addons: [
		'@storybook/addon-docs',
		'@storybook/addon-vitest',
		'msw-storybook-addon',
	],
	framework: {
		name: '@storybook/react-vite',
		options: {},
	},
	staticDirs: ['../public'],
	typescript: {
		reactDocgen: 'react-docgen-typescript',
		reactDocgenTypescriptOptions: {
			shouldExtractLiteralValuesFromEnum: true,
			shouldRemoveUndefinedFromOptional: true,
			propFilter: (prop) => {
				// Exclude props from generated files
				if (prop.parent?.fileName.includes('.gen.ts')) {
					return false;
				}
				// Exclude props from node_modules except for specific packages
				if (prop.parent?.fileName.includes('node_modules')) {
					return false;
				}
				return true;
			},
		},
	},
	async viteFinal(config) {
		// Configure PostCSS for Tailwind CSS v4
		config.css = config.css || {};
		config.css.postcss = {
			plugins: [tailwindcssPostcss()],
		};

		// Set unique cache directory to prevent conflicts
		config.cacheDir = path.join(
			__dirname,
			'../node_modules/.vite-storybook-sdk',
		);

		// Configure path aliases to match tsconfig.json
		config.resolve = config.resolve || {};
		config.resolve.alias = {
			...config.resolve.alias,
			'@test': path.resolve(__dirname, '../test'),
		};

		// Exclude generated files from react-docgen processing
		if (config.plugins) {
			for (const plugin of config.plugins) {
				if (
					plugin &&
					typeof plugin === 'object' &&
					'name' in plugin &&
					plugin.name === 'storybook:react-docgen-plugin'
				) {
					const originalTransform = plugin.transform;
					if (typeof originalTransform === 'function') {
						plugin.transform = async function (code: string, id: string) {
							// Skip generated files
							if (id.includes('.gen.ts') || id.includes('_internal/api/')) {
								return;
							}
							return originalTransform.call(this, code, id);
						};
					}
					break;
				}
			}
		}

		return config;
	},
};
export default config;
