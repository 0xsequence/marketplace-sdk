#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');

console.log('🔧 Starting dependency resolution and build process...');

// Change to SDK directory
const sdkDir = path.join(__dirname, '..', 'sdk');
process.chdir(sdkDir);

console.log('📦 Getting resolved dependencies from pnpm...');

// Get resolved versions from pnpm
let resolvedDeps;
try {
	const pnpmListOutput = execSync('pnpm list --json', { encoding: 'utf8' });
	resolvedDeps = JSON.parse(pnpmListOutput);
} catch (error) {
	console.error('❌ Failed to get pnpm dependencies:', error.message);
	process.exit(1);
}

// Extract all resolved dependencies
const resolved = resolvedDeps[0].dependencies || {};
const resolvedDev = resolvedDeps[0].devDependencies || {};
const resolvedPeer = resolvedDeps[0].peerDependencies || {};
const allResolved = { ...resolved, ...resolvedDev, ...resolvedPeer };

console.log('📝 Updating package.json with resolved versions...');

// Read and update package.json
const pkgPath = path.join(sdkDir, 'package.json');
let pkg;
try {
	pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
} catch (error) {
	console.error('❌ Failed to read package.json:', error.message);
	process.exit(1);
}

// Keep track of changes
const changes = [];

// Replace all dependency versions with resolved versions
['dependencies', 'devDependencies', 'peerDependencies'].forEach((depType) => {
	if (pkg[depType]) {
		Object.keys(pkg[depType]).forEach((dep) => {
			if (allResolved[dep]) {
				const oldVersion = pkg[depType][dep];
				const newVersion = allResolved[dep].version;
				if (oldVersion !== newVersion) {
					pkg[depType][dep] = newVersion;
					changes.push(`  ${dep}: ${oldVersion} → ${newVersion}`);
				}
			}
		});
	}
});

// Write updated package.json
try {
	fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
	console.log('✅ Updated package.json successfully');

	if (changes.length > 0) {
		console.log('\n📋 Dependency version changes:');
		for (const change of changes) {
			console.log(change);
		}
	} else {
		console.log('ℹ️  No dependency version changes needed');
	}
} catch (error) {
	console.error('❌ Failed to write package.json:', error.message);
	process.exit(1);
}

console.log('\n🏗️  Building the project...');

// Change back to root directory for build
process.chdir(path.join(__dirname, '..'));

// Build the project
try {
	execSync('pnpm run build', { stdio: 'inherit' });
	console.log('✅ Build completed successfully!');
} catch (error) {
	console.error('❌ Build failed:', error.message);
	process.exit(1);
}

console.log('\n🎉 Process completed successfully!');
console.log('📁 Built files are available in sdk/dist/');
