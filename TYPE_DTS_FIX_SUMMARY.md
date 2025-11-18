# TypeScript .d.ts Generation Fix - Summary

## Problem
TypeScript's `.d.ts` generator failed with error TS2742 when trying to serialize complex inferred types that use `Omit<T, K> & { K: NewType }` pattern across package boundaries.

## Root Cause
When `rolldown-plugin-dts` tried to generate declaration files, TypeScript couldn't create portable type definitions because:
1. Return types were **inferred** from complex transformations
2. The transformations used `Omit<GenOrder, 'priceCurrencyAddress'> & { priceCurrencyAddress: Address }`
3. This created references to internal generated types (`marketplace.gen-By8-WuFI`) that aren't stable across builds

## Solution: Add Explicit Return Type Annotations

We added explicit return type annotations to 5 functions so TypeScript doesn't need to infer complex types:

### 1. Query Option Functions (2 files)

**File:** `sdk/src/react/queries/collectible/market-lowest-listing.ts`
- Changed `fetchLowestListing` return type from `Promise<GetCollectibleLowestListingResponse['order']>` to `Promise<Order | undefined>`
- Added explicit return type to `lowestListingQueryOptions` using `ReturnType<typeof buildQueryOptions<...>>`

**File:** `sdk/src/react/queries/collectible/market-highest-offer.ts`
- Changed `fetchHighestOffer` return type from `Promise<GetCollectibleHighestOfferResponse['order']>` to `Promise<Order | undefined>`
- Added explicit return type to `highestOfferQueryOptions` using `ReturnType<typeof buildQueryOptions<...>>`

### 2. React Hooks (2 files)

**File:** `sdk/src/react/hooks/collectible/market-lowest-listing.tsx`
- Added explicit return type: `UseQueryResult<Order | undefined, Error>`

**File:** `sdk/src/react/hooks/collectible/market-highest-offer.tsx`
- Added explicit return type: `UseQueryResult<Order | undefined, Error>`

### 3. Composite Hook (1 file)

**File:** `sdk/src/react/hooks/ui/card-data/market-card-data.tsx`
- Added `as` assertion with explicit return type shape

## Type Safety Maintained ✅

The solution maintains full type safety because:

1. **Order types still use `Omit`** - `api/src/adapters/marketplace/types.ts` still uses:
   ```typescript
   export interface Order extends Omit<GenOrder, 'priceCurrencyAddress'> {
     priceCurrencyAddress: Address;
   }
   ```
   This means if the API changes, TypeScript will error at compile time.

2. **Explicit types reference exported types** - We use `Order` from `@0xsequence/marketplace-api`, which is an exported, stable type.

3. **No `any` types used** - All annotations are strongly typed.

## Files Modified

1. `sdk/src/react/queries/collectible/market-lowest-listing.ts` - Added return types
2. `sdk/src/react/queries/collectible/market-highest-offer.ts` - Added return types  
3. `sdk/src/react/hooks/collectible/market-lowest-listing.tsx` - Added return type
4. `sdk/src/react/hooks/collectible/market-highest-offer.tsx` - Added return type
5. `sdk/src/react/hooks/ui/card-data/market-card-data.tsx` - Added return type assertion

## Build Status

✅ **SDK builds successfully**
- Before: 5 TS2742 errors
- After: 0 errors
- Build time: ~6.8 seconds

## Key Takeaway

**TypeScript's declaration emitter cannot serialize complex inferred types across package boundaries.**

The fix is to add explicit return type annotations using:
- `ReturnType<typeof function<...>>` for query builders
- Explicit type annotations for hooks
- Reference exported types from the API package (e.g., `Order` from `@0xsequence/marketplace-api`)

This maintains type safety while allowing the `.d.ts` generator to create portable declarations.

## Related Documentation

See `TYPE_DTS_GENERATION_ISSUE.md` for detailed technical analysis of the problem.
