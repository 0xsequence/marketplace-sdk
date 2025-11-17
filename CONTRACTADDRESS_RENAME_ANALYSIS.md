# ContractAddress → CollectionAddress Rename Analysis

## Question
**Can the `contractAddress → collectionAddress` rename be done at the API wrapper layer instead of SDK query layer?**

## Answer
**YES! This should absolutely be done at the API wrapper layer.**

## Current State

### 1. Generated Types (marketplace.gen.ts)
```typescript
// Generated from OpenAPI schema
export interface GetHighestPriceOfferForCollectibleRequest {
  chainId: string;           // ❌ API uses string
  contractAddress: string;   // 🎯 API uses this field name
  tokenId: bigint;
  filter?: OrderFilter;
}
```

### 2. API Adapter Layer (api/src/adapters/marketplace/client.ts)
```typescript
// Line 223-229: Only transforms chainId/tokenId, NOT contractAddress
export type GetHighestPriceOfferForCollectibleRequest = Omit<
  Gen.GetHighestPriceOfferForCollectibleRequest,
  'chainId' | 'tokenId'  // ⚠️ Missing 'contractAddress' in Omit!
> & {
  chainId: ChainId;        // ✅ Transformed to number
  tokenId: TokenId;        // ✅ Transformed to bigint
  // contractAddress inherited as-is from Gen type
};

// Line 399-401: Method signature still uses contractAddress
public readonly getHighestPriceOfferForCollectible: (
  req: GetHighestPriceOfferForCollectibleRequest,
) => Promise<Gen.GetCollectibleHighestOfferResponse>;
```

### 3. SDK Query Layer (sdk/src/react/queries/collectible/market-highest-offer.ts)
```typescript
// Lines 10-18: Re-transforms AND renames
export interface FetchHighestOfferParams
  extends Omit<
    GetHighestPriceOfferForCollectibleRequest,
    'contractAddress' | 'chainId'  // ⚠️ Redundant chainId omit!
  > {
  collectionAddress: string;   // 🎯 Finally renamed here
  chainId: number;             // ⚠️ Redundantly re-declared
  config: SdkConfig;           // ✅ SDK-specific addition
}

// Lines 23-32: Manual field mapping on every call
export async function fetchHighestOffer(params: FetchHighestOfferParams) {
  const { collectionAddress, chainId, config, ...additionalApiParams } = params;
  
  const marketplaceClient = getMarketplaceClient(config);
  
  const result = await marketplaceClient.getHighestPriceOfferForCollectible({
    contractAddress: collectionAddress,  // ⚠️ Manually map back!
    chainId,
    ...additionalApiParams,
  });
  return result.order ?? null;
}
```

## Problems with Current Approach

1. **Unnecessary Field Mapping on Every API Call**
   - SDK queries manually map `collectionAddress → contractAddress` in every `fetch*()` function
   - This happens **after** the API adapter already transformed chainId/tokenId
   - 16+ files doing the same manual mapping

2. **Redundant Type Re-declarations**
   - SDK queries re-declare `chainId: number` even though API adapter already provides this
   - Creates 3 interfaces per API call instead of 2

3. **Inconsistent Layer Responsibilities**
   - API adapter handles type transformations (string→number, string→bigint)
   - But leaves field renaming to SDK layer
   - This split makes the architecture confusing

4. **User-Facing Impact**
   - Users see `contractAddress` in API docs
   - Users see `collectionAddress` in SDK docs
   - Forces users to remember two different field names for the same concept

## Proposed Solution

### Move Field Rename to API Adapter Layer

**Phase 1: Update API Adapter Types**

```typescript
// api/src/adapters/marketplace/client.ts

export type GetHighestPriceOfferForCollectibleRequest = Omit<
  Gen.GetHighestPriceOfferForCollectibleRequest,
  'chainId' | 'tokenId' | 'contractAddress'  // ✅ Add contractAddress to Omit
> & {
  chainId: ChainId;
  tokenId: TokenId;
  collectionAddress: string;  // ✅ Rename at API layer
};
```

**Phase 2: Update API Adapter Wrapper**

```typescript
// Need to add field transformation in wrapChainId or create new wrapper
this.getHighestPriceOfferForCollectible = wrapWithTransform(
  (req) => this.client.getHighestPriceOfferForCollectible(req),
  (req: GetHighestPriceOfferForCollectibleRequest) => ({
    ...req,
    chainId: chainIdToString(req.chainId),
    contractAddress: req.collectionAddress,  // ✅ Map field here once
  })
);
```

**Phase 3: Simplify SDK Query Types**

```typescript
// sdk/src/react/queries/collectible/market-highest-offer.ts

export interface FetchHighestOfferParams
  extends GetHighestPriceOfferForCollectibleRequest {
  config: SdkConfig;  // ✅ Only add SDK-specific field
}

export async function fetchHighestOffer(params: FetchHighestOfferParams) {
  const { config, ...apiParams } = params;
  
  const marketplaceClient = getMarketplaceClient(config);
  
  const result = await marketplaceClient.getHighestPriceOfferForCollectible(apiParams);
  return result.order ?? null;
}
```

## Benefits

1. **Centralized Transformation**
   - All API→SDK transformations happen in one place (API adapter)
   - Easier to maintain, test, and document

2. **Cleaner SDK Queries**
   - No manual field mapping in 16+ query files
   - SDK queries only add SDK-specific fields (`config`, `cardType`, etc.)

3. **Better Type Safety**
   - Single source of truth for field names
   - Can't accidentally use `contractAddress` in SDK layer

4. **Improved DX**
   - Users only see `collectionAddress` everywhere in SDK
   - Consistent naming across all SDK APIs
   - API adapter handles the "dirty work" of API translation

5. **Less Boilerplate**
   - Eliminate ~50 lines of redundant field mapping code
   - Reduce from 3 interfaces per API call to 2

## Files Requiring Changes

### API Adapter (1 file, ~30 type definitions)
- `api/src/adapters/marketplace/client.ts`
  - Update 28 Request type definitions to rename `contractAddress → collectionAddress`
  - Update corresponding wrapper methods to map field back for API calls

### SDK Queries (16 files)
- Remove redundant `Omit` patterns
- Remove manual `contractAddress: collectionAddress` mapping
- Simplify to pure inheritance + SDK-specific additions

## Estimated Effort

- **API Adapter Changes**: 1-2 hours
  - Need to create/update wrapper utilities for field transformation
  - Update all affected Request types
  - Test existing API calls still work

- **SDK Query Changes**: 2-3 hours
  - Mechanical changes to remove field mapping
  - Update tests to use `collectionAddress`
  - Verify all hooks and components work

**Total**: 3-5 hours

## Risk Assessment

**Low Risk**
- Internal type changes only
- No breaking changes to public SDK API (already uses `collectionAddress`)
- API adapter already has transformation pattern with `wrapWithTransform`
- Can verify with existing test suite

## Recommendation

**Proceed with this refactor.** This is the architecturally correct place for the field rename:

1. **API Adapter** = Translate API types to SDK conventions
2. **SDK Queries** = Add SDK-specific concerns (config, query options, etc.)

The current split between layers violates separation of concerns and creates unnecessary complexity.
