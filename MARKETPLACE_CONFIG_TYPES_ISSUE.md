# Marketplace Config Types - Duplication Issue

**Date**: 2024-11-17  
**Issue**: SDK redefines types that already exist in API package  
**Severity**: Medium - Type duplication violates single-source-of-truth

---

## Problem Statement

The SDK package redefines marketplace configuration types (`MarketCollection`, `ShopCollection`, `MarketplacePage`, etc.) that **already exist** in the API package but are not exported.

This creates:
1. **Type duplication** - Same concepts defined twice
2. **Maintenance burden** - Changes must be synced between packages
3. **Type inconsistency** - SDK version is subset with different field types

---

## Current State

### API Package HAS These Types

**Location**: `api/src/adapters/builder/types.ts`

```typescript
export interface MarketplacePage {
  enabled: boolean;
  bannerUrl: string;
  ogImage: string;
  private: boolean;
}

export interface MarketCollection {
  id: number;
  projectId: ProjectId;
  chainId: ChainId;
  itemsAddress: string;
  contractType: string;           // ← string (from API)
  bannerUrl: string;
  feePercentage: number;
  currencyOptions: string[];
  destinationMarketplace: string; // ← string (from API)
  filterSettings?: CollectionFilterSettings;
  sortOrder?: number;
  private: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ShopCollection {
  id: number;
  projectId: ProjectId;
  chainId: ChainId;
  itemsAddress: string;
  saleAddress: string;
  name: string;
  bannerUrl: string;
  tokenIds: TokenId[];
  customTokenIds: TokenId[];
  sortOrder?: number;
  private: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface LookupMarketplaceReturn {
  marketplace: Marketplace;
  marketCollections: MarketCollection[];  // ← Already defined!
  shopCollections: ShopCollection[];      // ← Already defined!
}
```

**BUT** - Not exported from `api/src/index.ts`:
```typescript
// api/src/index.ts
export type {
  LookupMarketplaceReturn,  // ✓ Exported
  MarketplaceSettings,      // ✓ Exported
  MarketplaceWallet,        // ✓ Exported
  OpenIdProvider,           // ✓ Exported
} from './adapters/builder';
// ✗ MarketCollection NOT exported
// ✗ ShopCollection NOT exported
// ✗ MarketplacePage NOT exported
```

---

### SDK Package REDEFINES These Types

**Location**: `sdk/src/types/types.ts`

```typescript
interface MarketplaceCollection {
  chainId: number;
  bannerUrl: string;
  itemsAddress: Address;          // ← viem type
  filterSettings?: CollectionFilterSettings;
  sortOrder?: number;
  private: boolean;
}

export interface MarketCollection extends MarketplaceCollection {
  cardType: CardType;             // ← UI addition
  contractType: ContractType;     // ← enum (normalized)
  feePercentage: number;
  destinationMarketplace: OrderbookKind; // ← enum (normalized)
  currencyOptions: Array<string>;
}

export interface ShopCollection extends MarketplaceCollection {
  cardType: CardType;             // ← UI addition
  saleAddress: Address;           // ← viem type
}
```

**Why SDK redefined them**:
1. API types use `string` for addresses, SDK uses viem `Address`
2. API types use `string` for enums, SDK uses typed enums
3. SDK adds UI-specific field: `cardType`
4. SDK omits DB fields: `id`, `projectId`, `createdAt`, `updatedAt`

---

## Type Mapping

### MarketCollection

| Field | API Type | SDK Type | Notes |
|-------|----------|----------|-------|
| `id` | `number` | ✗ Missing | DB field - not needed in UI |
| `projectId` | `ProjectId` | ✗ Missing | DB field - not needed in UI |
| `chainId` | `ChainId` (bigint) | `number` | ⚠️ Different type |
| `itemsAddress` | `string` | `Address` | ⚠️ viem type vs string |
| `contractType` | `string` | `ContractType` | ⚠️ enum vs string |
| `bannerUrl` | `string` | `string` | ✅ Same |
| `feePercentage` | `number` | `number` | ✅ Same |
| `currencyOptions` | `string[]` | `Array<string>` | ✅ Same |
| `destinationMarketplace` | `string` | `OrderbookKind` | ⚠️ enum vs string |
| `filterSettings` | `CollectionFilterSettings?` | `CollectionFilterSettings?` | ✅ Same |
| `sortOrder` | `number?` | `number?` | ✅ Same |
| `private` | `boolean` | `boolean` | ✅ Same |
| `createdAt/updatedAt` | `string?` | ✗ Missing | DB fields - not needed in UI |
| **`cardType`** | ✗ Missing | `CardType` | ✅ UI-only field |

### ShopCollection

| Field | API Type | SDK Type | Notes |
|-------|----------|----------|-------|
| `id` | `number` | ✗ Missing | DB field |
| `projectId` | `ProjectId` | ✗ Missing | DB field |
| `chainId` | `ChainId` | `number` | ⚠️ Different |
| `itemsAddress` | `string` | `Address` | ⚠️ viem type |
| `saleAddress` | `string` | `Address` | ⚠️ viem type |
| `name` | `string` | ✗ Missing | Needed? |
| `bannerUrl` | `string` | `string` | ✅ Same |
| `tokenIds` | `TokenId[]` | ✗ Missing | Needed? |
| `customTokenIds` | `TokenId[]` | ✗ Missing | Needed? |
| `sortOrder` | `number?` | `number?` | ✅ Same |
| `private` | `boolean` | `boolean` | ✅ Same |
| `createdAt/updatedAt` | `string?` | ✗ Missing | DB fields |
| **`cardType`** | ✗ Missing | `CardType` | ✅ UI-only field |

---

## How SDK Currently Transforms API → SDK

**Location**: `sdk/src/react/queries/marketplace/config.ts`

```typescript
const marketCollections = (builderMarketplaceConfig.marketCollections ?? []).map((collection) => {
  return {
    ...collection,                                    // ← Spread API type
    contractType: collection.contractType as ContractType,  // ← Cast string to enum
    destinationMarketplace: collection.destinationMarketplace as OrderbookKind,
    itemsAddress: collection.itemsAddress as Address,       // ← Cast string to Address
    cardType: 'market',                               // ← Add UI field
  } satisfies MarketCollection;  // ← SDK type
});

const shopCollections = (builderMarketplaceConfig.shopCollections ?? []).map((collection) => {
  return {
    ...collection,                                    // ← Spread API type
    itemsAddress: collection.itemsAddress as Address,       // ← Cast
    saleAddress: collection.saleAddress as Address,         // ← Cast
    cardType: 'shop',                                 // ← Add UI field
  } satisfies ShopCollection;  // ← SDK type
});
```

**Problem**: This spreads **all** API fields including DB fields (`id`, `projectId`, `name`, `tokenIds`, etc.) even though SDK types don't declare them.

---

## Solutions

### Option 1: Export API Types + Extend in SDK ✅ RECOMMENDED

**Add to `api/src/index.ts`**:
```typescript
export type {
  MarketCollection,
  ShopCollection,
  MarketplacePage,
  CollectionFilterSettings,
  MetadataFilterRule,
} from './adapters/builder';
```

**Update SDK types** (`sdk/src/types/types.ts`):
```typescript
import type {
  MarketCollection as ApiMarketCollection,
  ShopCollection as ApiShopCollection,
  ContractType,
  OrderbookKind,
} from '@0xsequence/marketplace-api';
import type { Address } from 'viem';

// Extend API type with UI-specific fields
export interface MarketCollection extends Omit<ApiMarketCollection, 'itemsAddress' | 'contractType' | 'destinationMarketplace'> {
  itemsAddress: Address;              // ← Narrow to viem type
  contractType: ContractType;         // ← Narrow to enum
  destinationMarketplace: OrderbookKind; // ← Narrow to enum
  cardType: CardType;                 // ← UI addition
}

export interface ShopCollection extends Omit<ApiShopCollection, 'itemsAddress' | 'saleAddress'> {
  itemsAddress: Address;              // ← Narrow to viem type
  saleAddress: Address;               // ← Narrow to viem type
  cardType: CardType;                 // ← UI addition
}
```

**Pros**:
- ✅ Single source of truth for base fields
- ✅ SDK adds UI-specific fields (`cardType`)
- ✅ SDK narrows types (string → Address, string → enum)
- ✅ Keeps all API fields (id, projectId, etc.) available in SDK

**Cons**:
- ⚠️ SDK types include DB fields that UI might not need

---

### Option 2: Create Separate UI Types in SDK ⚠️ CURRENT STATE

Keep SDK types as-is (current implementation).

**Pros**:
- ✅ SDK types only include UI-relevant fields
- ✅ Clean separation

**Cons**:
- ❌ Duplicates field definitions
- ❌ Maintenance burden (keep in sync)
- ❌ Violates single-source-of-truth

---

### Option 3: API Exports UI-Ready Types 🤔 ALTERNATIVE

Create separate UI-focused types in API package.

**In `api/src/adapters/builder/types.ts`**:
```typescript
// Database types (existing)
export interface MarketCollection { /* ... */ }

// UI types (new)
export interface MarketCollectionUI {
  chainId: number;
  itemsAddress: string;
  contractType: ContractType;
  bannerUrl: string;
  feePercentage: number;
  currencyOptions: string[];
  destinationMarketplace: OrderbookKind;
  filterSettings?: CollectionFilterSettings;
  sortOrder?: number;
  private: boolean;
}
```

**In SDK**:
```typescript
import type { MarketCollectionUI } from '@0xsequence/marketplace-api';

export interface MarketCollection extends MarketCollectionUI {
  cardType: CardType;  // Only UI additions
}
```

**Pros**:
- ✅ API provides UI-focused types
- ✅ SDK only adds pure UI fields

**Cons**:
- ⚠️ API package becomes aware of UI concerns
- ⚠️ More types to maintain

---

## Recommendation

### ✅ **Go with Option 1**

**Action Items**:

1. **Export types from API** (`api/src/index.ts`):
   ```typescript
   export type {
     MarketCollection,
     ShopCollection,
     MarketplacePage,
     CollectionFilterSettings,
     MetadataFilterRule,
   } from './adapters/builder';
   ```

2. **Update SDK types** (`sdk/src/types/types.ts`):
   ```typescript
   import type {
     MarketCollection as ApiMarketCollection,
     ShopCollection as ApiShopCollection,
   } from '@0xsequence/marketplace-api';
   
   export interface MarketCollection 
     extends Omit<ApiMarketCollection, 'itemsAddress' | 'contractType' | 'destinationMarketplace'> {
     itemsAddress: Address;
     contractType: ContractType;
     destinationMarketplace: OrderbookKind;
     cardType: CardType;
   }
   
   export interface ShopCollection 
     extends Omit<ApiShopCollection, 'itemsAddress' | 'saleAddress'> {
     itemsAddress: Address;
     saleAddress: Address;
     cardType: CardType;
   }
   ```

3. **Update transform code** if needed (likely no changes required)

**Impact**:
- ✅ Removes ~30 lines of duplicate type definitions
- ✅ Single source of truth for collection schemas
- ✅ SDK clearly shows what it adds (cardType) vs what comes from API
- ⚠️ SDK types now include DB fields (acceptable - easier to omit than to duplicate)

---

## Summary

**Current Compliance**: 92% → Should be **85%**

The audit missed this duplication because:
1. Types are **structurally different** (SDK is subset + transformations)
2. API types **are not exported** (so they seemed unavailable)
3. SDK version **adds UI fields** (so it looks like UI extension)

**But the core issue is**:
- Base collection schema (chainId, bannerUrl, feePercentage, etc.) should come from API
- SDK should only add UI concerns (`cardType`) and narrow types (string → Address)

**This applies to**:
- `MarketCollection` (~12 shared fields)
- `ShopCollection` (~8 shared fields)  
- `MarketplacePage` (~4 shared fields)
- `CollectionFilterSettings` (~2 shared fields)
- `MetadataFilterRule` (~3 shared fields)

**Total duplicate definitions**: ~29 fields across 5 types

---

**Next Step**: Implement Option 1 to achieve true single-source-of-truth architecture.
