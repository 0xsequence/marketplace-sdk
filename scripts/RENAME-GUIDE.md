# Package Rename Guide: @0xsequence/api-client

## 🎯 Purpose

This guide helps you rename `@0xsequence/api-client` to a clearer name that distinguishes it from the actual Sequence Marketplace backend API service.

## ❓ Why Rename?

The current name `@0xsequence/api-client` is confusing because:

1. **It's not the backend API** - It's a client adapter library
2. The actual backend runs at `marketplace-api.sequence.app` 
3. The package provides adapters for **four different** Sequence services:
   - 🏗️ Builder API
   - 📇 Indexer API  
   - 🏪 Marketplace API
   - 📝 Metadata API

## 📦 Suggested Names

| Name | Pros | Cons | Rating |
|------|------|------|--------|
| **`@0xsequence/api-client`** | Clear, concise, indicates client library | Slightly generic | ⭐⭐⭐⭐⭐ |
| `@0xsequence/service-adapters` | Accurate, describes adapter pattern | More verbose | ⭐⭐⭐⭐ |
| `@0xsequence/api-adapters` | Clear about adapters, shorter | Moderately verbose | ⭐⭐⭐⭐ |
| `@0xsequence/clients` | Very short and simple | Could be confused with wallet clients | ⭐⭐⭐ |

**Recommendation:** `@0xsequence/api-client`

## 🛠️ Tools Provided

### 1. `analyze-rename-impact.sh`
Analyzes the codebase to show what will be affected (read-only).

```bash
./scripts/analyze-rename-impact.sh
```

**Shows:**
- Number of files affected
- Import statement counts
- Test file impacts
- Backend URL references (won't be changed)
- Breakdown by area (SDK, API, Playgrounds)

### 2. `rename-marketplace-api.sh`
The main rename script with dry-run support.

```bash
# See what would be changed (safe, no modifications)
./scripts/rename-marketplace-api.sh --dry-run

# See detailed output
./scripts/rename-marketplace-api.sh --dry-run --verbose

# Actually perform the rename
./scripts/rename-marketplace-api.sh

# Show help
./scripts/rename-marketplace-api.sh --help
```

### 3. `README-RENAME.md`
Detailed documentation about the rename process.

## 🚀 Quick Start

### Step 1: Analyze Impact

```bash
cd /Users/alex/Developer/work/0xsequence/marketplace-sdk/v2-bigint
./scripts/analyze-rename-impact.sh
```

This shows you exactly what will be affected.

### Step 2: Choose New Name

Edit `scripts/rename-marketplace-api.sh` and update:

```bash
OLD_NAME="@0xsequence/api-client"
NEW_NAME="@0xsequence/api-client"  # Your choice here
```

### Step 3: Dry Run

```bash
./scripts/rename-marketplace-api.sh --dry-run --verbose
```

Review what would change without modifying any files.

### Step 4: Execute Rename

```bash
./scripts/rename-marketplace-api.sh
```

When prompted, type `y` to confirm.

### Step 5: Verify & Test

```bash
# Review changes
git diff

# Reinstall dependencies
pnpm install

# Rebuild packages  
pnpm build

# Run tests
pnpm test
```

### Step 6: Optional - Rename Directory

If you want to rename the `api` directory to match:

```bash
# Rename the directory
git mv api api-client

# Update workspace configuration
# Edit pnpm-workspace.yaml and change 'api' to 'api-client'

# Reinstall
pnpm install
```

### Step 7: Commit

```bash
git add .
git commit -m "Rename @0xsequence/api-client to @0xsequence/api-client

Renames the package to avoid confusion with the actual Sequence 
Marketplace backend API service (marketplace-api.sequence.app).

This package is a client adapter layer providing unified access 
to multiple Sequence services: Builder, Indexer, Marketplace, 
and Metadata APIs.

BREAKING CHANGE: Package name changed, users must update imports."
```

## 📋 What Gets Changed

### ✅ Will be changed:
- Package names in `package.json` files
- Import statements: `from '@0xsequence/api-client'`
- Subpath imports: `from '@0xsequence/api-client/mocks/*'`
- Comments and documentation
- Test files
- Generated file headers
- CHANGELOG references

### ❌ Will NOT be changed:
- URLs like `marketplace-api.sequence.app` (these are correct!)
- The `pnpm-lock.yaml` file (will be regenerated)
- `node_modules` directories
- `dist` directories
- `.git` directory

## 📊 Expected Impact

Based on codebase analysis:

- **~120+ files** will be updated
- **~120+ import statements** will be changed
- **~40+ test files** will be updated
- **Backend URLs** preserved (no breaking changes to API endpoints)

## 🔄 Migration for SDK Users

After this rename, users of the SDK will need to update their imports:

### Before:
```typescript
import { 
  Marketplace, 
  Indexer, 
  Metadata,
  Builder 
} from '@0xsequence/api-client';
```

### After:
```typescript
import { 
  Marketplace, 
  Indexer, 
  Metadata,
  Builder 
} from '@0xsequence/api-client';
```

Mock imports also change:

### Before:
```typescript
import { MarketplaceMocks } from '@0xsequence/api-client/mocks/marketplace';
```

### After:
```typescript
import { MarketplaceMocks } from '@0xsequence/api-client/mocks/marketplace';
```

## ⚠️ Important Notes

1. **Breaking Change**: This is a major version change
2. **Backend URLs**: The actual API service URLs (`marketplace-api.sequence.app`) remain unchanged
3. **Testing Required**: Run full test suite after rename
4. **Documentation**: Update any external documentation or README files
5. **Release Notes**: Include migration guide in release notes

## 🆘 Troubleshooting

### Issue: Script won't run
```bash
# Make sure script is executable
chmod +x scripts/rename-marketplace-api.sh
chmod +x scripts/analyze-rename-impact.sh
```

### Issue: sed errors on macOS
The script automatically detects macOS and uses the correct sed syntax.

### Issue: Changes look wrong in dry-run
Use `--verbose` flag to see exactly what will be changed:
```bash
./scripts/rename-marketplace-api.sh --dry-run --verbose
```

### Issue: Some imports still broken after rename
1. Check if you renamed the directory - if so, update `pnpm-workspace.yaml`
2. Run `pnpm install` to regenerate symlinks
3. Clear any build caches: `rm -rf */dist`
4. Rebuild: `pnpm build`

## 📝 Checklist

Before running the script:
- [ ] Run impact analysis
- [ ] Choose new package name  
- [ ] Update script with new name
- [ ] Run dry-run to preview changes
- [ ] Create a backup branch: `git checkout -b rename-marketplace-api`

After running the script:
- [ ] Review changes: `git diff`
- [ ] Check for any missed references
- [ ] Run `pnpm install`
- [ ] Run `pnpm build`  
- [ ] Run `pnpm test`
- [ ] Update external documentation
- [ ] Prepare release notes
- [ ] Commit changes

## 📞 Support

For issues or questions:
1. Review the verbose output: `--verbose` flag
2. Check the analysis output
3. Review changes with `git diff`
4. Consult the team

## 📚 Additional Resources

- `README-RENAME.md` - Detailed rename documentation
- `rename-marketplace-api.sh` - Main rename script
- `analyze-rename-impact.sh` - Impact analysis tool
