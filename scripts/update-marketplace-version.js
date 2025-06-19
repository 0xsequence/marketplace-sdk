#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const marketplaceGenPath = join(__dirname, '../sdk/src/react/_internal/api/marketplace.gen.ts');
const sdkPackageJsonPath = join(__dirname, '../sdk/package.json');

try {
  const packageJson = JSON.parse(readFileSync(sdkPackageJsonPath, 'utf-8'));
  const sdkVersion = packageJson.version;
  
  let marketplaceContent = readFileSync(marketplaceGenPath, 'utf-8');
  
  // Simple regex to match the WebrpcHeaderValue line
  const versionLineRegex = /^(export const WebrpcHeaderValue =\s*")([^"]+)(";?)$/m;
  
  const match = marketplaceContent.match(versionLineRegex);
  if (!match) {
    console.error('Could not find WebrpcHeaderValue line in marketplace.gen.ts');
    process.exit(1);
  }
  
  const currentValue = match[2];
  
  // Remove any existing marketplace-sdk version
  const cleanedValue = currentValue.replace(/;marketplace-sdk@[^;]+/, '');
  
  // Append the new marketplace-sdk version
  const newValue = `${cleanedValue};marketplace-sdk@v${sdkVersion}`;
  
  marketplaceContent = marketplaceContent.replace(
    versionLineRegex,
    `$1${newValue}$3`
  );
  
  writeFileSync(marketplaceGenPath, marketplaceContent, 'utf-8');
  
  console.log(`✅ Updated WebrpcHeaderValue with marketplace-sdk@v${sdkVersion}`);
} catch (error) {
  console.error('Error updating marketplace version:', error);
  process.exit(1);
}