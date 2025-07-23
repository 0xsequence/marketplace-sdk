#!/usr/bin/env node
import { exec } from 'node:child_process';
import fs from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const execAsync = promisify(exec);
const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * @param {Object} options
 * @param {boolean} options.copyCSS - Whether to copy CSS to dist
 */
export async function generateStyles(options = {}) {
	const copyCSS = options.copyCSS ?? false;

	const sdkPath = join(__dirname, '../sdk/');
	const inputCSSRelative = 'src/styles/index.css';
	const outputTSPath = join(sdkPath, 'src/styles/styles.ts');
	const outputCSSDir = join(sdkPath, 'dist/styles');
	const outputCSSPath = join(outputCSSDir, 'index.css');

	try {
		const { stdout: css } = await execAsync(
			`tailwindcss -i ${inputCSSRelative} -o -`,
			{
				cwd: sdkPath,
			},
		);

		const tsContent = `export const styles = String.raw\`${css}\`;`;

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
