# tokenId Standardization - Session Summary

**Date**: 2025-11-17  
**Context**: Query Type Cleanup Refactor
**Decision**: Use `tokenId` everywhere (not `collectibleId`)

---

## Decision Made

Based on `NAMING_INCONSISTENCY_REPORT.md`, we are standardizing on **`tokenId`** throughout the codebase.

### Rationale

1. **Industry Standard**: ERC-721 and ERC-1155 use `tokenId`
2. **API Alignment**: The marketplace/indexer APIs use `tokenId` (66% of existing usage)
3. **No Ambiguity**: Unlike "collectable" vs "collectible", "token" has no spelling confusion
4. **Blockchain Primitive**: The ID belongs to the token (ERC standard), not the abstract "collectible" concept

---

## Changes Made in This Session

### Files Reverted from `collectibleId` → `tokenId`

Previously, during the query refactor, we had transformed `tokenId` → `collectibleId`. These changes have been reverted:

#### 1. `sdk/src/react/queries/collectible/market-listings.ts`
**Before (incorrect transformation):**
```typescript
export type ListListingsForCollectibleQueryOptions = SdkQueryParams<
  Omit<ListListingsForCollectibleRequest, 'tokenId'> & {
    collectibleId: bigint; // ❌ Renamed from API
  }
>;

// Then transformed back in fetcher
tokenId: collectibleId,
```

**After (correct - no transformation):**
```typescript
export type ListListingsForCollectibleQueryOptions =
  SdkQueryParams<ListListingsForCollectibleRequest>;

// No transformation needed
return await marketplaceClient.listListingsForCollectible(apiParams);
```

#### 2. `sdk/src/react/queries/collectible/market-offers.ts`
**Before:**
```typescript
export type ListOffersForCollectibleQueryOptions = SdkQueryParams<
  Omit<ListOffersForCollectibleRequest, 'tokenId'> & {
    collectibleId: bigint; // ❌ Renamed
  }
>;
```

**After:**
```typescript
export type ListOffersForCollectibleQueryOptions = SdkQueryParams<
  ListOffersForCollectibleRequest & {
    sort?: Array<SortBy>; // Only adds sort, keeps tokenId
  }
>;
```

### Hook Documentation Updated

#### 3. `sdk/src/react/hooks/collectible/market-listings.tsx`
- Updated JSDoc `@param` from `collectibleId` → `tokenId`
- Updated example code from `collectibleId: '123'` → `tokenId: 123n`

#### 4. `sdk/src/react/hooks/collectible/market-offers.tsx`
- Updated JSDoc `@param` from `collectibleId` → `tokenId`
- Updated example code from `collectibleId: '1'` → `tokenId: 1n`

### Test Files Updated

#### 5. `sdk/src/react/hooks/collectible/market-listings.test.tsx`
```typescript
// Before
const defaultArgs = {
  collectibleId: 1n,
  // ...
};

// After
const defaultArgs = {
  tokenId: 1n,
  // ...
};
```

#### 6. `sdk/src/react/hooks/collectible/market-offers.test.tsx`
```typescript
// Before
collectibleId: 1n,

// After
tokenId: 1n,
```

---

## Benefits Achieved

✅ **Simpler Types**: No need for `Omit<..., 'tokenId'> & { collectibleId }` pattern  
✅ **No Runtime Transformation**: API params pass through directly  
✅ **Industry Standard**: Matches ERC-721/1155 terminology  
✅ **Consistent**: Aligns with 66% of codebase (API layer)  
✅ **TypeScript Compiles**: Zero errors after changes  

---

## Pattern Established

When wrapping API types that use `tokenId`, **DO NOT** rename to `collectibleId`:

```typescript
// ✅ CORRECT - Use API types directly
export type SomeCollectibleQueryOptions = 
  SdkQueryParams<SomeApiRequest>;

// ❌ INCORRECT - Don't rename tokenId
export type SomeCollectibleQueryOptions = SdkQueryParams<
  Omit<SomeApiRequest, 'tokenId'> & {
    collectibleId: bigint;
  }
>;
```

---

## Remaining Work

The following files still use `collectibleId` and need to be migrated to `tokenId`:

### Test Files (Not Yet Updated)
- `balance.test.tsx` - Uses `collectibleId`
- `metadata.test.tsx` - Uses `collectibleId`
- `market-offers-count.test.tsx` - Uses `collectibleId`
- `market-listings-count.test.tsx` - Uses `collectibleId`

### Query Files (May Need Review)
Some query files that haven't been migrated yet might use `collectibleId` transformations and should follow the `tokenId` pattern.

---

## Verification

✅ TypeScript compiles: `pnpm tsc --noEmit` passes  
✅ No transformation overhead  
✅ Cleaner, more maintainable code  
✅ Aligned with industry standards  

---

## Related Documents

- `NAMING_INCONSISTENCY_REPORT.md` - Original analysis recommending `tokenId`
- `QUERY_FILES_SIMPLIFICATION_ANALYSIS.md` - Documents the query refactor
- `REFACTOR_SESSION_SUMMARY.md` - Overall refactor progress


---

## COMPLETE MIGRATION - Final Summary

**Date**: 2025-11-17  
**Files Changed**: 67 files  
**Lines Changed**: 265 insertions(+), 247 deletions(-)  
**Instances Replaced**: 202 occurrences of `collectibleId` → `tokenId`

### What Was Changed

#### SDK Core (42 files)

**Query Files (4 files):**
- `sdk/src/react/queries/collectible/balance.ts`
- `sdk/src/react/queries/collectible/metadata.ts`
- `sdk/src/react/queries/collectible/market-listings-count.ts`
- `sdk/src/react/queries/collectible/market-offers-count.ts`
- `sdk/src/react/queries/collectible/market-listings.ts` (previously updated)
- `sdk/src/react/queries/collectible/market-offers.ts` (previously updated)

**Hook Files (6 files):**
- `sdk/src/react/hooks/collectible/balance.tsx`
- `sdk/src/react/hooks/collectible/metadata.tsx`
- `sdk/src/react/hooks/collectible/market-listings-count.tsx`
- `sdk/src/react/hooks/collectible/market-offers-count.tsx`
- `sdk/src/react/hooks/collectible/market-listings.tsx` (previously updated)
- `sdk/src/react/hooks/collectible/market-offers.tsx` (previously updated)

**Test Files (6 files):**
- `sdk/src/react/hooks/collectible/balance.test.tsx`
- `sdk/src/react/hooks/collectible/metadata.test.tsx`
- `sdk/src/react/hooks/collectible/market-listings-count.test.tsx`
- `sdk/src/react/hooks/collectible/market-offers-count.test.tsx`
- `sdk/src/react/hooks/collectible/market-listings.test.tsx` (previously updated)
- `sdk/src/react/hooks/collectible/market-offers.test.tsx` (previously updated)

**UI Components & Modals (25+ files):**
All files in `sdk/src/react/ui/` including:
- BuyModal (store, hooks, tests)
- CreateListingModal (store, hooks, Modal)
- MakeOfferModal (store, hooks, Modal)
- SellModal (mutations, Modal)
- TransferModal (store, views, hooks, tests)
- TransactionStatusModal (components, store, tests)
- ActionButton components (store, hooks, actions)
- Token preview components

**Utilities:**
- `sdk/src/react/hooks/utils/useRoyalty.tsx`
- `sdk/test/const.ts`

#### Playgrounds (14 files)

**Shared Components:**
- `playgrounds/shared/src/components/collectible/actions/Actions.tsx`
- `playgrounds/shared/src/components/collectible/actions/MarketActions.tsx`
- `playgrounds/shared/src/components/ordersTable/_components/Action.tsx`
- `playgrounds/shared/src/components/ordersTable/ListingsTable.tsx`
- `playgrounds/shared/src/components/ordersTable/OffersTable.tsx`
- `playgrounds/shared/src/components/pages/CollectiblePageController.tsx`

**Stores & Routes:**
- `playgrounds/shared/src/store/store.ts`
- `playgrounds/shared/src/routes/index.ts`

**App-Specific:**
- `playgrounds/alternative-wallets/src/main.tsx`
- `playgrounds/alternative-wallets/src/tabs/Collectable.tsx`
- `playgrounds/react-vite/src/main.tsx`
- `playgrounds/react-vite/src/tabs/Collectable.tsx`
- `playgrounds/without-tailwind/src/components/MarketplaceListingsTable.tsx`

**Next.js Routes:**
- `playgrounds/next/src/app/[chainId]/[collectionAddress]/[collectibleId]/` → `[tokenId]/`
  - Directory renamed + page.tsx updated

### Breaking Changes

This is a **BREAKING CHANGE** for SDK consumers. All code using the SDK must update:

```typescript
// ❌ OLD (no longer works)
useCollectibleBalance({
  collectibleId: 123n
})

useCollectibleMetadata({
  collectibleId: 456n
})

// ✅ NEW (required)
useCollectibleBalance({
  tokenId: 123n
})

useCollectibleMetadata({
  tokenId: 456n
})
```

### Verification

✅ **TypeScript**: `pnpm tsc --noEmit` passes with 0 errors  
✅ **All instances replaced**: `rg "collectibleId"` returns 0 results  
✅ **Route parameters**: Next.js `[tokenId]` directory renamed  
✅ **Consistency**: Entire codebase now uses `tokenId`  

### Impact

- **Before**: 202 instances of `collectibleId` across 59 files (31% of codebase)
- **After**: 0 instances of `collectibleId` (100% `tokenId` usage)
- **Alignment**: Now matches ERC-721/1155 standards and API layer (66%+ → 100%)

### Next Steps for Consumers

1. Update all `collectibleId` references to `tokenId`
2. Update route parameters from `[collectibleId]` to `[tokenId]` in Next.js apps
3. Update state management stores that use `collectibleId`
4. Test thoroughly - this affects all collectible-related functionality

---

## Migration Complete ✅

The codebase is now fully standardized on `tokenId` with zero instances of `collectibleId` remaining.
