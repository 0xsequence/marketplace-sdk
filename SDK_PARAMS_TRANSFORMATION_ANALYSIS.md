# SDK Parameters Transformation Analysis

## Executive Summary

The SDK contains **34 query files** with parameter interfaces that perform repetitive transformations between SDK-facing types and API Request types. This pattern adds ~3,900 lines of boilerplate code that could potentially be simplified or eliminated through architectural improvements at the API adapter layer.

**Key Finding**: Every query function follows this pattern:
1. Define a `Fetch*Params` interface that extends `Omit<*Request, ...>` and adds `config: SdkConfig`
2. Extract params and transform field names (e.g., `collectionAddress` → `contractAddress`)
3. Call API client with transformed params

**Question**: Can this transformation layer be moved into the API adapter to simplify SDK query code?

---

## Current Architecture

### Layer Responsibilities

```
┌─────────────────────────────────────────────────┐
│ SDK Query Layer (sdk/src/react/queries/)       │
│ - Defines Fetch*Params interfaces              │
│ - Transforms SDK params → API Request params   │
│ - Manages TanStack Query integration           │
│ - Adds config: SdkConfig to every interface    │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│ API Adapter Layer (api/src/adapters/)          │
│ - Wraps generated API clients                  │
│ - Transforms types (string → bigint, etc)      │
│ - Handles authentication                        │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│ Generated API Clients (*Request types)         │
│ - Raw RPC method signatures                     │
│ - Generated from API specs                      │
└─────────────────────────────────────────────────┘
```

---

## Problem Analysis

### Pattern Statistics

| Metric | Count |
|--------|-------|
| **Total query files with Params** | 34 |
| **Interfaces extending `Omit<*Request>`** | 16 |
| **Interfaces with `config: SdkConfig`** | 46 |
| **Field transformations (collectionAddress)** | 57 |
| **Field transformations (walletAddress)** | 6 |
| **Total lines in query files** | ~3,900 |

### Common Transformation Patterns

#### 1. **Field Name Mapping** (Most Common)

```typescript
// SDK Query Interface
export interface FetchHighestOfferParams
	extends Omit<
		GetHighestPriceOfferForCollectibleRequest,
		'contractAddress' | 'chainId'
	> {
	collectionAddress: string;  // Renamed from contractAddress
	chainId: number;             // Same name, kept
	config: SdkConfig;           // Added by SDK
}

// Transformation in fetch function
const { collectionAddress, chainId, config, ...additionalApiParams } = params;
const marketplaceClient = getMarketplaceClient(config);

await marketplaceClient.getHighestPriceOfferForCollectible({
	contractAddress: collectionAddress,  // Transform back!
	chainId,
	...additionalApiParams,
});
```

**Observations**:
- `contractAddress` → `collectionAddress` (57 occurrences)
- `wallet` → `walletAddress` (6 occurrences)
- SDK renames fields for better DX, then transforms them back for API calls

#### 2. **Config Injection Pattern** (Universal)

```typescript
export interface FetchCountOffersForCollectibleParams {
	chainId: number;
	collectionAddress: string;
	collectibleId: bigint;
	config: SdkConfig;           // Every interface has this
	filter?: OrderFilter;
}

// In every fetch function:
const client = getMarketplaceClient(config);
```

**Observations**:
- `config: SdkConfig` appears in **46 interfaces**
- Used solely to instantiate API clients
- Not part of the actual API request

#### 3. **Page Parameter Expansion** (Pagination Queries)

```typescript
// SDK Interface
export interface FetchListCollectionActivitiesParams
	extends Omit<ListCollectionActivitiesRequest, 'chainId' | 'contractAddress' | 'page'> {
	chainId: number;
	collectionAddress: Address;
	page?: number;          // Flattened from Page object
	pageSize?: number;      // Flattened from Page object
	sort?: SortBy[];        // Flattened from Page object
	config: SdkConfig;
}

// Transformation in fetch function
const pageParams: Page | undefined =
	page || pageSize || sort
		? { page: page ?? 1, pageSize: pageSize ?? 10, sort }
		: undefined;

const apiArgs = {
	// ...
	page: pageParams,  // Reconstruct Page object
};
```

**Observations**:
- SDK flattens `Page` object for better DX
- Queries reconstruct `Page` object before API call
- Improves ergonomics but adds complexity

#### 4. **No Transformation Pattern** (Simple Cases)

```typescript
export interface FetchCountOffersForCollectibleParams {
	chainId: number;
	collectionAddress: string;
	collectibleId: bigint;
	config: SdkConfig;
	filter?: OrderFilter;
}

// Direct mapping (except field name transformation)
await client.getCountOfOffersForCollectible({
	contractAddress: collectionAddress,  // Only field name changes
	chainId,
	tokenId: collectibleId,
	filter,
});
```

---

## Why This Pattern Exists

### Legitimate Reasons

1. **Developer Experience (DX)**
   - `collectionAddress` is more intuitive than `contractAddress` in marketplace context
   - `walletAddress` is clearer than `wallet`
   - Flattened pagination parameters are easier to use

2. **Config Management**
   - SDK needs `SdkConfig` to instantiate API clients
   - React Query hooks need config for all API calls
   - Config contains auth keys, environment settings, etc.

3. **Type Safety**
   - Omitting and re-adding fields ensures SDK controls the interface
   - Prevents accidental use of internal API types in SDK public API

4. **SDK-Specific Additions**
   - Some params add SDK-specific fields (e.g., `cardType` in `FetchListCollectiblesParams`)
   - Query-specific options (e.g., `query?: StandardQueryOptions`)

### Example: SDK-Specific Extension

```typescript
export interface FetchListCollectiblesParams
	extends Omit<ListCollectiblesRequest, 'chainId' | 'contractAddress'> {
	chainId: number;
	collectionAddress: Address;
	cardType?: CardType;     // SDK-specific addition!
	config: SdkConfig;
}
```

---

## Potential Solutions

### Option 1: **API Adapter Accepts SdkConfig Directly**

Move config handling into the API adapter layer.

#### Current Approach
```typescript
// SDK Query
const client = getMarketplaceClient(config);
const result = await client.someMethod({ chainId, contractAddress, ... });
```

#### Proposed Approach
```typescript
// API Adapter Method Signature
class MarketplaceClient {
	someMethod(params: { 
		chainId: number;
		contractAddress: string;
	}, config: SdkConfig): Promise<Response>
}

// SDK Query (simplified)
const result = await marketplaceClient.someMethod(
	{ chainId, contractAddress, ... },
	config
);
```

**Pros**:
- Eliminates `config: SdkConfig` from 46 param interfaces
- Centralizes client instantiation logic
- Reduces SDK query boilerplate

**Cons**:
- API adapter becomes stateful or requires config threading
- Changes API adapter signature (breaking change to internal API)
- May complicate API adapter testing

**Verdict**: ❌ **Not Recommended**
- API adapter should remain stateless and config-agnostic
- Current pattern of instantiating clients with config is clean
- Config in params allows for flexible client management

---

### Option 2: **Unified Parameter Transformation Helper**

Create a generic utility to handle field name transformations.

#### Implementation Example
```typescript
// api/src/utils/param-transforms.ts
export interface ParamMapping {
	from: string;
	to: string;
}

export function transformParams<T, U>(
	params: T,
	mappings: ParamMapping[]
): U {
	const result = { ...params } as any;
	for (const { from, to } of mappings) {
		if (from in result) {
			result[to] = result[from];
			delete result[from];
		}
	}
	return result;
}

// SDK Query (usage)
const apiParams = transformParams(params, [
	{ from: 'collectionAddress', to: 'contractAddress' },
	{ from: 'collectibleId', to: 'tokenId' },
]);
```

**Pros**:
- Reduces manual field mapping code
- Self-documenting transformations
- Reusable across queries

**Cons**:
- Still requires per-query mapping configuration
- Loses type safety (requires `any` casting)
- Doesn't eliminate the param interface definitions
- Minimal code reduction

**Verdict**: ❌ **Not Recommended**
- Sacrifices type safety for minimal gain
- Current explicit transformations are clearer
- Type errors would only surface at runtime

---

### Option 3: **API Adapter Field Name Normalization**

Make the API adapter accept both SDK naming and API naming for fields.

#### Implementation Example
```typescript
// api/src/adapters/marketplace/client.ts
export class MarketplaceClient {
	async getHighestPriceOfferForCollectible(
		params: {
			contractAddress?: string;
			collectionAddress?: string;  // Accept both!
			chainId: number;
			tokenId?: bigint;
			collectibleId?: bigint;      // Accept both!
		}
	) {
		// Normalize internally
		const contractAddress = params.collectionAddress ?? params.contractAddress;
		const tokenId = params.collectibleId ?? params.tokenId;
		
		// Call generated client with normalized params
		return this.client.getHighestPriceOfferForCollectible({
			contractAddress,
			chainId: params.chainId,
			tokenId,
		});
	}
}
```

**Pros**:
- SDK queries can use preferred naming directly
- No transformation needed in SDK query layer
- Backward compatible (accepts both names)

**Cons**:
- API adapter becomes responsible for naming preferences
- Duplicates field definitions in types
- Confusing which field name to use
- Doesn't solve the `config` parameter issue

**Verdict**: ❌ **Not Recommended**
- Creates ambiguity in API adapter interface
- Mixes concerns (API adapter shouldn't care about SDK naming)
- Doesn't provide enough benefit to justify complexity

---

### Option 4: **Keep Current Pattern, Add Documentation**

Accept that this transformation layer is necessary and valuable.

#### Rationale
1. **Separation of Concerns is Correct**
   - SDK layer handles DX (naming, ergonomics)
   - API layer handles protocol (RPC contracts)
   - Clear boundary between layers

2. **Boilerplate is Explicit and Type-Safe**
   - Each transformation is visible and reviewable
   - TypeScript catches errors at compile time
   - Easy to debug when issues occur

3. **Code Generation Could Help**
   - Generate SDK query files from API specs
   - Automated transformation code
   - Maintains type safety and explicitness

#### Improvements Without Major Refactoring

**A. Standardize Naming Conventions**
```typescript
// Document standard field mappings
/**
 * SDK Field Name Mappings:
 * - collectionAddress → contractAddress (API)
 * - collectibleId → tokenId (API)
 * - walletAddress → wallet (API)
 */
```

**B. Template-Based Code Generation**
- Generate query files from OpenAPI/RPC specs
- Automatic field mapping based on conventions
- Reduces manual typing errors

**C. Inline Transformation Comments**
```typescript
export async function fetchHighestOffer(params: FetchHighestOfferParams) {
	const { collectionAddress, chainId, config, ...additionalApiParams } = params;
	const marketplaceClient = getMarketplaceClient(config);

	return await marketplaceClient.getHighestPriceOfferForCollectible({
		contractAddress: collectionAddress,  // SDK → API field mapping
		chainId,
		...additionalApiParams,
	});
}
```

**Verdict**: ✅ **RECOMMENDED**
- Current architecture is sound
- Benefits outweigh complexity
- Focus on tooling/automation instead of refactoring

---

## Detailed Breakdown by Query Type

### Collectible Queries (12 files)
- `market-list.ts` - Extends `Omit<ListCollectiblesRequest>`, adds `cardType`
- `market-highest-offer.ts` - Extends `Omit<GetHighestPriceOfferForCollectibleRequest>`
- `market-listings.ts` - Extends `Omit<ListCollectibleListingsRequest>`
- `metadata.ts` - Extends `Omit<GetTokenMetadataArgs>`
- `market-offers.ts` - Extends `Omit<ListOffersForCollectibleRequest>`
- `market-offers-count.ts` - No extend, defines all fields
- `primary-sale-items-count.ts` - No extend, defines all fields
- `primary-sale-items.ts` - No extend, defines all fields
- `market-count.ts` - No extend, defines all fields
- `market-listings-count.ts` - No extend, defines all fields
- `market-activities.ts` - Extends `Omit<ListCollectibleActivitiesRequest>`
- `market-lowest-listing.ts` - Extends `Omit<GetLowestPriceListingForCollectibleRequest>`

**Pattern**: Most omit `chainId`, `contractAddress`, and sometimes `tokenId`

### Collection Queries (9 files)
- `market-activities.ts` - Extends `Omit<ListCollectionActivitiesRequest>`, expands `page`
- `market-items.ts` - Extends `Omit<ListOrdersWithCollectiblesRequest>`
- `market-detail.ts` - Extends `Omit<GetCollectionDetailRequest>`
- `market-items-paginated.ts` - Extends `Omit<ListOrdersWithCollectiblesRequest>`
- `balance-details.ts` - No extend pattern
- `market-items-count.ts` - No extend pattern
- `market-filtered-count.ts` - No extend pattern
- `market-floor.ts` - Extends `Omit<GetFloorOrderRequest>`
- `metadata.ts` - No extend pattern
- `list.ts` - No extend pattern

**Pattern**: Similar to collectible queries, often expands pagination

### Currency Queries (4 files)
- `list.ts` - No extend pattern
- `currency.ts` - No extend pattern
- `convert-to-usd.ts` - No extend pattern
- `compare-prices.ts` - No extend pattern

**Pattern**: No API Request types to extend (builder/custom logic)

### Token Queries (5 files)
- `supplies.ts` - Extends `Omit<Indexer.GetTokenSuppliesRequest>`
- `balances.ts` - No extend pattern
- `ranges.ts` - No extend pattern
- `metadata-search.ts` - No extend pattern
- `metadata.ts` - No extend pattern

**Pattern**: Mix of indexer and metadata APIs

### Checkout Queries (2 files)
- `market-checkout-options.ts` - No extend pattern
- `primary-sale-checkout-options.ts` - Extends `Omit<CheckoutOptionsSalesContractRequest>`

### Marketplace Queries (2 files)
- `filters.ts` - No extend pattern
- `config.ts` - No extend pattern

---

## Complexity Metrics

### Lines of Code per Query File (Average)

```
Total query files: 34
Total lines: ~3,900
Average per file: ~115 lines

Breakdown per file:
- Interface definition: ~10 lines
- Fetch function: ~15 lines
- Query key function: ~10 lines
- Query options function: ~25 lines
- Type exports: ~5 lines
- Imports/exports: ~10 lines
- Documentation: ~10 lines
- Transformation logic: ~10 lines
```

### Potential Savings by Solution

| Solution | Lines Saved | Files Changed | Risk Level |
|----------|-------------|---------------|------------|
| **Option 1** (Config in adapter) | ~460 lines | 80+ files | HIGH ⚠️ |
| **Option 2** (Transform helper) | ~100 lines | 34 files | MEDIUM ⚠️ |
| **Option 3** (Field aliases) | ~340 lines | 50+ files | HIGH ⚠️ |
| **Option 4** (Keep current) | 0 lines | 0 files | NONE ✅ |

---

## Recommendations

### 1. **Keep Current Architecture** ✅

**Reasoning**:
- Clean separation of concerns
- Type-safe transformations
- Explicit and debuggable
- No major complexity issues
- Scales well with new queries

### 2. **Add Naming Convention Documentation** 📚

Create `SDK_NAMING_CONVENTIONS.md`:
```markdown
# SDK Naming Conventions

## Field Name Mappings (SDK → API)

| SDK Name | API Name | Reason |
|----------|----------|--------|
| `collectionAddress` | `contractAddress` | More specific in marketplace context |
| `collectibleId` | `tokenId` | Aligns with marketplace terminology |
| `walletAddress` | `wallet` | More explicit about address type |

## Parameter Patterns

All SDK query parameters include:
- `config: SdkConfig` - Required for API client instantiation
- Renamed fields for better DX
- Flattened nested objects (e.g., `Page` → `page`, `pageSize`, `sort`)
```

### 3. **Consider Code Generation for Future** 🤖

When adding many new queries, consider:
- Template-based generation from API specs
- Automated field mapping based on conventions
- Reduces manual errors and maintenance

### 4. **Standard Comment Format** 💬

Add inline comments for field transformations:
```typescript
const apiArgs = {
	contractAddress: collectionAddress,  // SDK naming
	tokenId: collectibleId,              // SDK naming
	chainId,                             // No change
	...additionalApiParams,
};
```

---

## Conclusion

**The current parameter transformation pattern is correct and should be maintained.**

While it creates repetitive code, this repetition serves important purposes:
1. **Type Safety** - Compile-time checking of transformations
2. **Developer Experience** - SDK uses intuitive naming
3. **Maintainability** - Explicit transformations are easy to debug
4. **Separation of Concerns** - Clear boundary between SDK and API layers

The perceived "boilerplate" is actually **explicit business logic** that:
- Maps SDK concepts to API contracts
- Handles config injection
- Provides ergonomic interfaces

**Attempting to eliminate this layer would introduce more complexity than it removes.**

---

## Appendix: Full Query File List

<details>
<summary>Click to expand full list of query files with Params interfaces</summary>

### Collectible (12 files)
1. `sdk/src/react/queries/collectible/market-list.ts`
2. `sdk/src/react/queries/collectible/market-highest-offer.ts`
3. `sdk/src/react/queries/collectible/market-listings.ts`
4. `sdk/src/react/queries/collectible/metadata.ts`
5. `sdk/src/react/queries/collectible/market-offers.ts`
6. `sdk/src/react/queries/collectible/market-offers-count.ts`
7. `sdk/src/react/queries/collectible/primary-sale-items-count.ts`
8. `sdk/src/react/queries/collectible/primary-sale-items.ts`
9. `sdk/src/react/queries/collectible/market-count.ts`
10. `sdk/src/react/queries/collectible/market-listings-count.ts`
11. `sdk/src/react/queries/collectible/market-activities.ts`
12. `sdk/src/react/queries/collectible/market-lowest-listing.ts`

### Collection (9 files)
13. `sdk/src/react/queries/collection/market-activities.ts`
14. `sdk/src/react/queries/collection/market-items.ts`
15. `sdk/src/react/queries/collection/market-detail.ts`
16. `sdk/src/react/queries/collection/market-items-paginated.ts`
17. `sdk/src/react/queries/collection/balance-details.ts`
18. `sdk/src/react/queries/collection/market-items-count.ts`
19. `sdk/src/react/queries/collection/market-filtered-count.ts`
20. `sdk/src/react/queries/collection/market-floor.ts`
21. `sdk/src/react/queries/collection/metadata.ts`

### Token (5 files)
22. `sdk/src/react/queries/token/supplies.ts`
23. `sdk/src/react/queries/token/balances.ts`
24. `sdk/src/react/queries/token/ranges.ts`
25. `sdk/src/react/queries/token/metadata-search.ts`
26. `sdk/src/react/queries/token/metadata.ts`

### Currency (4 files)
27. `sdk/src/react/queries/currency/list.ts`
28. `sdk/src/react/queries/currency/currency.ts`
29. `sdk/src/react/queries/currency/convert-to-usd.ts`
30. `sdk/src/react/queries/currency/compare-prices.ts`

### Checkout (2 files)
31. `sdk/src/react/queries/checkout/market-checkout-options.ts`
32. `sdk/src/react/queries/checkout/primary-sale-checkout-options.ts`

### Marketplace (2 files)
33. `sdk/src/react/queries/marketplace/filters.ts`
34. `sdk/src/react/queries/marketplace/config.ts`

</details>

---

**Document Version**: 1.0  
**Date**: 2025-11-17  
**Author**: Code Analysis (OpenCode AI)
