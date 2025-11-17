# Query Parameter Simplification Analysis

## Executive Summary

After auditing all 28 query files, we've identified several patterns where parameter destructuring is overly complex. The ideal pattern should be:

```typescript
const { config, ...apiParams } = params
```

This analysis categorizes all query files by their complexity level and provides specific recommendations for simplification.

---

## Pattern Categories

### ✅ Category A: Already Simple & Correct (11 files)
These files follow the ideal pattern with minimal destructuring complexity:

1. **collectible/balance.ts** ✅
   - Simple destructuring: `{ chainId, userAddress, collectionAddress, tokenId, includeMetadata, config }`
   - All params used directly in API call

2. **collectible/market-listings.ts** ✅  
   - Perfect pattern: `const { config, ...apiParams } = params`
   - Passes `apiParams` directly to API

3. **collectible/market-highest-offer.ts** ✅
   - Good pattern: `const { chainId, config, ...additionalApiParams } = params`
   - Minimal separation needed for client instantiation

4. **token/ranges.ts** ✅
   - Simple: `const { chainId, collectionAddress, config } = params`
   - Only extracts what's needed

5. **token/metadata.ts** ✅
   - Simple: `const { chainId, tokenIds, config } = params`
   - Clean and straightforward

6. **token/balances.ts** ✅
   - Simple: `const { chainId, config, ...apiParams } = params`
   - Follows best practice

7. **checkout/market-checkout-options.ts** ✅
   - Explicit but clean: `const { chainId, walletAddress, orders, config, additionalFee } = params`
   - Needs explicit handling due to field name transformations (wallet vs walletAddress)

8. **checkout/primary-sale-checkout-options.ts** ✅
   - Similar to market checkout, clean explicit handling

9. **collectible/metadata.ts** ✅
   - Simple pattern

10. **collectible/primary-sale-items.ts** ✅
    - Clean destructuring

11. **marketplace/config.ts** ✅
    - Minimal params, simple

---

### ⚠️ Category B: Moderately Complex (8 files)
These files have some unnecessary complexity but are not severely problematic:

1. **collectible/market-activities.ts**
   ```typescript
   // Current
   const { chainId, config, page, pageSize, sort, ...additionalApiParams } = params
   
   const pageParams: Page | undefined =
     page || pageSize || sort
       ? { page: page ?? 1, pageSize: pageSize ?? 10, sort }
       : undefined
   
   return await marketplaceClient.listCollectibleActivities({
     chainId,
     page: pageParams,
     ...additionalApiParams,
   })
   ```
   
   **Issue**: Manual page reconstruction when it could be simpler
   
   **Recommendation**: Consider if page handling can be delegated to API adapter

2. **collectible/market-list-paginated.ts**
   ```typescript
   // Current
   const {
     collectionAddress,
     chainId,
     config,
     page = 1,
     pageSize = 30,
     ...additionalApiParams
   } = params
   
   const pageParams: Page = { page, pageSize }
   
   return await marketplaceClient.listCollectibles({
     collectionAddress,
     chainId,
     page: pageParams,
     ...additionalApiParams,
   })
   ```
   
   **Issue**: Unnecessary intermediate `pageParams` object
   
   **Recommendation**: Build inline or pass through

3. **collectible/market-offers.ts**
   ```typescript
   // Current
   const { config, sort, page, ...additionalApiParams } = params
   
   const finalSort = sort || (page && 'sort' in page ? page.sort : undefined)
   
   let finalPage: Page | undefined
   if (page || finalSort) {
     finalPage = {
       page: page?.page ?? 1,
       pageSize: page?.pageSize ?? 20,
       ...(page?.more && { more: page.more }),
       ...(finalSort && { sort: finalSort }),
     } as Page
   }
   ```
   
   **Issue**: Complex page/sort merging logic in fetcher
   
   **Recommendation**: Move this logic to API adapter or validate at hook level

4. **collection/market-activities.ts**
   - Similar to collectible/market-activities.ts
   - Same page reconstruction pattern

5. **collection/market-items-paginated.ts**
   - Similar to collectible/market-list-paginated.ts
   - Unnecessary pageParams intermediate

6. **token/metadata-search.ts**
   ```typescript
   // Current
   const { chainId, collectionAddress, filter, page, config } = params
   
   const response = await metadataClient.searchTokenMetadata({
     chainId,
     contractAddress: collectionAddress,  // Field name transformation
     filter: filter ?? {},
     page,
   })
   ```
   
   **Issue**: Field name transformation (collectionAddress → contractAddress)
   
   **Recommendation**: This is acceptable when API has different field names. Consider adding comment explaining the transformation.

7. **collection/metadata.ts**
   - Similar field transformations

8. **token/supplies.ts**
   - Similar pattern to metadata files

---

### 🔴 Category C: Overly Complex (9 files)
These files have unnecessarily complex parameter handling that could lead to bugs:

1. **collection/balance-details.ts** 🔴
   ```typescript
   // Current
   const { chainId, filter, config } = params
   
   const promises = filter.accountAddresses.map((accountAddress) =>
     indexerClient.getTokenBalancesDetails({
       filter: {
         accountAddresses: [accountAddress],
         contractWhitelist: filter.contractWhitelist,
         omitNativeBalances: filter.omitNativeBalances,
       },
     }),
   )
   ```
   
   **Issue**: Manual filter reconstruction inside loop
   
   **Recommendation**: 
   ```typescript
   const { config, ...apiParams } = params
   const indexerClient = getIndexerClient(apiParams.chainId, config)
   
   const promises = apiParams.filter.accountAddresses.map((accountAddress) =>
     indexerClient.getTokenBalancesDetails({
       filter: {
         ...apiParams.filter,
         accountAddresses: [accountAddress],
       },
     }),
   )
   ```

2. **collectible/market-list.ts** 🔴
   ```typescript
   // Current
   const { chainId, collectionAddress, config, ...additionalApiParams } = params
   const marketplaceClient = getMarketplaceClient(config)
   const marketplaceConfig = await fetchMarketplaceConfig({ config })
   
   // Complex enabled check
   if (params.enabled === false || !isMarketCollection) {
     return {
       collectibles: [],
       page: { page: 1, pageSize: 30, more: false },
     }
   }
   
   return await marketplaceClient.listCollectibles({
     chainId,
     collectionAddress,
     page,
     ...additionalApiParams,
   })
   ```
   
   **Issue**: Business logic mixed with fetcher, accessing `params.enabled` directly
   
   **Recommendation**: Move enabled/validation logic to hook level, keep fetcher pure

3. **collection/list.ts** 🔴
   ```typescript
   // Current
   const { cardType, marketplaceConfig, config } = params
   const metadataClient = getMetadataClient(config)
   
   let collections = allCollections(marketplaceConfig)
   
   if (cardType) {
     collections = collections.filter(
       (collection) => collection.cardType === cardType,
     )
   }
   
   // Complex grouping and batch fetching logic...
   ```
   
   **Issue**: Heavy business logic in fetcher, multiple transformations
   
   **Recommendation**: Consider moving collection filtering and grouping to utility functions. Fetcher should focus on API calls.

4. **collection/market-items.ts** 🔴
   ```typescript
   // Current
   const { chainId, config, ...additionalApiParams } = params
   
   // ... inside queryFn
   return fetchListItemsOrdersForCollection(
     {
       chainId: params.chainId!,      // Using params directly
       collectionAddress: params.collectionAddress!,
       config: params.config!,
       side: params.side!,
       filter: params.filter,
     },
     pageParam,
   )
   ```
   
   **Issue**: Mixing destructured and non-destructured access, biome-ignore for nulls
   
   **Recommendation**: This file still uses old pattern (`ValuesOptional`), should be migrated to new pattern

5. **currency/compare-prices.ts** 🔴
   ```typescript
   // Current
   const {
     chainId,
     priceAmountRaw,
     priceCurrencyAddress,
     compareToPriceAmountRaw,
     compareToPriceCurrencyAddress,
     config,
   } = params
   
   // Then in queryOptions
   chainId: params.chainId!,
   priceAmountRaw: params.priceAmountRaw!,
   // ... etc with biome-ignore comments
   ```
   
   **Issue**: Old pattern not using `buildQueryOptions`, manual enabled checks, biome-ignore suppressions
   
   **Recommendation**: Migrate to new `SdkQueryParams` pattern with `buildQueryOptions`

6. **currency/convert-to-usd.ts** 🔴
   - Same issues as compare-prices.ts
   - Old pattern, needs migration

7. **inventory/inventory.ts** 🔴
   ```typescript
   // Current
   const {
     accountAddress,
     collectionAddress,
     chainId,
     config,
     page = 1,
     pageSize = 30,
   } = params
   
   // Then later in queryOptions
   accountAddress: params.accountAddress!,
   collectionAddress: params.collectionAddress!,
   chainId: params.chainId!,
   config: params.config!,
   // ... with biome-ignore
   ```
   
   **Issue**: Old pattern, manual enabled checks, biome-ignore suppressions, complex business logic in fetcher
   
   **Recommendation**: Full migration to new pattern + extract business logic

8. **collectible/token-balances.ts** 🔴
   - Old pattern with manual enabled checks
   - Needs migration

9. **currency/list.ts** 🔴
   - Old pattern
   - Needs migration

---

## Root Causes Analysis

### 1. **Legacy Pattern Migration Incomplete**
Files still using:
- `ValuesOptional<T>` instead of `SdkQueryParams<T>`
- Manual `queryOptions()` instead of `buildQueryOptions()`
- Manual enabled checks with biome-ignore suppressions

**Affected files**: 
- collection/market-items.ts
- currency/compare-prices.ts
- currency/convert-to-usd.ts
- inventory/inventory.ts
- collectible/token-balances.ts
- currency/list.ts

### 2. **Business Logic in Fetchers**
Some fetchers contain:
- Collection filtering/grouping
- Enabled/disabled checks
- Complex conditional returns

**Affected files**:
- collectible/market-list.ts
- collection/list.ts
- inventory/inventory.ts

### 3. **Complex Page Parameter Handling**
Multiple files manually reconstruct page objects:
- Extracting page, pageSize, sort separately
- Building intermediate pageParams objects
- Merging sort from different sources

**Affected files**:
- collectible/market-activities.ts
- collectible/market-offers.ts
- collection/market-activities.ts

### 4. **Unnecessary Intermediate Objects**
Creating intermediate objects that could be inlined:
- `pageParams` objects
- Reconstructed filter objects

**Affected files**:
- collection/balance-details.ts
- collectible/market-list-paginated.ts

---

## Recommendations by Priority

### Priority 1: Complete Pattern Migration (High Impact)
Migrate these 6 files to new `SdkQueryParams` pattern:
1. ✅ collection/market-items.ts - **MIGRATE TO NEW PATTERN**
2. ✅ currency/compare-prices.ts - **MIGRATE TO NEW PATTERN**
3. ✅ currency/convert-to-usd.ts - **MIGRATE TO NEW PATTERN**
4. ✅ inventory/inventory.ts - **MIGRATE TO NEW PATTERN**
5. ✅ collectible/token-balances.ts - **MIGRATE TO NEW PATTERN**
6. ✅ currency/list.ts - **MIGRATE TO NEW PATTERN**

### Priority 2: Simplify Parameter Destructuring (Medium Impact)
Refactor these files to use simpler destructuring:
1. ⚠️ collection/balance-details.ts - Use spread for filter
2. ⚠️ collectible/market-list-paginated.ts - Remove intermediate pageParams
3. ⚠️ collection/market-items-paginated.ts - Remove intermediate pageParams

### Priority 3: Extract Business Logic (Medium Impact)
Move business logic out of fetchers:
1. ⚠️ collectible/market-list.ts - Move enabled checks to hook
2. ⚠️ collection/list.ts - Extract filtering/grouping to utilities
3. ⚠️ inventory/inventory.ts - Extract collection type checking

### Priority 4: Standardize Page Handling (Low Impact)
Consider if page reconstruction can be simplified:
1. 📝 collectible/market-activities.ts - Review if needed
2. 📝 collectible/market-offers.ts - Review if needed
3. 📝 collection/market-activities.ts - Review if needed

---

## Ideal Pattern Reference

```typescript
// ✅ IDEAL: Simple separation
export async function fetchSomething(
  params: WithRequired<SomeQueryOptions, 'requiredParam' | 'config'>
) {
  const { config, ...apiParams } = params
  const client = getClient(config)
  return await client.apiMethod(apiParams)
}
```

```typescript
// ✅ ACCEPTABLE: When client needs specific param
export async function fetchSomething(
  params: WithRequired<SomeQueryOptions, 'chainId' | 'config'>
) {
  const { chainId, config, ...apiParams } = params
  const client = getClient(chainId, config)
  return await client.apiMethod({ chainId, ...apiParams })
}
```

```typescript
// ⚠️ AVOID: Overly explicit when unnecessary
export async function fetchSomething(params: SomeQueryOptions) {
  const { param1, param2, param3, param4, config } = params
  const client = getClient(config)
  return await client.apiMethod({
    param1,
    param2,
    param3,
    param4,
  })
}
// Better: const { config, ...apiParams } = params
```

```typescript
// 🔴 AVOID: Business logic in fetcher
export async function fetchSomething(params: SomeQueryOptions) {
  const { config, ...rest } = params
  
  if (params.enabled === false) {  // ❌ Should be in hook
    return emptyResult
  }
  
  let filtered = await someLogic(rest)  // ❌ Should be in utility
  
  if (condition) {  // ❌ Should be in hook
    filtered = transform(filtered)
  }
  
  return filtered
}
```

---

## Summary Statistics

- **Total Query Files**: 28
- **Simple & Correct**: 11 (39%)
- **Moderately Complex**: 8 (29%)
- **Overly Complex**: 9 (32%)

**Needs Migration to New Pattern**: 6 files (21%)
**Needs Simplification**: 12 files (43%)
**Already Good**: 10 files (36%)

---

## Testing Checklist

After refactoring, verify:
- [ ] All tests pass (`pnpm test`)
- [ ] Build succeeds (`pnpm build`)
- [ ] No new TypeScript errors
- [ ] Query keys remain stable (no breaking changes)
- [ ] Enabled logic still works correctly
- [ ] Page parameter handling works as expected
- [ ] API calls receive correct parameters
