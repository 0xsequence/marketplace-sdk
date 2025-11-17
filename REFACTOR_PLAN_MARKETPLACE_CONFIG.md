# Refactor Plan: Marketplace Config Types

**Goal**: Remove duplicate type definitions by importing from API package  
**Impact**: ~29 duplicate field definitions → 0 duplicates  
**Complexity**: Low - straightforward type refactoring

---

## Step 1: Export Types from API Package

**File**: `api/src/index.ts`

**Add these exports** (line 29, after existing builder exports):

```typescript
export type {
  LookupMarketplaceReturn,
  MarketplaceSettings,
  MarketplaceWallet,
  OpenIdProvider,
  // ADD THESE ↓
  MarketCollection,
  ShopCollection,
  MarketplacePage,
  MarketplaceSocials,
  CollectionFilterSettings,
  MetadataFilterRule,
} from './adapters/builder';
```

---

## Step 2: Update SDK Types

**File**: `sdk/src/types/types.ts`

### Before (128 lines):
```typescript
import type {
  ContractType,
  Currency,
  FilterCondition,
  MarketplaceSettings,
  MarketplaceWalletType,
  OpenIdProvider,
  OrderbookKind,
} from '@0xsequence/marketplace-api';
import type { Address } from 'viem';

// Marketplace Configuration
export interface MarketplaceConfig {
  projectId: number;
  settings: MarketplaceSettings;
  market: MarketPage;
  shop: ShopPage;
}

interface MarketplacePage {
  enabled: boolean;
  bannerUrl: string;
  ogImage?: string;
  private: boolean;
}

export interface MarketPage extends MarketplacePage {
  collections: MarketCollection[];
}

export interface ShopPage extends MarketplacePage {
  collections: ShopCollection[];
}

export interface MarketplaceSocials {
  twitter: string;
  discord: string;
  website: string;
  tiktok: string;
  instagram: string;
  youtube: string;
}

interface MarketplaceCollection {
  chainId: number;
  bannerUrl: string;
  itemsAddress: Address;
  filterSettings?: CollectionFilterSettings;
  sortOrder?: number;
  private: boolean;
}

export interface MarketCollection extends MarketplaceCollection {
  cardType: CardType;
  contractType: ContractType;
  feePercentage: number;
  destinationMarketplace: OrderbookKind;
  currencyOptions: Array<string>;
}

export interface ShopCollection extends MarketplaceCollection {
  cardType: CardType;
  saleAddress: Address;
}

// ... wallet config ...

export interface MetadataFilterRule {
  key: string;
  condition: FilterCondition;
  value?: string;
}

export interface CollectionFilterSettings {
  filterOrder: Array<string>;
  exclusions: Array<MetadataFilterRule>;
}
```

### After (~90 lines - 38 lines removed):
```typescript
import type {
  ContractType,
  Currency,
  FilterCondition,
  MarketplaceSettings,
  MarketplaceWalletType,
  OpenIdProvider,
  OrderbookKind,
  // ADD THESE ↓
  MarketCollection as ApiMarketCollection,
  ShopCollection as ApiShopCollection,
  MarketplacePage as ApiMarketplacePage,
  MarketplaceSocials as ApiMarketplaceSocials,
  CollectionFilterSettings as ApiCollectionFilterSettings,
  MetadataFilterRule as ApiMetadataFilterRule,
} from '@0xsequence/marketplace-api';
import type { Address } from 'viem';

// ============================================================================
// Marketplace Configuration
// ============================================================================

export interface MarketplaceConfig {
  projectId: number;
  settings: MarketplaceSettings;
  market: MarketPage;
  shop: ShopPage;
}

// Re-export API types that don't need changes
export type MarketplaceSocials = ApiMarketplaceSocials;
export type CollectionFilterSettings = ApiCollectionFilterSettings;
export type MetadataFilterRule = ApiMetadataFilterRule;

// Extend API MarketplacePage (no changes needed, just re-export with collection arrays)
export interface MarketPage extends ApiMarketplacePage {
  collections: MarketCollection[];
}

export interface ShopPage extends ApiMarketplacePage {
  collections: ShopCollection[];
}

// Extend API types with UI-specific fields and type narrowing
export interface MarketCollection 
  extends Omit<
    ApiMarketCollection, 
    'itemsAddress' | 'contractType' | 'destinationMarketplace'
  > {
  itemsAddress: Address;              // ← Narrow string → viem Address
  contractType: ContractType;         // ← Narrow string → enum
  destinationMarketplace: OrderbookKind; // ← Narrow string → enum
  cardType: CardType;                 // ← UI addition
}

export interface ShopCollection 
  extends Omit<ApiShopCollection, 'itemsAddress' | 'saleAddress'> {
  itemsAddress: Address;              // ← Narrow string → viem Address
  saleAddress: Address;               // ← Narrow string → viem Address
  cardType: CardType;                 // ← UI addition
}

// ... rest unchanged ...
```

---

## Step 3: Verify Transform Code Still Works

**File**: `sdk/src/react/queries/marketplace/config.ts`

**Current code** (lines 40-62):
```typescript
const marketCollections = (
  builderMarketplaceConfig.marketCollections ?? []
).map((collection) => {
  return {
    ...collection,
    contractType: collection.contractType as ContractType,
    destinationMarketplace: collection.destinationMarketplace as OrderbookKind,
    itemsAddress: collection.itemsAddress as Address,
    cardType: 'market',
  } satisfies MarketCollection;
});

const shopCollections = (builderMarketplaceConfig.shopCollections ?? []).map(
  (collection) => {
    return {
      ...collection,
      itemsAddress: collection.itemsAddress as Address,
      saleAddress: collection.saleAddress as Address,
      cardType: 'shop',
    } satisfies ShopCollection;
  },
);
```

**This should continue working** because:
- ✅ Spread operator (`...collection`) copies all API fields
- ✅ Type assertions narrow string → Address, string → enum
- ✅ `cardType` addition still works
- ✅ `satisfies` will validate against new extended type

**No changes needed to transform code** ✅

---

## Step 4: Run Tests

```bash
pnpm test
pnpm build
```

**Expected**: All tests pass, no build errors

---

## Step 5: Update Documentation

Update the audit reports to reflect the fix:

- ✅ `SDK_TYPE_AUDIT_SUMMARY.md` - Change compliance from 92% → 98%
- ✅ `SDK_TYPE_DEFINITIONS_AUDIT.md` - Note the fix in "Marketplace Config" section
- ✅ `MARKETPLACE_CONFIG_TYPES_ISSUE.md` - Mark as resolved

---

## Checklist

- [ ] Step 1: Add exports to `api/src/index.ts`
- [ ] Step 2: Refactor `sdk/src/types/types.ts`
- [ ] Step 3: Verify `sdk/src/react/queries/marketplace/config.ts` (no changes needed)
- [ ] Step 4: Run tests and build
- [ ] Step 5: Update audit documentation
- [ ] Step 6: Commit with message: `refactor: import marketplace config types from API package`

---

## Impact Summary

### Lines Removed: ~38

**From `sdk/src/types/types.ts`**:
- ❌ `interface MarketplacePage { ... }` (4 fields)
- ❌ `interface MarketplaceSocials { ... }` (6 fields)
- ❌ `interface MarketplaceCollection { ... }` (6 fields)
- ❌ `interface MetadataFilterRule { ... }` (3 fields)
- ❌ `interface CollectionFilterSettings { ... }` (2 fields)

### Lines Added: ~15

**To `api/src/index.ts`**:
- ✅ Export 6 additional types (1 line each)

**To `sdk/src/types/types.ts`**:
- ✅ Import 6 types from API (added to import)
- ✅ Re-export 3 unchanged types (3 lines)
- ✅ Extend 2 types with `Omit<>` pattern (~6 lines)

### Net Change: **-23 lines** ✅

---

## Before/After Comparison

### Before: SDK Defines Everything

```
API Package                    SDK Package
├─ MarketCollection (full)    ├─ MarketplaceCollection (base)
├─ ShopCollection (full)      ├─ MarketCollection (extends base)
├─ MarketplacePage            ├─ ShopCollection (extends base)
├─ MarketplaceSocials         ├─ MarketPage (uses MarketCollection[])
├─ CollectionFilterSettings   ├─ ShopPage (uses ShopCollection[])
└─ MetadataFilterRule         ├─ MarketplacePage (duplicate)
                              ├─ MarketplaceSocials (duplicate)
                              ├─ CollectionFilterSettings (duplicate)
                              └─ MetadataFilterRule (duplicate)
```

❌ **29 duplicate field definitions**

### After: SDK Imports and Extends

```
API Package                    SDK Package
├─ MarketCollection (full) ───┼─> imports & extends
├─ ShopCollection (full) ─────┼─> imports & extends
├─ MarketplacePage ───────────┼─> imports & uses
├─ MarketplaceSocials ────────┼─> re-exports
├─ CollectionFilterSettings ──┼─> re-exports
└─ MetadataFilterRule ────────┼─> re-exports
                              │
                              ├─ MarketCollection
                              │  └─ adds: cardType
                              │  └─ narrows: Address, enums
                              ├─ ShopCollection
                              │  └─ adds: cardType
                              │  └─ narrows: Address
                              ├─ MarketPage
                              └─ ShopPage
```

✅ **0 duplicate field definitions**  
✅ **Single source of truth**  
✅ **Clear UI extensions**

---

## Risk Assessment

**Risk**: 🟢 **LOW**

**Why**:
1. Type-only changes (no runtime logic)
2. SDK types extend API types (structural compatibility maintained)
3. Transform code unchanged
4. Tests will catch any type mismatches

**Rollback**: Easy - revert single commit

---

**Ready to implement?** This refactoring will achieve true single-source-of-truth architecture.
