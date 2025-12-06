# Renaming @0xsequence/api-client

## Problem

The package `@0xsequence/api-client` is confusing because:

1. **It's not the actual Marketplace API backend** - It's a client adapter layer
2. The actual backend service runs at `marketplace-api.sequence.app`
3. The package provides adapters for **multiple** Sequence services:
   - Builder API
   - Indexer API
   - Marketplace API
   - Metadata API

## Suggested Names

### Option 1: `@0xsequence/api-client` (Recommended)
**Pros:**
- Clear that it's a client library
- Generic enough to cover all services
- Simple and straightforward

**Cons:**
- Less specific about what APIs it wraps

### Option 2: `@0xsequence/service-adapters`
**Pros:**
- Accurately describes that it provides adapters
- Distinguishes from backend services

**Cons:**
- Slightly more verbose

### Option 3: `@0xsequence/api-adapters`
**Pros:**
- Similar to Option 2 but shorter
- Clear about adapter pattern

**Cons:**
- Still moderately verbose

### Option 4: `@0xsequence/clients`
**Pros:**
- Very short and simple
- Clearly indicates client libraries

**Cons:**
- Might be confused with wallet clients

## What the Script Does

The `rename-marketplace-api.sh` script will:

1. ✅ Update all `package.json` files to use the new package name
2. ✅ Update all TypeScript imports (`from '@0xsequence/api-client'`)
3. ✅ Update subpath imports (`from '@0xsequence/api-client/mocks/*'`)
4. ✅ Update comments and documentation
5. ✅ Update CHANGELOG references
6. ✅ Update test files
7. ✅ Update generated API files
8. ✅ Update playground files
9. ⚠️ **Preserve** URLs like `marketplace-api.sequence.app` (these are correct!)

## What It DOESN'T Change

The script intentionally **does not** change:

- URLs containing `marketplace-api.sequence.app` - these refer to the actual backend service
- Test handler patterns matching these URLs
- The `pnpm-lock.yaml` file (will be regenerated)

## Usage

### Step 1: Choose a new name

Edit the script variables at the top:

```bash
OLD_NAME="@0xsequence/api-client"
NEW_NAME="@0xsequence/api-client"  # Or your preferred name
```

### Step 2: Run the script

```bash
cd /Users/alex/Developer/work/0xsequence/marketplace-sdk/v2-bigint
./scripts/rename-marketplace-api.sh
```

### Step 3: Review changes

```bash
git diff
```

### Step 4: Optional - Rename directory

If you want to rename the `api` directory:

```bash
git mv api api-client  # Or your preferred directory name
```

Then update `pnpm-workspace.yaml`:

```yaml
packages:
  - 'sdk'
  - 'api-client'  # Update this line
  - 'playgrounds/*'
```

### Step 5: Reinstall and rebuild

```bash
pnpm install
pnpm build
```

### Step 6: Test

```bash
pnpm test
```

### Step 7: Commit

```bash
git add .
git commit -m "Rename @0xsequence/api-client to @0xsequence/api-client

Renames the package to avoid confusion with the actual Sequence 
Marketplace backend API service. This package is a client adapter 
layer for multiple Sequence services (Builder, Indexer, Marketplace, 
Metadata)."
```

## Impact Analysis

**Files to be updated:** ~120+ TypeScript/TSX files

**Breaking change:** Yes - this is a major version change

**Affected areas:**
- SDK package imports
- Playground imports
- Test files
- Documentation
- Internal API service references

## Migration Guide for Users

After this change, users will need to update their imports:

```typescript
// Old
import { Marketplace, Indexer } from '@0xsequence/api-client';

// New
import { Marketplace, Indexer } from '@0xsequence/api-client';
```

## Verification Checklist

After running the script:

- [ ] All imports updated correctly
- [ ] Package builds successfully (`pnpm build`)
- [ ] All tests pass (`pnpm test`)
- [ ] Playgrounds run without errors
- [ ] No references to old package name in code (except URLs)
- [ ] CHANGELOG updated with migration notes
- [ ] README updated if necessary
