import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

/**
 * Extracts directive prologue from source code (e.g., 'use client', 'use server')
 */
function extractDirectives(code: string): string[] {
	const directives: string[] = [];
	const directiveRegex =
		/^(?:\s|\/\/[^\n]*|\/\*[\s\S]*?\*\/)*(['"]use (?:client|server)['"])\s*;?/;

	let remaining = code;
	let match: RegExpExecArray | null = directiveRegex.exec(remaining);

	while (match !== null) {
		directives.push(match[1]);
		remaining = remaining.slice(match[0].length);
		match = directiveRegex.exec(remaining);
	}

	return directives;
}

/**
 * Extracts static import/export sources from code using regex.
 */
function extractImportSources(code: string): string[] {
	const sources: string[] = [];

	// Match: import ... from 'source' or import 'source'
	const importRegex = /import\s+(?:[\s\S]*?\s+from\s+)?['"]([^'"]+)['"]/g;
	let match: RegExpExecArray | null = importRegex.exec(code);
	while (match !== null) {
		sources.push(match[1]);
		match = importRegex.exec(code);
	}

	// Match: export ... from 'source'
	const exportRegex = /export\s+(?:\*|\{[\s\S]*?\})\s+from\s+['"]([^'"]+)['"]/g;
	match = exportRegex.exec(code);
	while (match !== null) {
		sources.push(match[1]);
		match = exportRegex.exec(code);
	}

	return sources;
}

/**
 * Resolves a relative import to an absolute path, trying common extensions.
 */
function resolveImport(source: string, fromFile: string): string | null {
	// Skip external packages
	if (!source.startsWith('.') && !source.startsWith('/')) {
		return null;
	}

	const dir = dirname(fromFile);
	const basePath = resolve(dir, source);

	const extensions = [
		'',
		'.ts',
		'.tsx',
		'.js',
		'.jsx',
		'/index.ts',
		'/index.tsx',
		'/index.js',
		'/index.jsx',
	];

	for (const ext of extensions) {
		const fullPath = basePath + ext;
		try {
			readFileSync(fullPath);
			return fullPath;
		} catch {
			// File doesn't exist, try next extension
		}
	}

	return null;
}

interface ChunkInfo {
	modules: Record<string, unknown>;
	fileName: string;
	facadeModuleId?: string | null;
}

interface RenderChunkResult {
	code: string;
	map: null;
}

// Global state for tracking directives across the build
const moduleDirectives = new Map<string, string[]>();
const moduleDirectImports = new Map<string, string[]>();
const processedModules = new Set<string>();

/**
 * Collects directives from a module and its DIRECT imports only.
 * This allows entry files to inherit directives from their immediate imports
 * (e.g., an index.ts that re-exports from files with 'use client').
 */
function collectDirectivesFromModuleAndDirectImports(
	moduleId: string,
): Set<string> {
	const directives = new Set<string>();

	// Add directives from this module itself
	const moduleDir = moduleDirectives.get(moduleId);
	if (moduleDir) {
		for (const d of moduleDir) {
			directives.add(d);
		}
	}

	// Check DIRECT imports only (one level deep)
	const imports = moduleDirectImports.get(moduleId);
	if (imports) {
		for (const imp of imports) {
			const impDir = moduleDirectives.get(imp);
			if (impDir) {
				for (const d of impDir) {
					directives.add(d);
				}
			}
		}
	}

	return directives;
}

/**
 * Custom plugin to preserve 'use client' and 'use server' directives in tsdown/Rolldown builds.
 *
 * How it works:
 * 1. Scans source files during `load` hook (before TS transformation) to extract directives
 * 2. Tracks direct imports for each module
 * 3. In `renderChunk`, adds directives to chunks that:
 *    - Directly contain modules with directives, OR
 *    - Are entry chunks whose facade module (or its direct imports) has directives
 *
 * This approach requires entry files to explicitly declare 'use client' if they
 * export client-side code, making the intent clear in the source.
 */
export function preserveDirectives() {
	return {
		name: 'preserve-directives',

		buildStart() {
			moduleDirectives.clear();
			moduleDirectImports.clear();
			processedModules.clear();
		},

		load(id: string) {
			if (!id.match(/\.[tj]sx?$/)) return null;
			if (id.includes('node_modules')) return null;
			if (processedModules.has(id)) return null;

			processedModules.add(id);

			try {
				const resolvedPath = resolve(id);
				const code = readFileSync(resolvedPath, 'utf-8');

				// Extract and store directives
				const directives = extractDirectives(code);
				if (directives.length > 0) {
					moduleDirectives.set(id, directives);
				}

				// Extract and store direct imports
				const importSources = extractImportSources(code);
				const resolvedImports: string[] = [];

				for (const source of importSources) {
					const resolved = resolveImport(source, resolvedPath);
					if (resolved) {
						resolvedImports.push(resolved);
					}
				}

				if (resolvedImports.length > 0) {
					moduleDirectImports.set(id, resolvedImports);
				}
			} catch {
				// File might not exist or be readable, skip it
			}

			return null;
		},

		renderChunk(code: string, chunk: ChunkInfo): RenderChunkResult | null {
			const chunkDirectives = new Set<string>();

			// Check modules directly in this chunk
			for (const moduleId of Object.keys(chunk.modules)) {
				const moduleDir = moduleDirectives.get(moduleId);
				if (moduleDir) {
					for (const d of moduleDir) {
						chunkDirectives.add(d);
					}
				}
			}

			// For entry chunks, also check the facade module and its direct imports
			if (chunk.facadeModuleId) {
				const facadeDirectives = collectDirectivesFromModuleAndDirectImports(
					chunk.facadeModuleId,
				);
				for (const d of facadeDirectives) {
					chunkDirectives.add(d);
				}
			}

			if (chunkDirectives.size === 0) {
				return null;
			}

			const directiveString = `${Array.from(chunkDirectives).join('\n')}\n`;
			if (code.trimStart().startsWith(directiveString.trim())) {
				return null;
			}

			return {
				code: `${directiveString}\n${code}`,
				map: null,
			};
		},
	};
}
