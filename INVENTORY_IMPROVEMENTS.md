# Inventory System - Current State & Recommended Improvements

**Date**: January 10, 2025  
**Status**: Post-Master Merge Analysis

---

## Current Implementation Status

### ✅ What's Working
1. **Query keys are properly structured** in `sdk/src/react/_internal/api/query-keys.ts`
2. **Infinite query implementation** in `sdk/src/react/queries/inventory.ts` (367 lines)
3. **Two-phase fetching** (marketplace first, then indexer fallback)
4. **Simplified hook** in `sdk/src/react/hooks/data/inventory/useInventory.tsx` (21 lines)

### ❌ What's Missing
1. **`inventoryKeys` is NOT exported** from the main package
2. **Hook uses simple `queryOptions`** instead of `infiniteQueryOptions`
3. **Missing connection between hook and infinite query**
4. **No public API for invalidation**

---

## The Problem

**Current Hook (21 lines):**
```typescript
export function useInventory(args: UseInventoryArgs) {
  const config = useConfig();
  const { data: marketplaceConfig } = useMarketplaceConfig();

  const isLaos721 = /* determine if LAOS */

  return useQuery(inventoryOptions({ ...args, isLaos721 }, config));
}
```

**Issues:**
1. `inventoryOptions` doesn't exist - should be `inventoryQueryOptions`
2. Uses `useQuery` instead of `useInfiniteQuery`
3. Doesn't utilize the infinite scroll implementation in `inventory.ts`
4. No way for users to refresh/invalidate

---

## Recommended Implementation (Simplicity First)

### Option A: Simple Infinite Query (Recommended)

**Goal:** Keep it as simple as possible while providing all needed data.

**File: `sdk/src/react/hooks/data/inventory/useInventory.tsx`**
```typescript
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import type { Address } from 'viem';
import { ContractType } from '../../../_internal';
import {
  indexerQueryOptions,
  inventoryQueryOptions,
  type InventoryQueryOptions,
} from '../../../queries/inventory';
import { useConfig } from '../../config/useConfig';
import { useMarketplaceConfig } from '../../config/useMarketplaceConfig';

export interface UseInventoryArgs {
  accountAddress: Address;
  collectionAddress: Address;
  chainId: number;
  query?: {
    enabled?: boolean;
  };
}

/**
 * Fetch user's inventory with infinite scroll pagination.
 * 
 * Returns marketplace data enhanced with indexer balances.
 * Automatically handles LAOS721 collections.
 * 
 * @example
 * ```typescript
 * const { data, fetchNextPage, hasNextPage, isLoading } = useInventory({
 *   accountAddress: '0x...',
 *   collectionAddress: '0x...',
 *   chainId: 137
 * })
 * 
 * // Invalidate to refresh
 * import { useQueryClient } from '@tanstack/react-query'
 * import { inventoryKeys } from '@0xsequence/marketplace-sdk/react'
 * 
 * const queryClient = useQueryClient()
 * queryClient.invalidateQueries({
 *   queryKey: inventoryKeys.user(collectionAddress, chainId, accountAddress)
 * })
 * ```
 */
export function useInventory(args: UseInventoryArgs) {
  const config = useConfig();
  const { data: marketplaceConfig } = useMarketplaceConfig();

  const isLaos721 =
    marketplaceConfig?.market?.collections?.find(
      (c) =>
        c.itemsAddress === args.collectionAddress && c.chainId === args.chainId,
    )?.contractType === ContractType.LAOS_ERC_721;

  const params: InventoryQueryOptions = {
    chainId: args.chainId,
    collectionAddress: args.collectionAddress,
    accountAddress: args.accountAddress,
    config,
    query: args.query,
  };

  // Fetch all indexer tokens (cached separately)
  const { data: indexerMap, isLoading: indexerLoading } = useQuery(
    indexerQueryOptions(params)
  );

  // Fetch inventory with infinite pagination
  const inventoryQuery = useInfiniteQuery(
    inventoryQueryOptions(params, indexerMap)
  );

  return {
    ...inventoryQuery,
    // Include indexer loading state
    isLoading: indexerLoading || inventoryQuery.isLoading,
  };
}

// Export keys for users
export { inventoryKeys } from '../../../_internal/api/query-keys';
```

**Lines: ~55** (still very simple!)

---

### Required Export Updates

**File: `sdk/src/react/hooks/data/inventory/index.ts`**
```typescript
export { useInventory, inventoryKeys } from './useInventory';
export type { UseInventoryArgs } from './useInventory';
```

**File: `sdk/src/react/index.ts`** (add to existing exports)
```typescript
export { useInventory, inventoryKeys } from './hooks/data/inventory';
```

---

## What Users Get

### Simple Usage
```typescript
import { useInventory } from '@0xsequence/marketplace-sdk/react';

function InventoryPage() {
  const { 
    data,           // InfiniteData<CollectiblesResponse>
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage 
  } = useInventory({
    accountAddress: '0x...',
    collectionAddress: '0x...',
    chainId: 137
  });

  // data.pages[0].collectibles - first page
  // data.pages[1].collectibles - second page
  // etc.

  return (
    <div>
      {data?.pages.map((page, i) => (
        <div key={i}>
          {page.collectibles.map(nft => (
            <NFTCard key={nft.metadata.tokenId} nft={nft} />
          ))}
        </div>
      ))}
      
      {hasNextPage && (
        <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
          {isFetchingNextPage ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  );
}
```

### Simple Invalidation
```typescript
import { useQueryClient } from '@tanstack/react-query';
import { inventoryKeys } from '@0xsequence/marketplace-sdk/react';

function RefreshButton() {
  const queryClient = useQueryClient();
  
  const handleRefresh = () => {
    // This refreshes EVERYTHING for this user
    // (both indexer cache AND inventory pages)
    queryClient.invalidateQueries({
      queryKey: inventoryKeys.user(collectionAddress, chainId, accountAddress)
    });
  };

  return <button onClick={handleRefresh}>Refresh</button>;
}
```

---

## Data Flow (How It Works)

```
1. User calls useInventory()
   ↓
2. Hook fetches indexer tokens (cached with _indexer key)
   - All tokens fetched upfront
   - Stored as Map<tokenId, balance/contractInfo>
   - Cached separately for 30s
   ↓
3. Hook starts infinite query (user key)
   - Fetches marketplace page
   - Enriches with indexer data
   - Returns page
   ↓
4. User scrolls & calls fetchNextPage()
   - Gets next marketplace page
   - Enriches with indexer data
   - Returns next page
   ↓
5. User calls invalidateQueries(inventoryKeys.user(...))
   - React Query invalidates parent key
   - Automatically invalidates _indexer (child key)
   - Both queries refetch
   - Fresh data!
```

---

## Query Key Hierarchy

```
['inventory', collection, chain, account]  ← user key (public)
  ├─ ['inventory', collection, chain, account, 'indexer']  ← internal
  └─ ['inventory', collection, chain, account, 'marketplace']  ← future
```

**Why this works:**
- Invalidating parent key automatically invalidates children
- Users only need to know about `inventoryKeys.user(...)`
- Internal implementation stays hidden

---

## Files to Modify

### 1. Fix Hook (Required)
**File:** `sdk/src/react/hooks/data/inventory/useInventory.tsx`
- Add `useInfiniteQuery` 
- Call `indexerQueryOptions` and `inventoryQueryOptions`
- Export `inventoryKeys`
- Add JSDoc

**Estimated:** 55 lines (from 21)

### 2. Export Keys (Required)
**File:** `sdk/src/react/hooks/data/inventory/index.ts`
```typescript
export { useInventory, inventoryKeys } from './useInventory';
```

**File:** `sdk/src/react/index.ts`
```typescript
export { useInventory, inventoryKeys } from './hooks/data/inventory';
```

### 3. Fix Missing Export (Required)
**File:** `sdk/src/react/queries/inventory.ts`

Check if `UseInventoryArgs` exists in this file. If not, it should be defined here and re-exported by the hook.

---

## Testing Checklist

After implementation:

- [ ] `useInventory` returns infinite query result
- [ ] `data.pages` contains paginated results
- [ ] `fetchNextPage()` loads more items
- [ ] `hasNextPage` correctly indicates more data
- [ ] Indexer data enriches marketplace collectibles
- [ ] `inventoryKeys` is exported from main package
- [ ] `inventoryKeys.user(...)` invalidates both indexer and inventory
- [ ] Hook works with LAOS721 collections
- [ ] Hook works with regular collections
- [ ] Loading states are correct

---

## Success Metrics

| Metric | Current | After Fix | Goal |
|--------|---------|-----------|------|
| Hook lines | 21 | ~55 | Simple & complete |
| Queries file | 367 | 367 | No change needed |
| Infinite scroll | ❌ No | ✅ Yes | Works |
| Invalidation | ❌ No way | ✅ Standard RQ | Easy |
| Keys exported | ❌ No | ✅ Yes | Public API |
| User complexity | High | Low | Simple |

---

## Alternative: Even Simpler (Option B)

If infinite scroll is NOT needed yet, we could:

1. Keep using `useQuery` (no infinite)
2. Just return first page
3. Still export `inventoryKeys`
4. Add infinite scroll later

**Pro:** Simpler (21 lines stays 21 lines)  
**Con:** No infinite scroll (users asked for this)

**Recommendation:** Go with Option A - it's only 55 lines and provides what users need.

---

## Summary

### What We Have
- ✅ Good query structure (367 lines)
- ✅ Two-phase fetching works
- ✅ Query keys are hierarchical
- ❌ Hook doesn't use infinite query
- ❌ No public invalidation API

### What We Need
1. Connect hook to infinite query (~35 line addition)
2. Export `inventoryKeys` (2 line addition)
3. Add JSDoc (documentation)

### Complexity Assessment
- **Query logic:** Already done (367 lines)
- **Hook changes:** ~35 lines
- **Exports:** 2 lines
- **Total new code:** ~37 lines

### Risk Level
**LOW** - We're just connecting existing pieces.

---

**Status:** Ready for implementation  
**Recommendation:** Implement Option A (Simple Infinite Query)  
**Estimated Time:** 30 minutes  
**Risk:** Low - No breaking changes, just additions
