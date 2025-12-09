#!/usr/bin/env node
import fs from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import postcss from 'postcss';
import postcssConfig from './postcss.config.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * @param {Object} options
 * @param {boolean} options.copyCSS - Whether to copy CSS to dist
 */
export async function generateStyles(options = {}) {
	const copyCSS = options.copyCSS ?? false;

	const sdkPath = join(__dirname, './');
	const inputCSSRelative = 'src/styles/index.css';
	const outputTSPath = join(sdkPath, 'src/styles/styles.ts');
	const outputCSSDir = join(sdkPath, 'dist/styles');
	const outputCSSPath = join(outputCSSDir, 'index.css');

	try {
		const inputCSSPath = join(sdkPath, inputCSSRelative);
		const cssContent = await fs.readFile(inputCSSPath, 'utf-8');

		const result = await postcss(postcssConfig.plugins).process(cssContent, {
			from: inputCSSPath,
		});

		const css = `/* Modified Tailwind CSS, to avoid issues with shadow DOM, see Marketplace SDK - compile-tailwind.js and postcss.config.mjs */
${result.css}`;

		const tsContent = `export const styles = String.raw\`${css}\`;\n`;

		await fs.writeFile(outputTSPath, tsContent);

		if (copyCSS) {
			await fs.mkdir(outputCSSDir, { recursive: true });
			await fs.writeFile(outputCSSPath, css);
		}

		console.log('✅ Styles compiled successfully');
		return { css, tsContent };
	} catch (error) {
		console.error('❌ Failed to compile styles:', error.message);
		throw error;
	}
}

// Execute, if run as standalone script
if (import.meta.url === `file://${process.argv[1]}`) {
	generateStyles();
}
