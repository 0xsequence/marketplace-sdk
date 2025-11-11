# @0xsequence/marketplace-api

**Unified API Adapter Layer for Sequence Services**

This internal package normalizes inconsistent API types from multiple @0xsequence services into a clean, developer-friendly interface with consistent bigint usage.

## Problem

Our SDK uses multiple @0xsequence services (marketplace, indexer, metadata), each with generated `.gen.ts` types that are inconsistent:

| Service | Chain ID Field | Chain ID Type | Token ID Field | Token ID Type |
|---------|----------------|---------------|----------------|---------------|
| **Marketplace** | `chainId` | `number` | `tokenId` | `string` |
| **Indexer** | `chainID` | `number` | `tokenID` | `string` |
| **Metadata** | `chainID` | `string`! | `tokenId` | `string` |

This causes:
- 100+ `.toString()` conversions scattered throughout the codebase
- Type confusion (chainId vs chainID)
- Precision loss risk when using `Number()`
- Tight coupling to external API shapes

## Solution

This package provides:

1. **Universal Type Primitives** - Consistent types across all services
2. **Utility Functions** - Smart conversions between internal and API types  
3. **Future: Service Adapters** - Wrapped clients that handle conversions automatically

## Usage

### Current: Utility Functions

```typescript
import { ChainId, TokenId, normalizeChainId, toApiChainId, toApiTokenId } from '@0xsequence/marketplace-api';

// Normalize inputs to bigint
const chainId: ChainId = normalizeChainId(137); // bigint
const tokenId: TokenId = normalizeTokenId("12345"); // bigint

// Convert to API formats when needed
const marketplaceReq = {
  chainId: toApiChainId(chainId),      // number for marketplace API
  tokenId: toApiTokenId(tokenId),      // string for marketplace API
};

const metadataReq = {
  chainID: toMetadataChainId(chainId), // string for metadata API!
  tokenID: toApiTokenId(tokenId),
};
```

### Marketplace Adapter (Available Now)

```typescript
import { Marketplace } from '@0xsequence/marketplace-api';
import type * as MarketplaceGen from '@sdk/react/_internal/api/marketplace.gen';

// Transform raw API responses to normalized types
const rawOrder: MarketplaceGen.Order = await marketplace.getOrder(...);
const normalizedOrder: Marketplace.Order = Marketplace.toOrder(rawOrder);

// Now you have bigint chainId instead of number
normalizedOrder.chainId;  // bigint (was number)
normalizedOrder.tokenId;  // bigint (already bigint in API)

// Transform normalized requests to API format
const request = Marketplace.toGetCollectibleRequest({
  chainId: 137n,                 // bigint internally
  collectionAddress: '0x...',
  tokenId: 12345n,              // bigint internally
});
// request.chainId is number for the API
```

### Indexer Adapter (Available Now)

```typescript
import { Indexer } from '@0xsequence/marketplace-api';
import type * as IndexerGen from '@0xsequence/indexer';

// Transform raw API responses to normalized types
const rawBalance: IndexerGen.TokenBalance = await indexer.getTokenBalance(...);
const normalizedBalance: Indexer.TokenBalance = Indexer.toTokenBalance(rawBalance);

// Now you have bigint chainId and tokenId
normalizedBalance.chainId;   // bigint (was number)
normalizedBalance.tokenId;   // bigint (was tokenID string with uppercase ID)
normalizedBalance.balance;   // bigint (was string)

// Transform normalized requests to API format
const request = Indexer.toGetTokenBalancesRequest({
  accountAddress: '0x...',
  contractAddress: '0x...',
});
```

### Builder Adapter (Available Now)

```typescript
import { Builder } from '@0xsequence/marketplace-api';

// Transform raw API responses to normalized types
const rawResult = await builderAPI.lookupMarketplace(...);
const normalizedResult: Builder.LookupMarketplaceReturn = Builder.toLookupMarketplaceReturn(rawResult);

// Now you have bigint projectId, chainId, and tokenIds
normalizedResult.marketplace.projectId;  // bigint (was number)
normalizedResult.marketCollections[0].chainId;  // bigint (was number)
normalizedResult.shopCollections[0].tokenIds;  // bigint[] (was string[])

// Transform normalized requests to API format
const request = Builder.fromLookupMarketplaceArgs({
  projectId: 123n,  // bigint internally
  domain: 'example.com',
});
// request.projectId is number for the API
```

### Metadata Adapter (Available Now)

```typescript
import { Metadata } from '@0xsequence/marketplace-api';
import type * as MetadataGen from '@0xsequence/metadata';

// Transform raw API responses to normalized types
const rawInfo: MetadataGen.ContractInfo = await metadata.getContractInfo(...);
const normalizedInfo: Metadata.ContractInfo = Metadata.toContractInfo(rawInfo);

// Now you have bigint chainId instead of number
normalizedInfo.chainId;  // bigint (was number)

// Transform normalized requests to API format
const request = Metadata.toGetContractInfoArgs({
  chainId: 137n,           // bigint internally
  contractAddress: '0x...',
});
// request.chainID is "137" (string!) for the API

// Transform token metadata requests
const tokenRequest = Metadata.toGetTokenMetadataArgs({
  chainId: 137n,
  contractAddress: '0x...',
  tokenIds: [1n, 2n, 3n],  // bigint[] internally
});
// tokenRequest.tokenIDs is ["1", "2", "3"] for the API
```

## Universal Types

```typescript
// All services now use consistent types
export type ChainId = bigint;           // Replaces: number, string
export type TokenId = bigint;           // Replaces: string
export type Address = `0x${string}`;    // Viem-compatible
export type Amount = bigint;            // For balances/prices
export type Quantity = bigint;          // For token quantities
```

## Development Roadmap

- [x] **Phase 1:** Package setup with universal primitives
- [x] **Phase 2:** Utility functions for conversions
- [x] **Phase 3:** Marketplace API adapter
- [x] **Phase 4:** Indexer API adapter
- [x] **Phase 5:** Metadata API adapter
- [x] **Phase 5.5:** Builder API adapter ✨ **NEW** + Move gen.ts files
- [ ] **Phase 6:** SDK integration
- [ ] **Phase 7:** Remove all .toString() calls

## Benefits

✅ **Type Safety** - Consistent bigint usage prevents precision loss  
✅ **Developer Experience** - No more manual conversions  
✅ **Maintainability** - API changes isolated to adapter layer  
✅ **Future-Proof** - Easy to evolve internal types independently

## Related Documentation

- See `/UNIFIED_API_ADAPTER_PROPOSAL.md` for full architectural proposal
- See `/STRING_CONVERSION_AUDIT.md` for conversion audit

## Contributing

This is an internal package for the marketplace SDK monorepo. When adding new adapters:

1. Create types in `src/types/`
2. Create adapter in `src/adapters/{service}/`
3. Add utility functions in `src/utils/`
4. Export from `src/index.ts`
5. Update this README

---

**Status:** 🚧 In Development  
**Version:** 0.0.1  
**Type:** Internal Monorepo Package
