#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const HOOK_CATEGORIES = {
	config: 'Configuration',
	data: 'Data Fetching',
	transactions: 'Transactions',
	ui: 'UI',
	utils: 'Utilities',
	contracts: 'Contracts',
};

// Helper function to find all hook files
function findHookFiles(dir, category = 'root') {
	const hooks = [];
	const files = fs.readdirSync(dir);

	for (const file of files) {
		const filePath = path.join(dir, file);
		const stat = fs.statSync(filePath);

		if (stat.isDirectory() && !file.startsWith('_')) {
			// If it's a known category directory, use it as the category
			const newCategory = HOOK_CATEGORIES[file] ? file : category;
			hooks.push(...findHookFiles(filePath, newCategory));
		} else if (
			(file.endsWith('.tsx') || file.endsWith('.ts')) &&
			file.startsWith('use') &&
			!file.includes('.test.') &&
			file !== 'index.ts'
		) {
			const hookName = file.replace(/\.(tsx?|js)$/, '');
			hooks.push({
				name: hookName,
				category: category,
				path: filePath,
				relativePath: path.relative(path.join(process.cwd(), 'src'), filePath),
			});
		}
	}

	return hooks;
}

// Main function
async function generateHookDocs() {
	console.log('🚀 Starting hook documentation generation...');

	const docsDir = path.join(process.cwd(), 'docs', 'hooks');

	// Clean and create docs directory
	if (fs.existsSync(docsDir)) {
		fs.rmSync(docsDir, { recursive: true });
	}
	fs.mkdirSync(docsDir, { recursive: true });

	// Create category directories
	Object.keys(HOOK_CATEGORIES).forEach((category) => {
		const categoryDir = path.join(docsDir, category);
		if (!fs.existsSync(categoryDir)) {
			fs.mkdirSync(categoryDir, { recursive: true });
		}
	});

	// Run TypeDoc to generate documentation
	console.log('📝 Running TypeDoc...');
	try {
		execSync('npx typedoc', { stdio: 'inherit' });
	} catch (error) {
		console.error('❌ TypeDoc failed:', error.message);
		// Continue anyway to organize what we can
	}

	// Find all hooks
	const hooksDir = path.join(process.cwd(), 'src', 'react', 'hooks');
	const allHooks = findHookFiles(hooksDir);

	// Group hooks by category
	const hooksByCategory = {};
	allHooks.forEach((hook) => {
		const category = hook.category === 'root' ? 'other' : hook.category;
		if (!hooksByCategory[category]) {
			hooksByCategory[category] = [];
		}
		hooksByCategory[category].push(hook);
	});

	// Create main README
	let mainReadme = '# Marketplace SDK React Hooks Documentation\n\n';
	mainReadme +=
		'This directory contains documentation for all React hooks provided by the Marketplace SDK.\n\n';
	mainReadme += '## Table of Contents\n\n';

	// Add table of contents
	Object.entries(hooksByCategory).forEach(([category, hooks]) => {
		if (hooks.length === 0) return;
		const categoryName = HOOK_CATEGORIES[category] || 'Other';
		mainReadme += `- [${categoryName}](#${categoryName.toLowerCase().replace(/\s+/g, '-')})\n`;
	});

	mainReadme += '\n---\n\n';

	// Add hook listings by category
	Object.entries(hooksByCategory).forEach(([category, hooks]) => {
		if (hooks.length === 0) return;

		const categoryName = HOOK_CATEGORIES[category] || 'Other';
		mainReadme += `## ${categoryName}\n\n`;

		hooks.sort((a, b) => a.name.localeCompare(b.name));

		hooks.forEach((hook) => {
			// Try to find generated documentation
			const possibleDocPaths = [
				path.join(docsDir, 'functions', `${hook.name}.md`),
				path.join(
					docsDir,
					'modules',
					`react_hooks_${category}_${hook.name}.md`,
				),
				path.join(docsDir, `${category}`, `${hook.name}.md`),
			];

			let docPath = null;
			for (const p of possibleDocPaths) {
				if (fs.existsSync(p)) {
					docPath = p;
					break;
				}
			}

			if (docPath) {
				const relativePath = path.relative(docsDir, docPath);
				mainReadme += `### [${hook.name}](./${relativePath})\n\n`;

				// Try to extract description from the generated doc
				try {
					const docContent = fs.readFileSync(docPath, 'utf-8');
					const descMatch = docContent.match(
						/## (?:Description|Summary)\s*\n\n(.*?)(?:\n\n|$)/s,
					);
					if (descMatch && descMatch[1]) {
						mainReadme += `${descMatch[1].trim()}\n\n`;
					}
				} catch (e) {
					// Ignore errors
				}
			} else {
				mainReadme += `### ${hook.name}\n\n`;
				mainReadme += '*Documentation pending*\n\n';
			}

			mainReadme += `**Source:** \`${hook.relativePath}\`\n\n`;
		});
	});

	// Add usage examples section
	mainReadme += '## Usage Example\n\n';
	mainReadme += '```typescript\n';
	mainReadme += `import { useCollectible, useListCollectibles } from '@0xsequence/marketplace-sdk/react/hooks';\n\n`;
	mainReadme += '// Fetch a single collectible\n';
	mainReadme += 'const { data: collectible, isLoading } = useCollectible({\n';
	mainReadme += '  chainId: 137,\n';
	mainReadme += "  collectionAddress: '0x...',\n";
	mainReadme += "  collectibleId: '123'\n";
	mainReadme += '});\n\n';
	mainReadme += '// List collectibles with filters\n';
	mainReadme += 'const { data: collectibles } = useListCollectibles({\n';
	mainReadme += '  chainId: 137,\n';
	mainReadme += "  collectionAddress: '0x...',\n";
	mainReadme += '  includeEmpty: false\n';
	mainReadme += '});\n';
	mainReadme += '```\n';

	// Write main README
	fs.writeFileSync(path.join(docsDir, 'README.md'), mainReadme);

	console.log('✅ Hook documentation generated successfully!');
	console.log(`📁 Documentation available at: ${docsDir}`);
	console.log(`📊 Total hooks documented: ${allHooks.length}`);

	// Show summary
	console.log('\n📋 Summary by category:');
	Object.entries(hooksByCategory).forEach(([category, hooks]) => {
		const categoryName = HOOK_CATEGORIES[category] || 'Other';
		console.log(`   ${categoryName}: ${hooks.length} hooks`);
	});
}

// Run the script
generateHookDocs().catch(console.error);
