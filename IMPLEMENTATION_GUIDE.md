# Marketplace SDK - Implementation Guide

**Date:** October 22, 2025  
**Branch:** `inventory`  
**Goal:** Reorganize SDK for self-documenting names and clear domain separation

---

## 🎯 Core Principle

**Every hook name must be completely self-documenting.**

You should understand what a hook does by reading ONLY its name, without knowing:
- What file it's in
- What folder it's in
- Any other context

**Key insight:** Users import hooks by name (e.g., `useCollectibleBalance`), not file paths. The hook name must include the domain, even if the file name is simple (e.g., `balance.ts`).

---

## 📁 Exact Folder Structure

### Current Structure (BEFORE)

```
sdk/src/react/
├── queries/
│   ├── checkout/
│   │   ├── market-checkout-options.ts ✅
│   │   └── primary-sale-checkout-options.ts ⚠️ RENAME TO market
│   ├── collectible/
│   │   ├── balance.ts ✅
│   │   ├── metadata.ts ✅
│   │   ├── token-balances.ts ✅
│   │   ├── market-activities.ts ✅
│   │   ├── market-count.ts ⚠️
│   │   ├── market-highest-offer.ts ✅
│   │   ├── market-list.ts ✅
│   │   ├── market-list-paginated.ts ✅
│   │   ├── market-listings.ts ✅
│   │   ├── market-listings-count.ts ✅
│   │   ├── market-lowest-listing.ts ✅
│   │   ├── market-offers.ts ✅
│   │   ├── market-offers-count.ts ✅
│   │   ├── primary-sale-list.ts ❌ WRONG DOMAIN
│   │   └── primary-sale-list-count.ts ❌ WRONG DOMAIN
│   ├── collection/
│   │   ├── balance-details.ts ✅
│   │   ├── list.ts ✅
│   │   ├── metadata.ts ✅
│   │   ├── market-activities.ts ✅
│   │   ├── market-collection-detail.ts ⚠️ REDUNDANT NAME
│   │   ├── market-filtered-count.ts ⚠️ AMBIGUOUS
│   │   ├── market-floor.ts ✅
│   │   ├── market-items.ts ✅
│   │   ├── market-items-count.ts ✅
│   │   └── market-items-paginated.ts ✅
│   ├── currency/
│   │   ├── compare-prices.ts ✅
│   │   ├── convert-to-usd.ts ✅
│   │   ├── currency.ts ✅
│   │   └── list.ts ✅
│   ├── inventory/
│   │   └── inventory.ts ✅
│   ├── marketplace/
│   │   ├── config.ts ✅
│   │   └── filters.ts ✅
│   └── token/
│       ├── balances.ts ✅
│       ├── metadata.ts ✅
│       ├── metadata-search.ts ✅
│       ├── ranges.ts ✅
│       └── supplies.ts ✅
│
└── hooks/
    ├── checkout/
    │   ├── market-checkout-options.tsx ✅
    │   └── primary-sale-checkout-options.tsx ⚠️ RENAME TO market
    ├── collectible/
    │   ├── balance.tsx ✅
    │   ├── metadata.tsx ✅
    │   ├── token-balances.tsx ✅
    │   ├── market-activities.tsx ✅
    │   ├── market-count.tsx ⚠️
    │   ├── market-highest-offer.tsx ✅
    │   ├── market-list.tsx ✅
    │   ├── market-list-paginated.tsx ✅
    │   ├── market-listings.tsx ✅
    │   ├── market-listings-count.tsx ✅
    │   ├── market-lowest-listing.tsx ✅
    │   ├── market-offers.tsx ✅
    │   ├── market-offers-count.tsx ✅
    │   ├── primary-sale-list.tsx ❌ WRONG DOMAIN
    │   └── primary-sale-list-count.tsx ❌ WRONG DOMAIN
    ├── collection/
    │   ├── list.tsx ✅
    │   ├── metadata.tsx ✅
    │   ├── market-activities.tsx ✅
    │   └── market-items.tsx ✅
    ├── currency/
    │   ├── compare-prices.tsx ✅
    │   ├── convert-to-usd.tsx ✅
    │   ├── currency.tsx ✅
    │   └── list.tsx ✅
    ├── inventory/
    │   └── inventory.tsx ✅
    ├── marketplace/
    │   └── list-card-data.tsx ❌ WRONG LOCATION (UI-specific)
    ├── token/
    │   └── balances.tsx ✅
    ├── transactions/
    │   ├── useCancelOrder.tsx ✅
    │   ├── useGenerateCancelTransaction.tsx ✅
    │   ├── useGenerateListingTransaction.tsx ✅
    │   ├── useGenerateOfferTransaction.tsx ✅
    │   └── useGenerateSellTransaction.tsx ✅
    ├── utils/
    │   ├── useAutoSelectFeeOption.tsx ✅ (true utility)
    │   ├── useEnsureCorrectChain.ts ✅ (true utility)
    │   ├── useGetReceiptFromHash.tsx ✅ (true utility)
    │   ├── useRoyalty.tsx ✅ (true utility)
    │   ├── useCheckoutOptions.tsx ❌ WRONG LOCATION
    │   ├── useCheckoutOptionsSalesContract.tsx ❌ WRONG LOCATION
    │   ├── useComparePrices.tsx ❌ WRONG LOCATION
    │   └── useConvertPriceToUSD.tsx ❌ WRONG LOCATION
    ├── data/
    │   ├── inventory/
    │   │   └── useInventory.tsx ❌ DUPLICATE
    │   └── primary-sales/
    │       ├── useGetCountOfPrimarySaleItems.tsx ❌ WRONG LOCATION
    │       ├── useList1155ShopCardData.tsx ❌ UI-SPECIFIC (depends on card components)
    │       └── useList721ShopCardData.tsx ❌ UI-SPECIFIC (depends on card components)
    ├── ui/
    │   └── useFilterState.tsx ❌ DEPENDS ON NUQS (optional dependency)
    └── _deprecated/
        └── index.ts ✅ (backward compatibility)
```

---

### Proposed Structure (AFTER)

```
sdk/src/react/
├── queries/
│   ├── checkout/
│   │   ├── market-checkout-options.ts ✅
│   │   └── primary-sale-checkout-options.ts ✅ RENAMED from shop-checkout-options.ts
│   │
│   ├── collectible/
│   │   ├── balance.ts ✅
│   │   ├── metadata.ts ✅
│   │   ├── token-balances.ts ✅
│   │   ├── market-activities.ts ✅
│   │   ├── market-highest-offer.ts ✅
│   │   ├── market-list.ts ✅
│   │   ├── market-list-paginated.ts ✅
│   │   ├── market-listings.ts ✅
│   │   ├── market-listings-count.ts ✅
│   │   ├── market-lowest-listing.ts ✅
│   │   ├── market-offers.ts ✅
│   │   ├── market-offers-count.ts ✅
│   │   ├── primary-sale-items.ts ✅ RENAMED from primary-sale-list.ts
│   │   └── primary-sale-items-count.ts ✅ RENAMED from primary-sale-list-count.ts
│   │
│   ├── collection/
│   │   ├── balance-details.ts ✅
│   │   ├── list.ts ✅
│   │   ├── metadata.ts ✅
│   │   ├── market-activities.ts ✅
│   │   ├── market-detail.ts ✅ RENAMED from market-collection-detail.ts
│   │   ├── market-floor.ts ✅
│   │   ├── market-items.ts ✅
│   │   ├── market-items-count.ts ✅
│   │   └── market-items-paginated.ts ✅
│   │
│   ├── currency/
│   │   ├── compare-prices.ts ✅
│   │   ├── convert-to-usd.ts ✅
│   │   ├── currency.ts ✅
│   │   └── list.ts ✅
│   │
│   ├── inventory/
│   │   └── inventory.ts ✅
│   │
│   ├── marketplace/
│   │   ├── config.ts ✅
│   │   └── filters.ts ✅
│   │
│   └── token/
│       ├── balances.ts ✅
│       ├── metadata.ts ✅
│       ├── metadata-search.ts ✅
│       ├── ranges.ts ✅
│       └── supplies.ts ✅
│
└── hooks/
    ├── checkout/
    │   ├── market-checkout-options.tsx ✅
    │   └── primary-sale-checkout-options.tsx ✅ RENAMED
    │
    ├── collectible/
    │   ├── balance.tsx ✅
    │   ├── metadata.tsx ✅
    │   ├── token-balances.tsx ✅
    │   ├── market-activities.tsx ✅
    │   ├── market-highest-offer.tsx ✅
    │   ├── market-list.tsx ✅
    │   ├── market-list-paginated.tsx ✅
    │   ├── market-listings.tsx ✅
    │   ├── market-listings-count.tsx ✅
    │   ├── market-lowest-listing.tsx ✅
    │   ├── market-offers.tsx ✅
    │   ├── market-offers-count.tsx ✅
    │   ├── primary-sale-items.tsx ✅ RENAMED from primary-sale-list.tsx
    │   └── primary-sale-items-count.tsx ✅ RENAMED from primary-sale-list-count.tsx
    │
    ├── collection/
    │   ├── list.tsx ✅
    │   ├── metadata.tsx ✅
    │   ├── market-activities.tsx ✅
    │   └── market-items.tsx ✅
    │
    ├── currency/
    │   ├── compare-prices.tsx ✅
    │   ├── convert-to-usd.tsx ✅
    │   ├── currency.tsx ✅
    │   └── list.tsx ✅
    │
    ├── inventory/
    │   └── inventory.tsx ✅ (duplicate removed)
    │
    ├── token/
    │   └── balances.tsx ✅
    │
    ├── transactions/
    │   ├── useCancelOrder.tsx ✅
    │   ├── useGenerateCancelTransaction.tsx ✅
    │   ├── useGenerateListingTransaction.tsx ✅
    │   ├── useGenerateOfferTransaction.tsx ✅
    │   └── useGenerateSellTransaction.tsx ✅
    │
    ├── utils/
    │   ├── useAutoSelectFeeOption.tsx ✅
    │   ├── useEnsureCorrectChain.ts ✅
    │   ├── useGetReceiptFromHash.tsx ✅
    │   └── useRoyalty.tsx ✅
    │
    ├── ui/
    │   ├── card-data/
    │   │   ├── primary-sale-1155-card-data.tsx ✅ MOVED & RENAMED (UI-specific)
    │   │   ├── primary-sale-721-card-data.tsx ✅ MOVED & RENAMED (UI-specific)
    │   │   └── market-card-data.tsx ✅ MOVED from marketplace/list-card-data.tsx
    │   └── url-state/
    │       └── filter-state.tsx ✅ MOVED from ui/useFilterState.tsx (nuqs dependency)
    │
    └── _deprecated/
        └── index.ts ✅ (all backward compatibility exports)
```

---

## 🔑 Key Decisions

### File Naming Strategy

**Decision:** Use folder context for domain, but ensure specificity within each domain.

**Rationale:**
- Files like `balance.ts` and `metadata.ts` are clear when in domain folders (`collectible/balance.ts`, `collection/metadata.ts`)
- Keeping names concise improves maintainability and reduces verbosity
- Self-documentation comes from:
  1. **Folder structure** (domain context)
  2. **File name** (specific operation)
  3. **Hook/function name** (combines both)
- Example: `collectible/balance.ts` → `useCollectibleBalance()` (hook name IS self-documenting)

**What needs renaming:**
- ❌ Ambiguous names that aren't clear even with folder context: `market-collection-detail.ts` → `market-detail.ts`
- ❌ Inconsistent terminology: `shop-checkout-options.ts` → `primary-sale-checkout-options.ts`
- ❌ Wrong terminology: `primary-sale-list.ts` → `primary-sale-items.ts`
- ✅ Domain-specific files are fine: `balance.ts`, `metadata.ts`, `list.ts` (when in appropriate folders)

### Naming: "Primary Sale" vs "Market"

**Terminology:**
- **Market** = Secondary sales (peer-to-peer trading of existing NFTs via orderbook)
- **Primary Sale** = Initial sales (minting new NFTs directly from sales contracts)

**Rationale for "Primary Sale":**
- Industry-standard terminology in NFT/blockchain space
- Clear distinction from "market" (secondary sales)
- More precise than "shop" which could be ambiguous
- Matches backend API terminology

**Structure:**
```
collectible/
├── metadata.ts                    # Core collectible data
├── balance.ts                     # User's balance
├── market-listings.ts             # Secondary sales (orderbook)
├── market-offers.ts               # Secondary sales (orderbook)
├── primary-sale-items.ts          # Primary sales (sales contracts)
└── primary-sale-items-count.ts    # Primary sales (sales contracts)
```

**Hook names:**
```typescript
// Market (Secondary Sales)
useCollectibleMarketListings()      // ✅ Self-documenting
useCollectibleMarketOffers()        // ✅ Self-documenting

// Primary Sales
useCollectiblePrimarySaleItems()    // ✅ Self-documenting
usePrimarySaleItems()               // ✅ RECOMMENDED (shorter)
```

### UI-Specific Hooks Separation

**Problem:** Some hooks depend on:
1. UI card components (opinionated structure)
2. Optional dependencies like `nuqs` (URL state management)

**Solution:** Create `hooks/ui/` folder for UI-specific hooks

**Structure:**
```
hooks/
├── ui/
│   ├── card-data/              # Hooks that depend on card components
│   │   ├── primary-sale-1155-card-data.tsx
│   │   ├── primary-sale-721-card-data.tsx
│   │   └── market-card-data.tsx
│   └── url-state/              # Hooks that depend on nuqs
│       └── filter-state.tsx
```

**Rationale:**
- **Card data hooks** format data specifically for our card components (`ShopCollectibleCardProps`, etc.)
  - End users may not use our card components
  - These are opinionated helpers, not core data hooks
- **URL state hooks** require `nuqs` as a dependency
  - Not all users will have `nuqs` installed
  - Should be clearly optional/separate from core hooks

**Hook names:**
```typescript
// UI Card Data (depends on card components)
usePrimarySale1155CardData()    // ✅ Formats for card components
usePrimarySale721CardData()     // ✅ Formats for card components
useMarketCardData()             // ✅ Formats for card components

// URL State (depends on nuqs)
useFilterState()                // ✅ Manages filter state in URL
```

### Alternative: Shorter Names for Simple Operations

Since primary sale operations are simpler (just fetching items), we can use shorter names:

```typescript
// Option 1: Full prefix (more explicit)
useCollectiblePrimarySaleItems()       
useCollectiblePrimarySaleItemsCount()  

// Option 2: Just usePrimarySaleItems (clearer, less verbose)
usePrimarySaleItems()                  // ✅ RECOMMENDED
usePrimarySaleItemsCount()             // ✅ RECOMMENDED
```

**Recommendation:** Use `usePrimarySaleItems` because:
- Primary sale context is clear from name alone
- Matches pattern: `useCurrencyList`, `useInventory`, etc.
- Less verbose while still self-documenting

---

## 📋 Changes Required

### 1. Move Primary Sale Files

**Queries:**
```bash
# Move and rename
mv sdk/src/react/queries/collectible/primary-sale-list.ts \
   sdk/src/react/queries/collectible/primary-sale-items.ts

mv sdk/src/react/queries/collectible/primary-sale-list-count.ts \
   sdk/src/react/queries/collectible/primary-sale-items-count.ts
```

**Update file contents:**

`queries/collectible/primary-sale-items.ts`:
```typescript
// Rename exports
export function fetchPrimarySaleItems(...) { }
export function getPrimarySaleItemsQueryKey(...) {
  return ['collectible', 'primary-sale', 'items', apiArgs] as const;
}
export function primarySaleItemsQueryOptions(...) { }
```

`queries/collectible/primary-sale-items-count.ts`:
```typescript
// Rename exports
export function fetchPrimarySaleItemsCount(...) { }
export function getPrimarySaleItemsCountQueryKey(...) {
  return ['collectible', 'primary-sale', 'items-count', apiArgs] as const;
}
export function primarySaleItemsCountQueryOptions(...) { }
```

**Hooks:**
```bash
# Move and rename
mv sdk/src/react/hooks/collectible/primary-sale-list.tsx \
   sdk/src/react/hooks/collectible/primary-sale-items.tsx

mv sdk/src/react/hooks/collectible/primary-sale-list-count.tsx \
   sdk/src/react/hooks/collectible/primary-sale-items-count.tsx
```

`hooks/collectible/primary-sale-items.tsx`:
```typescript
'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { primarySaleItemsQueryOptions } from '../../queries/collectible/primary-sale-items';
import { useConfig } from '../config/useConfig';

export type UsePrimarySaleItemsParams = ...

export function usePrimarySaleItems(params: UsePrimarySaleItemsParams) {
  const config = useConfig();
  return useInfiniteQuery(primarySaleItemsQueryOptions({ ...params, config }));
}
```

---

### 2. Move & Rename Card Data Hooks to UI Folder

**Location:** Move to `hooks/ui/card-data/` since they're UI-specific and depend on card components

```bash
# Create ui/card-data directory
mkdir -p sdk/src/react/hooks/ui/card-data

# Move from data/primary-sales to ui/card-data
mv sdk/src/react/hooks/data/primary-sales/useList1155ShopCardData.tsx \
   sdk/src/react/hooks/ui/card-data/primary-sale-1155-card-data.tsx

mv sdk/src/react/hooks/data/primary-sales/useList721ShopCardData.tsx \
   sdk/src/react/hooks/ui/card-data/primary-sale-721-card-data.tsx

# Move market card data hook
mv sdk/src/react/hooks/marketplace/list-card-data.tsx \
   sdk/src/react/hooks/ui/card-data/market-card-data.tsx
```

**Rename exports:**

`hooks/ui/card-data/primary-sale-1155-card-data.tsx`:
```typescript
- export function useList1155ShopCardData({
+ export function usePrimarySale1155CardData({
  ...
}
```

`hooks/ui/card-data/primary-sale-721-card-data.tsx`:
```typescript
- export function useList721ShopCardData({
+ export function usePrimarySale721CardData({
  ...
}
```

`hooks/ui/card-data/market-card-data.tsx`:
```typescript
- export function useListCardData({
+ export function useMarketCardData({
  ...
}
```

---

### 3. Move URL State Hook to UI Folder

**Location:** Move to `hooks/ui/url-state/` since it depends on `nuqs` (optional dependency)

```bash
# Create ui/url-state directory
mkdir -p sdk/src/react/hooks/ui/url-state

# Move filter state hook
mv sdk/src/react/hooks/ui/useFilterState.tsx \
   sdk/src/react/hooks/ui/url-state/filter-state.tsx
```

**Update exports:**

`hooks/ui/url-state/filter-state.tsx`:
```typescript
// Keep export name the same for backward compatibility
export function useFilterState() {
  ...
}
```

---

### 4. Move Checkout Hooks from Utils

Hooks already exist in correct location, just remove from utils:

```bash
# Delete duplicates from utils
rm sdk/src/react/hooks/utils/useCheckoutOptions.tsx
rm sdk/src/react/hooks/utils/useCheckoutOptions.test.tsx
rm sdk/src/react/hooks/utils/useCheckoutOptionsSalesContract.tsx
rm sdk/src/react/hooks/utils/useCheckoutOptionsSalesContract.test.tsx
```

Backward compatibility exports stay in `_deprecated/index.ts`.

---

### 5. Move Currency Utils Hooks

```bash
# Delete duplicates from utils
rm sdk/src/react/hooks/utils/useComparePrices.tsx
rm sdk/src/react/hooks/utils/useComparePrices.test.tsx
rm sdk/src/react/hooks/utils/useConvertPriceToUSD.tsx
rm sdk/src/react/hooks/utils/useConvertPriceToUSD.test.tsx
```

Backward compatibility exports stay in `_deprecated/index.ts`.

---

### 6. Remove Duplicates and Empty Folders

```bash
# Remove duplicate inventory hook
rm -rf sdk/src/react/hooks/data/inventory/

# Remove legacy primary sales hooks
rm sdk/src/react/hooks/data/primary-sales/useGetCountOfPrimarySaleItems.tsx
rm sdk/src/react/hooks/data/primary-sales/useCountOfPrimarySaleItems.tsx
rm sdk/src/react/hooks/data/primary-sales/useErc721SalesData.tsx
rm sdk/src/react/hooks/data/primary-sales/useListPrimarySaleItems.tsx

# Remove now-empty data/ folder
rm -rf sdk/src/react/hooks/data/

# Remove now-empty marketplace/ folder
rm -rf sdk/src/react/hooks/marketplace/
```

---

### 7. Rename Ambiguous Files

**Collection detail (redundant prefix):**
```bash
mv sdk/src/react/queries/collection/market-collection-detail.ts \
   sdk/src/react/queries/collection/market-detail.ts
```

Update exports:
```typescript
- export function getCollectionDetailQueryOptions(...) {
+ export function collectionMarketDetailQueryOptions(...) {
  return queryOptions({
    queryKey: getCollectionMarketDetailQueryKey(params),
    ...
  });
}
```

---

### 8. Rename Primary Sale Checkout to Match Convention

```bash
# Rename query file
mv sdk/src/react/queries/checkout/shop-checkout-options.ts \
   sdk/src/react/queries/checkout/primary-sale-checkout-options.ts

# Rename hook file
mv sdk/src/react/hooks/checkout/shop-checkout-options.tsx \
   sdk/src/react/hooks/checkout/primary-sale-checkout-options.tsx
```

Update exports:
```typescript
// queries/checkout/primary-sale-checkout-options.ts
- export function fetchShopCheckoutOptions(...) { }
+ export function fetchPrimarySaleCheckoutOptions(...) { }

// hooks/checkout/primary-sale-checkout-options.tsx
- export function useShopCheckoutOptions(...) { }
+ export function usePrimarySaleCheckoutOptions(...) { }
```

---

## 🔄 Update All Imports

### SDK Internal Imports

```bash
# Find all imports to update
rg "primary-sale-list" sdk/src/react/ -l
rg "shop-checkout" sdk/src/react/ -l
rg "useList1155ShopCardData" sdk/src/react/ -l
rg "useList721ShopCardData" sdk/src/react/ -l
rg "useListCardData" sdk/src/react/ -l
rg "market-collection-detail" sdk/src/react/ -l
```

Update each:
```typescript
// Old
import { useCollectiblePrimarySaleList } from './hooks/collectible/primary-sale-list';
import { useShopCheckoutOptions } from './hooks/checkout/shop-checkout-options';
import { useList1155ShopCardData } from './hooks/data/primary-sales/useList1155ShopCardData';

// New
import { usePrimarySaleItems } from './hooks/collectible/primary-sale-items';
import { usePrimarySaleCheckoutOptions } from './hooks/checkout/primary-sale-checkout-options';
import { usePrimarySale1155CardData } from './hooks/ui/card-data/primary-sale-1155-card-data';
```

---

### Playground Imports

**Important:** Playgrounds should NOT be updated. They continue using old hook names via `_deprecated/` exports to verify backward compatibility.

---

## 📦 Export Structure

### `sdk/src/react/queries/collectible/index.ts`

```typescript
export * from './balance';
export * from './metadata';
export * from './token-balances';
export * from './market-activities';
export * from './market-highest-offer';
export * from './market-list';
export * from './market-list-paginated';
export * from './market-listings';
export * from './market-listings-count';
export * from './market-lowest-listing';
export * from './market-offers';
export * from './market-offers-count';
export * from './primary-sale-items';
export * from './primary-sale-items-count';
```

### `sdk/src/react/hooks/collectible/index.ts`

```typescript
export * from './balance';
export * from './metadata';
export * from './token-balances';
export * from './market-activities';
export * from './market-highest-offer';
export * from './market-list';
export * from './market-list-paginated';
export * from './market-listings';
export * from './market-listings-count';
export * from './market-lowest-listing';
export * from './market-offers';
export * from './market-offers-count';
export * from './primary-sale-items';
export * from './primary-sale-items-count';
```

### `sdk/src/react/hooks/ui/index.ts`

```typescript
// UI-specific hooks (opinionated/optional)
export * from './card-data/primary-sale-1155-card-data';
export * from './card-data/primary-sale-721-card-data';
export * from './card-data/market-card-data';
export * from './url-state/filter-state';
```

### `sdk/src/react/hooks/utils/index.ts`

```typescript
// True utilities only
export * from './useAutoSelectFeeOption';
export * from './useEnsureCorrectChain';
export * from './useGetReceiptFromHash';
export * from './useRoyalty';
```

---

## ✅ Validation Checklist

After implementation, validate:

- [ ] Primary sale files renamed (`primary-sale-list` → `primary-sale-items`)
- [ ] Checkout files renamed (`shop-checkout-options` → `primary-sale-checkout-options`)
- [ ] Collection detail renamed (`market-collection-detail` → `market-detail`)
- [ ] All exports renamed correctly
- [ ] All internal imports updated
- [ ] Duplicate files removed from `data/` and `utils/`
- [ ] `data/` folder removed completely
- [ ] `marketplace/` folder removed completely
- [ ] `ui/card-data/` folder created with card hooks
- [ ] `ui/url-state/` folder created with filter state hook
- [ ] All tests pass
- [ ] TypeScript compiles without errors
- [ ] Playgrounds still work (using old names via `_deprecated/`)
- [ ] Each hook name is self-documenting
- [ ] UI-specific hooks clearly separated from data hooks

---

## 🧪 Self-Documenting Test

Hook names should be clear even without seeing the file structure:

```typescript
// ✅ PASS - Hook name is self-documenting (includes domain)
useCollectibleBalance()               → collectible/balance.ts
useCollectibleMetadata()              → collectible/metadata.ts
useCollectionList()                   → collection/list.ts
useCollectionMetadata()               → collection/metadata.ts
useCurrencyList()                     → currency/list.ts
useTokenBalances()                    → token/balances.ts
useMarketplaceConfig()                → marketplace/config.ts
useInventory()                        → inventory/inventory.ts
useMarketCheckoutOptions()            → checkout/market-checkout-options.ts
usePrimarySaleCheckoutOptions()       → checkout/primary-sale-checkout-options.ts

// ✅ PASS - Clear operation names
useCollectibleMarketListings()        → Clear what it does
usePrimarySaleItems()                 → Clear what it does
useComparePrices()                    → Clear what it does

// ❌ FAIL - Unclear terminology
useShopCheckoutOptions()              → "Shop" unclear (should be "primary sale")
usePrimarySaleList()                  → "List" vague (should be "items")
useCollectionMarketCollectionDetail() → Redundant "collection"
```

**Test: Can someone unfamiliar with the project understand the hook from its name alone?**
- ✅ `useCollectibleBalance()` - Yes! Get balance of a collectible
- ✅ `useCurrencyList()` - Yes! Get list of currencies
- ✅ `usePrimarySaleItems()` - Yes! Get primary sale items
- ❌ `useShopCheckoutOptions()` - No! What's a "shop"?
- ❌ `usePrimarySaleList()` - Vague! List of what?

---

## 🎯 Summary of Changes

| Category | Before | After | Reason |
|----------|--------|-------|--------|
| **Naming principle** | Files rely on folder + name | **Hook names must be self-documenting** | User sees hook name, not file path |
| **Terminology** | `shop-checkout-options.ts` | `primary-sale-checkout-options.ts` | Industry-standard terminology |
| **Terminology** | `primary-sale-list.ts` | `primary-sale-items.ts` | More accurate ("list" is vague) |
| **Ambiguous names** | `market-collection-detail.ts` | `market-detail.ts` | Remove redundant "collection" prefix |
| **UI hooks location** | `data/primary-sales/`, `marketplace/` | `ui/card-data/`, `ui/url-state/` | Separates UI-specific/optional dependencies |
| **Duplicates** | `data/inventory/`, `utils/` duplicates | Removed | Consolidation |

**Key principle:** Hook names combine domain + operation
- ✅ `collectible/balance.ts` → `useCollectibleBalance()` - Self-documenting hook name
- ✅ `currency/list.ts` → `useCurrencyList()` - Self-documenting hook name
- ✅ `collectible/primary-sale-items.ts` → `usePrimarySaleItems()` - Clear terminology
- ❌ `collectible/primary-sale-list.ts` → `usePrimarySaleList()` - Vague terminology

---

## 📝 Breaking Changes

Breaking changes include:
- **Query keys changed:**
  - `['checkout', 'shop-checkout-options']` → `['checkout', 'primary-sale-checkout-options']`
  - `['collectible', 'primary-sale-list']` → `['collectible', 'primary-sale-items']`
  - `['collection', 'market-collection-detail']` → `['collection', 'market-detail']`

- **Hook names changed:**
  - `useCollectiblePrimarySaleList()` → `usePrimarySaleItems()`
  - `useShopCheckoutOptions()` → `usePrimarySaleCheckoutOptions()`
  - `useList1155ShopCardData()` → `usePrimarySale1155CardData()`
  - `useList721ShopCardData()` → `usePrimarySale721CardData()`
  - `useListCardData()` → `useMarketCardData()`

- **File locations changed:**
  - `data/primary-sales/` → `ui/card-data/` (UI-specific hooks)
  - `marketplace/list-card-data.tsx` → `ui/card-data/market-card-data.tsx`
  - `ui/useFilterState.tsx` → `ui/url-state/filter-state.tsx`

- **Query function names changed:**
  - `fetchShopCheckoutOptions()` → `fetchPrimarySaleCheckoutOptions()`
  - `listPrimarySaleItemsQueryOptions()` → `primarySaleItemsQueryOptions()`

- **Terminology updated:**
  - "shop" → "primary sale" (industry standard)
  - "list" → "items" (more specific)

**Backward compatibility:** Available via `_deprecated/index.ts` exports

**Playgrounds:** Will continue using old names via deprecated exports to verify backward compatibility

---

## 🚀 Implementation Order

1. **Phase 1: Create New Folders** (5 min)
   - Create `hooks/ui/card-data/`
   - Create `hooks/ui/url-state/`

2. **Phase 2: Move & Rename Files** (30 min)
   - Rename `primary-sale-list` → `primary-sale-items` (queries & hooks)
   - Rename `shop-checkout-options` → `primary-sale-checkout-options` (queries & hooks)
   - Rename `market-collection-detail` → `market-detail` (queries only)
   - Move card data hooks to `ui/card-data/`
   - Move market card hook to `ui/card-data/`
   - Move filter state hook to `ui/url-state/`

3. **Phase 3: Update Exports** (30 min)
   - Update query function names in renamed files
   - Update hook names in renamed files
   - Update query keys
   - Update index.ts files
   - Create `ui/index.ts` exports

4. **Phase 4: Update Imports** (45 min)
   - Update SDK internal imports
   - Update UI component imports
   - Update `_deprecated/index.ts` for backward compatibility

5. **Phase 5: Cleanup** (15 min)
   - Remove duplicate files from `utils/`
   - Remove `data/` folder completely
   - Remove `marketplace/` folder completely

6. **Phase 6: Test** (45 min)
   - Run TypeScript compiler
   - Run all tests
   - Test playgrounds (should work via deprecated exports)
   - Validate hook names

**Total:** ~3 hours

---

## ⚠️ Known Issues to Address

### 1. Terminology: "Shop" → "Primary Sale"

**Problem:** `shop-checkout-options.ts` uses non-standard terminology.

**Solution:** Rename to use industry-standard terminology:
- `checkout/shop-checkout-options.ts` → `checkout/primary-sale-checkout-options.ts`
- Hook: `useShopCheckoutOptions()` → `usePrimarySaleCheckoutOptions()`

**Rationale:**
- "Primary sale" is standard NFT industry terminology
- Distinguishes clearly from "market" (secondary sales)
- Matches backend API patterns

---

### 2. Terminology: "List" → "Items"

**Problem:** `primary-sale-list.ts` is vague about what it returns.

**Solution:** Use more specific terminology:
- `collectible/primary-sale-list.ts` → `collectible/primary-sale-items.ts`
- Hook: `useCollectiblePrimarySaleList()` → `usePrimarySaleItems()`

**Rationale:**
- "Items" is more specific than "list"
- Matches the actual data structure returned
- Clearer for API consumers

---

### 3. Redundant Prefix: "market-collection-detail"

**Problem:** File is in `collection/` folder but has "collection" in the name.

**Solution:** Remove redundant prefix:
- `collection/market-collection-detail.ts` → `collection/market-detail.ts`
- Hook remains: `useCollectionMarketDetail()`

**Rationale:**
- Folder already indicates domain
- Redundant prefix adds noise
- Hook name includes domain anyway

---

### 2. Ambiguous "ranges" naming

**Problem:** `token/ranges.ts` is not self-documenting. From the name alone you cannot tell what it does.

**Current situation:**
- **`token/ranges.ts`** → Calls `getTokenIDRanges()` from Indexer API
  - Returns: **Token ID ranges for a collection** (e.g., which token IDs exist: 1-100, 500-600, etc.)
  - Used for: Understanding the token ID structure of a collection (especially for ERC1155)

**Recommendation:** Rename to be self-documenting:
- `token/ranges.ts` → **`token/id-ranges.ts`**
- Hook: `useTokenIDRanges()` or `useTokenIdRanges()`
- Clear meaning: "Get the ranges of token IDs that exist in this collection"



## 💡 Key Insights

### Primary Sale vs Market Context

Both are collectible operations, just different sales contexts:
- **Market** = Secondary sales - trading existing NFTs (orderbook)
- **Primary Sale** = Initial sales - minting new NFTs (sales contracts)

Both stay in `collectible/` domain because they operate on collectibles.

### Hook Naming Pattern

Hook names must include the domain to be self-documenting:

```
use + [Domain] + [Context] + [Action]

Examples:
useCollectibleMarketListings()    // collectible domain, market context, listings
usePrimarySaleItems()             // primary sale context, items
useCurrencyList()                 // currency domain, list
useCollectionMetadata()           // collection domain, metadata
```

The file can have a simple name (`balance.ts`), but the hook must include the domain (`useCollectibleBalance()`).

### UI-Specific Hooks Separation

Hooks in `hooks/ui/` are opinionated/optional:
- **Card data hooks** (`ui/card-data/`)
  - Format data specifically for our card components
  - End users may use different UI components
  - Should be clearly optional helpers
  
- **URL state hooks** (`ui/url-state/`)
  - Require `nuqs` as a peer dependency
  - Not all users will have `nuqs` installed
  - Should be clearly marked as optional

### True Utilities Only

Utils should contain ONLY calculation/helper hooks, not data fetching:
- ✅ `useRoyalty` - calculation
- ✅ `useAutoSelectFeeOption` - helper logic
- ✅ `useEnsureCorrectChain` - helper logic
- ❌ `useCheckoutOptions` - data fetching (belongs in `checkout/`)
- ❌ `useComparePrices` - data fetching (belongs in `currency/`)
- ❌ `usePrimarySale1155CardData` - UI-specific (belongs in `ui/card-data/`)
