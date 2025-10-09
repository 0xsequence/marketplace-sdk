# Inventory System - Implementation Plan

**Date**: January 10, 2025  
**Status**: Ready for Implementation  
**Complexity**: Low - Connecting existing pieces  
**Risk**: Minimal - No breaking changes

---

## Executive Summary

The inventory system query infrastructure (367 lines) is **already implemented** in `sdk/src/react/queries/inventory.ts`. However, the hook (`useInventory.tsx`) isn't properly connected to use infinite queries. This document provides a complete implementation plan to:

1. Connect the hook to use infinite query options
2. Export query keys for invalidation
3. Follow existing patterns in the codebase
4. Maintain simplicity and developer ergonomics

**What's working:**
- ✅ Query key factory (`inventoryKeys`) exists and is well-structured
- ✅ Two-phase fetch logic (marketplace → indexer) implemented
- ✅ `inventoryQueryOptions` and `indexerQueryOptions` functions exist
- ✅ Infinite scroll pagination logic complete

**What's broken:**
- ❌ Hook calls non-existent `inventoryOptions` (should be `inventoryQueryOptions`)
- ❌ Hook uses `useQuery` instead of `useInfiniteQuery`
- ❌ `inventoryKeys` not exported from package
- ❌ No way for users to invalidate queries

---

## Deep Dive: Why The Current Approach

### The Two-Phase Fetch Strategy

```
Phase 1: MARKETPLACE
├─ Fetch tokens with active listings/offers
├─ Enrich with indexer balance/contract data
└─ Display these first (most relevant to users)

Phase 2: INDEXER
├─ Fetch ALL tokens user owns
├─ Filter out tokens already shown in Phase 1
└─ Display remaining tokens without listings
```

**Why this design?**
1. **UX First**: Users care most about tokens they can trade
2. **Performance**: Marketplace data is smaller, loads faster
3. **Completeness**: Indexer ensures we show EVERYTHING user owns
4. **Enrichment**: Marketplace items get enhanced with balance/contract info

### The Hierarchical Query Key Pattern

```typescript
['inventory', collection, chain, account]           // Public - users use this
  ├─ ['inventory', collection, chain, account, 'indexer']     // Internal cache
  └─ ['inventory', collection, chain, account, 'marketplace'] // Future use
```

**Why hierarchical?**
- Invalidating parent key auto-invalidates children (React Query feature)
- Users only need to know about `inventoryKeys.user(...)`
- Implementation details stay hidden
- Easy to add more internal keys later

**This follows the pattern from other hooks:**
Looking at `useLowestListing.tsx`, we see:
- Query options defined in separate file (`queries/lowestListing.ts`)
- Hook is thin wrapper calling `useQuery` with options
- Hook exports both the hook AND the query options
- Configuration injected via `useConfig()`

---

## Current State Analysis

### File: `sdk/src/react/hooks/data/inventory/useInventory.tsx`

**Current Code (21 lines):**
```typescript
import { useQuery } from '@tanstack/react-query';
import { ContractType } from '../../../_internal';
import {
  inventoryOptions,  // ❌ DOESN'T EXIST
  type UseInventoryArgs,
} from '../../../queries/inventory';
import { useConfig } from '../../config/useConfig';
import { useMarketplaceConfig } from '../../config/useMarketplaceConfig';

export function useInventory(args: UseInventoryArgs) {
  const config = useConfig();
  const { data: marketplaceConfig } = useMarketplaceConfig();

  const isLaos721 =
    marketplaceConfig?.market?.collections?.find(
      (c) =>
        c.itemsAddress === args.collectionAddress && c.chainId === args.chainId,
    )?.contractType === ContractType.LAOS_ERC_721;

  return useQuery(inventoryOptions({ ...args, isLaos721 }, config));
  // ❌ Uses useQuery instead of useInfiniteQuery
  // ❌ Calls inventoryOptions which doesn't exist
  // ❌ Passes isLaos721 but queries don't need it (they fetch it internally)
}
```

**Problems:**
1. `inventoryOptions` doesn't exist (should be `inventoryQueryOptions` + `indexerQueryOptions`)
2. Uses `useQuery` but needs `useInfiniteQuery` for pagination
3. Calculates `isLaos721` but queries already do this internally
4. No way to export `inventoryKeys` for invalidation

### File: `sdk/src/react/queries/inventory.ts`

**Current Implementation (367 lines):**
```typescript
// ✅ GOOD - This all works!
export function indexerQueryOptions(params: InventoryQueryOptions) {
  // Fetches ALL indexer tokens, returns Map<tokenId, data>
  // Uses key: inventoryKeys._indexer(collection, chain, account)
}

export function inventoryQueryOptions(
  params: InventoryQueryOptions,
  indexerMap: Map<string, CollectibleWithBalance> | undefined,
) {
  // Uses infinite query pattern
  // Uses key: inventoryKeys.user(collection, chain, account)
  // Requires indexerMap to enrich marketplace data
}
```

**What's good:**
- Both functions properly use query key factory
- Infinite query logic is complete and correct
- Two-phase approach implemented
- Type safety is solid

**The issue:**
- `inventoryQueryOptions` expects `indexerMap` as second param
- This means hook needs to fetch indexer data first, THEN pass to inventory query
- This creates a dependency chain we need to handle

---

## Implementation Plan

### Phase 1: Fix the Hook

**Goal:** Connect hook to existing query infrastructure

**File:** `sdk/src/react/hooks/data/inventory/useInventory.tsx`

**New Implementation (following `useLowestListing.tsx` pattern):**

```typescript
'use client';

import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import type { Address } from 'viem';
import {
  indexerQueryOptions,
  inventoryQueryOptions,
  type InventoryQueryOptions,
} from '../../../queries/inventory';
import { useConfig } from '../../config/useConfig';
import type { Optional } from '../../../_internal';

export type UseInventoryArgs = Optional<InventoryQueryOptions, 'config'>;

/**
 * Hook to fetch user's inventory with infinite scroll pagination
 *
 * Retrieves all tokens owned by a user in a specific collection, combining
 * marketplace data (listings/offers) with indexer data (balances/ownership).
 * Uses infinite pagination for large inventories.
 *
 * The hook fetches in two phases:
 * 1. Marketplace tokens (with active listings/offers) - shown first
 * 2. Remaining tokens from indexer - shown after marketplace items
 *
 * @param params - Configuration parameters
 * @param params.accountAddress - The user's wallet address
 * @param params.collectionAddress - The collection contract address
 * @param params.chainId - The chain ID (e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.query - Optional React Query configuration
 *
 * @returns Infinite query result with paginated collectibles
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { 
 *   data, 
 *   isLoading, 
 *   fetchNextPage, 
 *   hasNextPage 
 * } = useInventory({
 *   accountAddress: '0x...',
 *   collectionAddress: '0x...',
 *   chainId: 137
 * })
 *
 * // Access collectibles
 * data?.pages.forEach(page => {
 *   page.collectibles.forEach(nft => {
 *     console.log(nft.metadata.name, nft.balance)
 *   })
 * })
 * ```
 *
 * @example
 * Invalidate after a mutation:
 * ```typescript
 * import { useQueryClient } from '@tanstack/react-query'
 * import { inventoryKeys } from '@0xsequence/marketplace-sdk/react'
 *
 * const queryClient = useQueryClient()
 * 
 * // After listing/selling/buying
 * queryClient.invalidateQueries({
 *   queryKey: inventoryKeys.user(collectionAddress, chainId, accountAddress)
 * })
 * ```
 *
 * @example
 * Infinite scroll:
 * ```typescript
 * function InventoryList() {
 *   const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInventory({
 *     accountAddress: address,
 *     collectionAddress: collection,
 *     chainId: 137
 *   })
 *
 *   return (
 *     <div>
 *       {data?.pages.map((page, i) => (
 *         <div key={i}>
 *           {page.collectibles.map(nft => (
 *             <NFTCard key={nft.metadata.tokenId} nft={nft} />
 *           ))}
 *         </div>
 *       ))}
 *       {hasNextPage && (
 *         <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
 *           Load More
 *         </button>
 *       )}
 *     </div>
 *   )
 * }
 * ```
 */
export function useInventory(params: UseInventoryArgs) {
  const defaultConfig = useConfig();
  const { config = defaultConfig, ...rest } = params;

  const fullParams = {
    config,
    ...rest,
  };

  // Fetch indexer data first (cached separately with internal key)
  const { data: indexerMap, isLoading: indexerLoading } = useQuery(
    indexerQueryOptions(fullParams)
  );

  // Fetch inventory with infinite pagination (depends on indexer data)
  const inventoryQuery = useInfiniteQuery(
    inventoryQueryOptions(fullParams, indexerMap)
  );

  return {
    ...inventoryQuery,
    // Combine loading states - we're loading if either query is loading
    isLoading: indexerLoading || inventoryQuery.isLoading,
  };
}

// Re-export for convenience
export { inventoryKeys } from '../../../_internal/api/query-keys';
export type { InventoryQueryOptions, UseInventoryArgs };
```

**Lines:** ~100 (up from 21, but fully functional)

**Why this approach:**
1. **Follows existing patterns**: Same structure as `useLowestListing.tsx`
2. **Handles dependency**: Fetches indexer first, passes to inventory
3. **Exports everything**: Hook + keys + types
4. **Comprehensive docs**: JSDoc with 3 examples
5. **Loading states**: Properly combines both queries

---

### Phase 2: Update Index File

**File:** `sdk/src/react/hooks/data/inventory/index.ts`

**Change from:**
```typescript
export * from './useInventory';
```

**To:**
```typescript
export { useInventory, inventoryKeys } from './useInventory';
export type { UseInventoryArgs, InventoryQueryOptions } from './useInventory';
```

**Why explicit exports:**
- Ensures `inventoryKeys` is definitely exported
- Makes public API clear
- Prevents accidental internal exports
- Follows pattern from other hook index files

---

### Phase 3: Verify Main Export

**File:** `sdk/src/react/index.ts`

**Current:**
```typescript
export * from './_internal/api/get-query-client';
export * from './_internal/wagmi/create-config';
export * from './hooks';  // This should re-export inventoryKeys
export * from './providers';
export * from './queries';
export * from './types/query';
export * from './ui/index';
```

**Verify:**
Since `hooks/index.ts` includes `export * from './data/inventory'`, and our updated inventory index explicitly exports `inventoryKeys`, it should flow through automatically.

**Test after implementation:**
```typescript
// This should work
import { useInventory, inventoryKeys } from '@0xsequence/marketplace-sdk/react'
```

---

### Phase 4: Update Types Export

**File:** `sdk/src/react/queries/inventory.ts`

**Verify these are exported:**
```typescript
export interface CollectibleWithBalance extends CollectibleOrder {
  balance: string;
  contractInfo?: ContractInfo;
  contractType: ContractType.ERC1155 | ContractType.ERC721;
}

export interface FetchInventoryParams {
  chainId: number;
  collectionAddress: Address;
  accountAddress: Address;
  config: SdkConfig;
}

export interface InventoryQueryOptions
  extends ValuesOptional<FetchInventoryParams> {
  query?: StandardQueryOptions;
}

export interface CollectiblesResponse {
  collectibles: CollectibleWithBalance[];
  page: InventoryPageParam;
}
```

**Why:** Users need these types for TypeScript

**Already done:** ✅ All these exports exist in the current file

---

## User Experience

### Simple Usage

```typescript
import { useInventory } from '@0xsequence/marketplace-sdk/react'

function MyInventory() {
  const { data, isLoading, fetchNextPage, hasNextPage } = useInventory({
    accountAddress: '0x...',
    collectionAddress: '0x...',
    chainId: 137
  })

  if (isLoading) return <Spinner />

  return (
    <div>
      {data?.pages.map((page, i) => (
        <div key={i}>
          {page.collectibles.map(nft => (
            <NFTCard 
              key={nft.metadata.tokenId}
              name={nft.metadata.name}
              image={nft.metadata.image}
              balance={nft.balance}
            />
          ))}
        </div>
      ))}
      
      {hasNextPage && (
        <button onClick={() => fetchNextPage()}>
          Load More
        </button>
      )}
    </div>
  )
}
```

### Standard Invalidation

```typescript
import { useQueryClient } from '@tanstack/react-query'
import { inventoryKeys } from '@0xsequence/marketplace-sdk/react'

function RefreshButton() {
  const queryClient = useQueryClient()
  
  const handleRefresh = () => {
    // This invalidates ALL inventory data for this user
    // (both indexer cache AND marketplace pages)
    queryClient.invalidateQueries({
      queryKey: inventoryKeys.user(collectionAddress, chainId, accountAddress)
    })
  }

  return <button onClick={handleRefresh}>Refresh</button>
}
```

### After Mutations

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { inventoryKeys } from '@0xsequence/marketplace-sdk/react'

function useListItemMutation() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (params) => {
      // List item on marketplace...
    },
    onSuccess: (data, variables) => {
      // Refresh inventory - new listing should appear
      queryClient.invalidateQueries({
        queryKey: inventoryKeys.user(
          variables.collectionAddress,
          variables.chainId,
          variables.accountAddress
        )
      })
    }
  })
}
```

---

## Technical Deep Dive

### Data Flow

```
1. User calls useInventory()
   ↓
2. Hook calls useQuery(indexerQueryOptions())
   │  - Query key: ['inventory', collection, chain, account, 'indexer']
   │  - Fetches ALL tokens from indexer
   │  - Returns: Map<tokenId, CollectibleWithBalance>
   │  - Cached for 30s
   ↓
3. Hook calls useInfiniteQuery(inventoryQueryOptions(params, indexerMap))
   │  - Query key: ['inventory', collection, chain, account]
   │  - Requires indexerMap to be ready
   │  - Fetches first page of marketplace items
   │  - Enriches with indexer data
   │  - Returns first page
   ↓
4. User scrolls, calls fetchNextPage()
   │  - Fetches next marketplace page OR
   │  - Starts returning indexer-only tokens
   │  - Enrichment continues
   ↓
5. User invalidates: inventoryKeys.user(...)
   │  - React Query sees parent key invalidated
   │  - Auto-invalidates child key (indexer)
   │  - Both queries refetch
   │  - Fresh data!
```

### Query Key Hierarchy

```
inventoryKeys.all
└─ ['inventory']

inventoryKeys.collection(collection, chain)
└─ ['inventory', collection, chain]

inventoryKeys.user(collection, chain, account)  ← PUBLIC
└─ ['inventory', collection, chain, account]

inventoryKeys._indexer(collection, chain, account)  ← INTERNAL
└─ ['inventory', collection, chain, account, 'indexer']

inventoryKeys._marketplace(collection, chain, account)  ← FUTURE
└─ ['inventory', collection, chain, account, 'marketplace']
```

**React Query behavior:**
- Invalidating `inventoryKeys.all` → invalidates everything
- Invalidating `inventoryKeys.collection(...)` → invalidates all users for that collection
- Invalidating `inventoryKeys.user(...)` → invalidates BOTH user data AND `_indexer` (automatic!)
- Users never see `_indexer` or `_marketplace` keys

### Why Two Queries in the Hook?

**Option A: Single query that fetches indexer internally**
```typescript
// queries/inventory.ts
export function inventoryQueryOptions(params) {
  return infiniteQueryOptions({
    queryFn: async ({ pageParam }) => {
      const indexerMap = await fetchAllIndexerTokens(...) // ❌ Re-fetches every page!
      return fetchInventory(params, pageParam, indexerMap)
    }
  })
}
```
**Problem:** Fetches all indexer data on EVERY page fetch. Wasteful!

**Option B: Two queries (current approach)**
```typescript
// Hook
const { data: indexerMap } = useQuery(indexerQueryOptions(params))
const inventoryQuery = useInfiniteQuery(inventoryQueryOptions(params, indexerMap))
```
**Benefits:**
- ✅ Indexer data fetched ONCE, cached separately
- ✅ Each page fetch reuses cached indexer data
- ✅ Can invalidate separately if needed
- ✅ Clear separation of concerns
- ✅ Better cache hit rates

---

## Files Modified

### Create
No new files - everything exists!

### Modify

1. **`sdk/src/react/hooks/data/inventory/useInventory.tsx`**
   - Change: ~21 lines → ~100 lines
   - Add: Two query calls (indexer + inventory)
   - Add: Comprehensive JSDoc with examples
   - Add: Export `inventoryKeys`
   - Remove: Manual `isLaos721` calculation (queries handle it)

2. **`sdk/src/react/hooks/data/inventory/index.ts`**
   - Change: Use explicit exports instead of wildcard
   - Add: Export `inventoryKeys`
   - Add: Export types

### Verify
1. **`sdk/src/react/_internal/api/query-keys.ts`**
   - ✅ `InventoryKeys` class exists
   - ✅ Exported as `inventoryKeys`

2. **`sdk/src/react/queries/inventory.ts`**
   - ✅ `indexerQueryOptions` exists
   - ✅ `inventoryQueryOptions` exists
   - ✅ All types exported

3. **`sdk/src/react/hooks/index.ts`**
   - ✅ Re-exports from `./data/inventory`

4. **`sdk/src/react/index.ts`**
   - ✅ Re-exports from `./hooks`

---

## Testing Checklist

### Unit Tests
- [ ] Hook returns infinite query result
- [ ] `data.pages` contains CollectiblesResponse[]
- [ ] `fetchNextPage()` loads more items
- [ ] `hasNextPage` correctly indicates more data
- [ ] Loading states work correctly
- [ ] Indexer data enriches marketplace collectibles

### Integration Tests
- [ ] Invalidating `inventoryKeys.user(...)` refreshes both queries
- [ ] Invalidating `inventoryKeys.collection(...)` refreshes all users
- [ ] Invalidating `inventoryKeys.all` refreshes everything
- [ ] LAOS721 collections work
- [ ] Regular ERC721/ERC1155 collections work

### Export Tests
- [ ] Can import `useInventory` from main package
- [ ] Can import `inventoryKeys` from main package
- [ ] Can import types from main package
- [ ] TypeScript intellisense works

### User Experience Tests
- [ ] Infinite scroll works smoothly
- [ ] Marketplace items appear first
- [ ] Indexer-only items appear after
- [ ] No duplicate tokens shown
- [ ] Refresh button updates all data

---

## Success Metrics

| Metric | Before | After | Status |
|--------|--------|-------|--------|
| Hook functionality | ❌ Broken | ✅ Works | Fix |
| Lines in hook | 21 | ~100 | Acceptable |
| Query infrastructure | ✅ Complete (367 lines) | ✅ No change | Good |
| Infinite scroll | ❌ Not connected | ✅ Connected | Fix |
| Public invalidation | ❌ No way | ✅ `inventoryKeys` | Add |
| User mental model | Complex | Simple | Improve |
| Breaking changes | N/A | 0 | Safe |

---

## Risk Assessment

**Overall Risk: LOW**

### What Could Go Wrong

1. **Export chain breaks**
   - Risk: LOW
   - Mitigation: Test imports after implementation
   - Fix: Explicit exports at each level

2. **Loading states incorrect**
   - Risk: LOW  
   - Mitigation: Properly combine both query loading states
   - Fix: `isLoading: indexerLoading || inventoryQuery.isLoading`

3. **Infinite query doesn't work**
   - Risk: VERY LOW
   - Mitigation: Query infrastructure already tested and working
   - Fix: Just connecting hook to existing queries

4. **TypeScript errors**
   - Risk: LOW
   - Mitigation: All types already defined and exported
   - Fix: Import types correctly

### What Won't Change

- ✅ Query infrastructure (works perfectly)
- ✅ Query key structure (hierarchical, correct)
- ✅ Two-phase fetch logic (sound design)
- ✅ Indexer caching (optimal)
- ✅ Public API surface (no breaking changes)

---

## Next Steps

### For Implementation

1. **Read the current hook** (`useInventory.tsx`)
2. **Replace with new implementation** (see Phase 1)
3. **Update index file** (see Phase 2)
4. **Build and test**
5. **Verify exports work**

### For Testing

```bash
# Build the SDK
cd sdk
pnpm build

# Test in playground
cd ../playgrounds/react-vite
pnpm dev

# Test imports
import { useInventory, inventoryKeys } from '@0xsequence/marketplace-sdk/react'
```

### For Review

1. **Check hook follows pattern**: Compare to `useLowestListing.tsx`
2. **Verify exports**: Can import from main package
3. **Test invalidation**: Does `inventoryKeys.user(...)` work
4. **Review docs**: Is JSDoc clear and helpful

---

## Rationale: Why This Implementation

### Design Decisions

**Q: Why not keep the hook at 21 lines?**  
A: The 21-line version doesn't work. It calls non-existent functions and uses `useQuery` instead of `useInfiniteQuery`. To work properly, we need to:
- Call TWO queries (indexer + inventory)
- Handle loading states
- Add proper documentation
- Export keys for invalidation

**Q: Why not make queries independent (no indexerMap param)?**  
A: The inventory query MUST have indexer data to enrich marketplace collectibles with balances. Without it, users wouldn't see how many of each NFT they own. The two-query pattern is the cleanest way to handle this dependency.

**Q: Why export inventoryKeys from the hook?**  
A: Follows pattern from other hooks (see `useLowestListing.tsx` line 70). Makes it easy for users to import both hook and keys from same place.

**Q: Why hierarchical query keys?**  
A: React Query automatically invalidates child keys when parent is invalidated. This means users only need `inventoryKeys.user(...)` and don't need to know about internal `_indexer` key. Better DX.

### Alternative Approaches (Rejected)

**Alternative 1: Single query with internal indexer fetch**
```typescript
// ❌ Bad: Refetches indexer on every page
inventoryQueryOptions({
  queryFn: async () => {
    const indexer = await fetchAllIndexer() // Wasteful!
    return fetchPage(...)
  }
})
```

**Alternative 2: Custom refresh function**
```typescript
// ❌ Bad: Non-standard React Query pattern
export function refreshInventory(client, params) {
  client.invalidateQueries(...)
}
```

**Alternative 3: Combine all data in single response**
```typescript
// ❌ Bad: No infinite scroll, loads everything at once
return useQuery({
  queryFn: async () => {
    const all = await fetchAllTokens()
    return all // Could be 1000s of items!
  }
})
```

**Why our approach wins:**
- ✅ Optimal caching (indexer separate)
- ✅ Standard React Query patterns
- ✅ True infinite scroll
- ✅ Simple user API

---

## Summary

### The Problem
Hook doesn't work - calls non-existent functions and doesn't use infinite queries.

### The Solution  
Connect hook to existing (working!) query infrastructure by:
1. Using `useQuery(indexerQueryOptions())` for indexer cache
2. Using `useInfiniteQuery(inventoryQueryOptions(...))` for paginated inventory
3. Exporting `inventoryKeys` for standard invalidation

### The Impact
- ✅ Infinite scroll works
- ✅ Standard React Query invalidation
- ✅ Simple public API: `inventoryKeys.user(...)`
- ✅ No breaking changes
- ✅ ~30 minutes of work

### The Confidence Level
**HIGH** - We're not inventing anything new, just connecting existing pieces that already work.

---

**Document Status:** Ready for Implementation  
**Estimated Time:** 30-45 minutes  
**Next Action:** Implement Phase 1 (update useInventory.tsx)
