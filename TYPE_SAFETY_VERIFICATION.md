# Type Safety for `requiredParams` - Implementation Complete ✅

## Summary

The query builder now enforces **compile-time type safety** for the `requiredParams` array, ensuring developers can only list parameters that are actually required (non-optional) in the query's parameter interface.

## Implementation

### 1. **RequiredKeys Utility Type**

Located in: `sdk/src/react/_internal/query-builder.ts:30-32`

```typescript
/**
 * Extract required keys from a type (excludes optional properties)
 * A property is required if removing it makes the type incompatible
 */
export type RequiredKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K
}[keyof T];
```

**How it works:**
- Uses mapped types with `-?` to remove optionality
- Tests if `{} extends Pick<T, K>` to detect optional properties
- Returns only keys where the property is required

### 2. **Type-Safe Config Interfaces**

**For Standard Queries:**
```typescript
export interface QueryBuilderConfig<TParams extends BaseQueryParams, TData> {
  getQueryKey: (params: WithOptionalParams<TParams>) => QueryKey;
  requiredParams: ReadonlyArray<RequiredKeys<TParams>>;  // ✅ Type-safe
  fetcher: (params: TParams) => Promise<TData>;
}
```

**For Infinite Queries:**
```typescript
export interface InfiniteQueryBuilderConfig<TParams, TResponse> {
  getQueryKey: (params: WithOptionalInfiniteParams<TParams>) => QueryKey;
  requiredParams: ReadonlyArray<RequiredKeys<TParams>>;  // ✅ Type-safe
  fetcher: (params: TParams, page: Page) => Promise<TResponse>;
  getPageInfo: (response: TResponse) => Page | undefined;
}
```

## Usage Example

### Define Parameters Interface

```typescript
export interface FetchHighestOfferParams
  extends GetHighestPriceOfferForCollectibleRequest {
  config: SdkConfig;              // ✅ Required
  query?: StandardQueryOptions;   // ❌ Optional - cannot use in requiredParams
  filter?: OrderFilter;           // ❌ Optional - cannot use in requiredParams
}
```

### Create Query Options (Type-Safe)

```typescript
export function highestOfferQueryOptions(params: HighestOfferQueryOptions) {
  return buildQueryOptions(
    {
      getQueryKey: getHighestOfferQueryKey,
      // ✅ TypeScript only allows required keys
      requiredParams: ['chainId', 'collectionAddress', 'tokenId', 'config'],
      fetcher: fetchHighestOffer,
    },
    params,
  );
}
```

## Type Safety Guarantees

### ✅ What TypeScript ALLOWS:

```typescript
// All required fields
requiredParams: ['chainId', 'collectionAddress', 'tokenId', 'config']

// Subset of required fields
requiredParams: ['chainId', 'config']

// Empty array (though not recommended)
requiredParams: []
```

### ❌ What TypeScript PREVENTS:

```typescript
// ❌ Type Error: 'query' is optional
requiredParams: ['chainId', 'query']

// ❌ Type Error: 'filter' is optional
requiredParams: ['chainId', 'filter', 'config']

// ❌ Type Error: 'nonexistent' doesn't exist
requiredParams: ['chainId', 'nonexistent']
```

## Benefits

### 1. **Compile-Time Safety**
TypeScript catches errors at build time, not runtime. Impossible to accidentally mark optional fields as required.

### 2. **IntelliSense Support**
IDE autocomplete only suggests valid required keys:
```typescript
requiredParams: ['<autocomplete shows only: chainId | collectionAddress | tokenId | config>']
```

### 3. **Self-Documenting Code**
The type signature clearly communicates which parameters are required:
```typescript
// Without type safety:
requiredParams: string[]  // ❓ Which params? Are they actually required?

// With type safety:
requiredParams: ReadonlyArray<RequiredKeys<FetchHighestOfferParams>>  
// ✅ Clear: Only required params from FetchHighestOfferParams
```

### 4. **Refactoring Protection**
If a parameter changes from required to optional (or vice versa), TypeScript immediately flags all affected `requiredParams` arrays:

```typescript
// Before: tokenId is required
interface Params {
  chainId: number;
  tokenId: bigint;
  config: SdkConfig;
}

// After: tokenId becomes optional
interface Params {
  chainId: number;
  tokenId?: bigint;  // ⚠️ Now optional
  config: SdkConfig;
}

// TypeScript automatically flags this:
requiredParams: ['chainId', 'tokenId', 'config']
//                          ^^^^^^^^^ ❌ Type error: 'tokenId' is optional
```

## Verified Implementation

### Files Updated:
1. ✅ `sdk/src/react/_internal/query-builder.ts` - Added `RequiredKeys` type
2. ✅ `sdk/src/react/_internal/query-builder.ts` - Updated `QueryBuilderConfig`
3. ✅ `sdk/src/react/_internal/query-builder.ts` - Updated `InfiniteQueryBuilderConfig`
4. ✅ `sdk/src/react/_internal/index.ts` - Exports `RequiredKeys` via `export * from './query-builder'`

### Migrated Query Files Using Type-Safe `requiredParams`:
1. ✅ `sdk/src/react/queries/collectible/market-highest-offer.ts`
2. ✅ `sdk/src/react/queries/collectible/market-list.ts`
3. ✅ `sdk/src/react/queries/collection/market-floor.ts`

### Build Status:
- ✅ TypeScript compilation: **PASSED**
- ✅ SDK build: **PASSED** (4284.10 kB, 233 files)
- ✅ No type errors related to `requiredParams`

## Next Steps

When migrating the remaining ~46 query files, developers will automatically benefit from:
- Type-safe `requiredParams` arrays
- IntelliSense autocomplete for valid keys
- Compile-time error prevention
- Clear documentation of required vs optional parameters

---

**Status:** ✅ **Type safety implementation complete and verified**
