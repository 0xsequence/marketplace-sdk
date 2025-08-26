#!/usr/bin/env node
// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require('path');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { execSync } = require('child_process');

const HOOK_CATEGORIES = {
	config: 'Configuration',
	data: 'Data Fetching',
	transactions: 'Transactions',
	ui: 'UI',
	utils: 'Utilities',
	contracts: 'Contracts',
};

// TypeDoc plugin markdown will handle most of the structure,
// but we still want to organize and enhance the generated docs

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

// Function to extract hook description from TSDoc comments
function extractHookDescription(filePath) {
	try {
		const content = fs.readFileSync(filePath, 'utf-8');

		// Look for TSDoc comment before the hook function
		const hookMatch = content.match(
			/\/\*\*\s*([\s\S]*?)\*\/\s*export\s+(?:const|function)\s+use\w+/,
		);
		if (hookMatch) {
			const comment = hookMatch[1];
			// Extract the main description (first paragraph)
			const descMatch = comment.match(
				/^\s*\*?\s*(.+?)(?:\n\s*\*\s*@|\n\s*\*\s*$|$)/,
			);
			if (descMatch) {
				return descMatch[1].replace(/\s*\*\s*/g, ' ').trim();
			}
		}

		// Fallback: look for any comment with description patterns
		const fallbackMatch = content.match(/\/\*\*\s*\n\s*\*\s*(.+?)\s*\n/);
		if (fallbackMatch) {
			return fallbackMatch[1].trim();
		}

		return null;
	} catch (error) {
		return null;
	}
}

// Function to extract detailed hook information from TypeScript files
function extractHookDetails(filePath) {
	try {
		const content = fs.readFileSync(filePath, 'utf-8');
		const details = {
			description: null,
			parameters: [],
			returns: null,
			example: null,
			since: null,
			deprecated: null,
		};

		// Extract full JSDoc comment
		const hookMatch = content.match(
			/\/\*\*\s*([\s\S]*?)\*\/\s*export\s+(?:const|function)\s+(use\w+)/,
		);
		if (!hookMatch) return details;

		const [, comment, hookName] = hookMatch;
		const lines = comment
			.split('\n')
			.map((line) => line.replace(/^\s*\*\s?/, '').trim());

		let currentSection = 'description';
		const description = [];

		for (const line of lines) {
			if (line.startsWith('@param')) {
				currentSection = 'param';
				const paramMatch = line.match(
					/@param\s+(\{[^}]+\})?\s*(\w+)\s*-?\s*(.*)/,
				);
				if (paramMatch) {
					details.parameters.push({
						name: paramMatch[2],
						type: paramMatch[1] || '',
						description: paramMatch[3] || '',
					});
				}
			} else if (line.startsWith('@returns') || line.startsWith('@return')) {
				currentSection = 'returns';
				details.returns = line.replace(/@returns?\s*(\{[^}]+\})?\s*/, '');
			} else if (line.startsWith('@example')) {
				currentSection = 'example';
				details.example = '';
			} else if (line.startsWith('@since')) {
				details.since = line.replace('@since', '').trim();
			} else if (line.startsWith('@deprecated')) {
				details.deprecated = line.replace('@deprecated', '').trim();
			} else if (line.startsWith('@')) {
				currentSection = 'other';
			} else if (line) {
				if (currentSection === 'description') {
					description.push(line);
				} else if (currentSection === 'example') {
					details.example += (details.example ? '\n' : '') + line;
				}
			}
		}

		details.description = description.join(' ').trim();
		return details;
	} catch (error) {
		return {
			description: null,
			parameters: [],
			returns: null,
			example: null,
			since: null,
			deprecated: null,
		};
	}
}

// Function to generate custom MDX documentation
function generateCustomMdxDocs(docsDir) {
	// Create docs directory
	fs.mkdirSync(docsDir, { recursive: true });

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

	// Create category directories
	Object.keys(HOOK_CATEGORIES).forEach((category) => {
		const categoryDir = path.join(docsDir, category);
		fs.mkdirSync(categoryDir, { recursive: true });
	});

	// Generate individual hook documentation
	allHooks.forEach((hook) => {
		generateHookMdx(docsDir, hook);
	});

	// Generate main README
	generateMainReadme(docsDir, allHooks, hooksByCategory);

	// Generate category index files
	Object.entries(hooksByCategory).forEach(([category, hooks]) => {
		if (hooks.length > 0) {
			generateCategoryIndex(docsDir, category, hooks);
		}
	});
}

// Function to generate MDX for individual hooks
function generateHookMdx(docsDir, hook) {
	const details = extractHookDetails(hook.path);
	const categoryName = HOOK_CATEGORIES[hook.category] || 'Other';
	const categoryDir = hook.category === 'root' ? 'other' : hook.category;

	// Generate frontmatter
	const description =
		details.description ||
		`The ${hook.name} hook provides functionality for ${categoryName.toLowerCase()}.`;
	const frontmatter = `---
title: "${hook.name}"
description: "${description.replace(/"/g, '\\"')}"
sidebarTitle: "${hook.name}"
category: "${categoryName}"
---

`;

	let mdxContent = frontmatter + `# ${hook.name}\n\n`;

	// Add deprecation warning if applicable
	if (details.deprecated) {
		mdxContent += `> **⚠️ Deprecated:** ${details.deprecated}\n\n`;
	}

	// Add description
	if (details.description) {
		mdxContent += `${details.description}\n\n`;
	}

	// Add since version if available
	if (details.since) {
		mdxContent += `**Since:** ${details.since}\n\n`;
	}

	// Add parameters section
	if (details.parameters.length > 0) {
		mdxContent += '## Parameters\n\n';
		mdxContent += '| Name | Type | Description |\n';
		mdxContent += '|------|------|-------------|\n';
		details.parameters.forEach((param) => {
			mdxContent += `| \`${param.name}\` | ${param.type} | ${param.description} |\n`;
		});
		mdxContent += '\n';
	}

	// Add returns section
	if (details.returns) {
		mdxContent += `## Returns\n\n${details.returns}\n\n`;
	}

	// Add example section
	if (details.example) {
		mdxContent += `## Example\n\n\`\`\`typescript\n${details.example}\n\`\`\`\n\n`;
	}

	// Add usage section with basic template
	mdxContent += '## Basic Usage\n\n';
	mdxContent += `\`\`\`typescript\nimport { ${hook.name} } from '@0xsequence/marketplace-sdk/react/hooks';\n\n`;
	mdxContent += `const result = ${hook.name}({\n  // Add your parameters here\n});\n\`\`\`\n\n`;

	// Write the file
	const categoryPath = path.join(docsDir, categoryDir);
	fs.mkdirSync(categoryPath, { recursive: true });
	fs.writeFileSync(path.join(categoryPath, `${hook.name}.mdx`), mdxContent);
}

// Main function
async function generateHookDocs() {
	console.log('🚀 Starting enhanced hook documentation generation...');

	const docsDir = path.join(process.cwd(), 'docs', 'hooks');

	// Clean docs directory (TypeDoc will recreate it)
	if (fs.existsSync(docsDir)) {
		fs.rmSync(docsDir, { recursive: true });
	}

	// Generate clean MDX documentation directly
	console.log('📝 Generating custom MDX documentation...');
	try {
		generateCustomMdxDocs(docsDir);
		console.log('✅ Custom MDX generation completed successfully!');
	} catch (error) {
		console.error('❌ Custom generation failed:', error.message);
		return;
	}

	console.log('✅ Enhanced hook documentation generated successfully!');
	console.log(`📁 Documentation available at: ${docsDir}`);

	// Find all hooks for final statistics
	const hooksDir = path.join(process.cwd(), 'src', 'react', 'hooks');
	const allHooks = findHookFiles(hooksDir);

	// Group hooks by category for summary
	const hooksByCategory = {};
	allHooks.forEach((hook) => {
		const category = hook.category === 'root' ? 'other' : hook.category;
		if (!hooksByCategory[category]) {
			hooksByCategory[category] = [];
		}
		hooksByCategory[category].push(hook);
	});

	console.log(`📊 Total hooks documented: ${allHooks.length}`);

	// Show summary
	console.log('\n📋 Summary by category:');
	Object.entries(hooksByCategory).forEach(([category, hooks]) => {
		const categoryName = HOOK_CATEGORIES[category] || 'Other';
		console.log(`   ${categoryName}: ${hooks.length} hooks`);
	});
}

// Function to generate main README
function generateMainReadme(docsDir, allHooks, hooksByCategory) {
	const mdxContent = `---
title: "Marketplace SDK React Hooks"
description: "Comprehensive documentation for all React hooks provided by the Marketplace SDK"
---

# 🚀 Marketplace SDK React Hooks

Welcome to the comprehensive documentation for all React hooks provided by the Marketplace SDK. These hooks provide a powerful and type-safe way to interact with marketplace functionality.

## 🎯 Quick Start

\`\`\`bash
npm install @0xsequence/marketplace-sdk
\`\`\`

\`\`\`typescript
import { useCollectible, useListCollectibles } from '@0xsequence/marketplace-sdk/react/hooks';

// Fetch a single collectible
const { data: collectible, isLoading } = useCollectible({
  chainId: 137,
  collectionAddress: '0x...',
  collectibleId: '123'
});

// List collectibles with filters
const { data: collectibles } = useListCollectibles({
  chainId: 137,
  collectionAddress: '0x...',
  includeEmpty: false
});
\`\`\`

## 📚 Hook Categories

${Object.entries(hooksByCategory)
	.filter(([_, hooks]) => hooks.length > 0)
	.map(([category, hooks]) => {
		const categoryName = HOOK_CATEGORIES[category] || 'Other';
		const categoryDir = category === 'root' ? 'other' : category;
		return `### [${categoryName}](./${categoryDir}/)\n\n${hooks.length} hooks available in this category.\n\n${hooks
			.sort((a, b) => a.name.localeCompare(b.name))
			.map((hook) => `- [${hook.name}](./${categoryDir}/${hook.name}.mdx)`)
			.join('\n')}\n`;
	})
	.join('\n')}

## 📝 Contributing

Found an issue or want to improve the documentation? Please check our [contributing guidelines](../../../CONTRIBUTING.md).

## 📄 License

This documentation is part of the Marketplace SDK project.
`;

	fs.writeFileSync(path.join(docsDir, 'README.mdx'), mdxContent);
}

// Function to generate category index files
function generateCategoryIndex(docsDir, category, hooks) {
	const categoryName = HOOK_CATEGORIES[category] || 'Other';
	const categoryDir = category === 'root' ? 'other' : category;

	let mdxContent = `---
title: "${categoryName} Hooks"
description: "Documentation for ${categoryName.toLowerCase()} hooks in the Marketplace SDK"
---

# ${categoryName} Hooks\n\n`;
	mdxContent += `This category contains ${hooks.length} hooks for ${categoryName.toLowerCase()} functionality.\n\n`;

	// Sort hooks alphabetically
	const sortedHooks = hooks.sort((a, b) => a.name.localeCompare(b.name));

	// Add table of hooks
	mdxContent += '| Hook | Description | Source |\n';
	mdxContent += '|------|-------------|--------|\n';

	sortedHooks.forEach((hook) => {
		const description =
			extractHookDescription(hook.path) || 'No description available';
		const shortDescription =
			description.length > 100
				? description.substring(0, 97) + '...'
				: description;
		mdxContent += `| [${hook.name}](./${hook.name}.mdx) | ${shortDescription} | [Source](../../../${hook.relativePath}) |\n`;
	});

	mdxContent += '\n## Navigation\n\n';
	mdxContent += '- [← Back to All Hooks](../README.mdx)\n';

	// Add links to other categories
	const otherCategories = Object.keys(HOOK_CATEGORIES).filter(
		(cat) => cat !== category,
	);
	if (otherCategories.length > 0) {
		mdxContent += '\n### Other Categories\n\n';
		otherCategories.forEach((cat) => {
			const catName = HOOK_CATEGORIES[cat];
			const catDir = cat === 'root' ? 'other' : cat;
			mdxContent += `- [${catName}](../${catDir}/)\n`;
		});
	}

	const categoryPath = path.join(docsDir, categoryDir);
	fs.mkdirSync(categoryPath, { recursive: true });
	fs.writeFileSync(path.join(categoryPath, 'README.mdx'), mdxContent);
}

// Run the script
generateHookDocs().catch(console.error);
