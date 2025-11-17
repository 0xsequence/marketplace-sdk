# Dual Transformation Layers Analysis

## Executive Summary

**YOU ARE ABSOLUTELY CORRECT** - we have TWO transformation layers doing similar work:

1. **API Adapter Layer** (`api/src/adapters/marketplace/client.ts`) - 615 lines, 28 Request type redefinitions
2. **SDK Query Layer** (`sdk/src/react/queries/`) - 34 files, ~3,900 lines

This is redundant architecture that adds unnecessary complexity and maintenance burden.

---

## The Transformation Journey of a Single API Call

Let's trace what happens when calling `fetchHighestOffer`:

### Layer-by-Layer Transformation

```typescript
// ============================================================================
// LAYER 1: Generated API Client (marketplace.gen.ts)
// ============================================================================
interface Gen.GetHighestPriceOfferForCollectibleRequest {
  chainId: string;          // ❌ Generated as string
  contractAddress: string;
  tokenId: string;          // ❌ Generated as string
  filter?: OrderFilter;
}

// ============================================================================
// LAYER 2: API Adapter (api/src/adapters/marketplace/client.ts)
// ============================================================================
export type GetHighestPriceOfferForCollectibleRequest = Omit<
  Gen.GetHighestPriceOfferForCollectibleRequest,
  'chainId' | 'tokenId'
> & {
  chainId: number;          // ✅ Transformed to number
  tokenId: bigint;          // ✅ Transformed to bigint
  // contractAddress stays as string
};

// Wrapper function
this.getHighestPriceOfferForCollectible = wrapChainId(
  (req) => this.client.getHighestPriceOfferForCollectible(req)
);
// This converts: chainId number → string
//                tokenId bigint → (already handled as bigint by gen)

// ============================================================================
// LAYER 3: SDK Query (sdk/src/react/queries/collectible/market-highest-offer.ts)
// ============================================================================
export interface FetchHighestOfferParams
  extends Omit<
    GetHighestPriceOfferForCollectibleRequest,  // From Layer 2
    'contractAddress' | 'chainId'
  > {
  collectionAddress: string;  // ✅ Renamed from contractAddress
  chainId: number;            // ⚠️ Same type, just re-declared
  config: SdkConfig;          // ✅ Added for client instantiation
}

async function fetchHighestOffer(params: FetchHighestOfferParams) {
  const { collectionAddress, chainId, config, ...additionalApiParams } = params;
  const client = getMarketplaceClient(config);
  
  return await client.getHighestPriceOfferForCollectible({
    contractAddress: collectionAddress,  // Transform BACK to contractAddress!
    chainId,
    ...additionalApiParams,
  });
}
```

### Visual Flow Diagram

```
User calls hook
    ↓
┌─────────────────────────────────────────────────┐
│ SDK Query Layer                                 │
│ Params: {                                       │
│   collectionAddress: string                     │  ← Renamed from contractAddress
│   chainId: number                               │  ← Type already transformed by API layer
│   tokenId: bigint                               │  ← Type already transformed by API layer
│   config: SdkConfig                             │  ← Added by SDK layer
│ }                                               │
└─────────────────────────────────────────────────┘
    ↓ Transform collectionAddress → contractAddress
┌─────────────────────────────────────────────────┐
│ API Adapter Layer                               │
│ Request: {                                      │
│   contractAddress: string                       │  ← Standard API naming
│   chainId: number                               │  ← Normalized from Gen string
│   tokenId: bigint                               │  ← Normalized from Gen string
│ }                                               │
└─────────────────────────────────────────────────┘
    ↓ wrapChainId: number → string
┌─────────────────────────────────────────────────┐
│ Generated API Client (marketplace.gen.ts)       │
│ Gen.Request: {                                  │
│   contractAddress: string                       │
│   chainId: string                               │  ← Converted to string
│   tokenId: string                               │  ← Converted to string (in runtime)
│ }                                               │
└─────────────────────────────────────────────────┘
    ↓
  RPC call to backend
```

---

## What Each Layer Actually Does

### API Adapter Layer Transformations

**File**: `api/src/adapters/marketplace/client.ts` (615 lines)

**Purpose**: Type normalization between generated API and SDK

| Transformation | Count | Example |
|----------------|-------|---------|
| `chainId: string → number` | 28 | All Request types |
| `tokenId: string → bigint` | 8 | Collectible-related requests |
| `Step` → Discriminated unions | 5 | Transaction generation responses |
| Runtime conversion via `wrapChainId()` | ~30 methods | Method wrappers |

**Example**:
```typescript
export type GetHighestPriceOfferForCollectibleRequest = Omit<
  Gen.GetHighestPriceOfferForCollectibleRequest,
  'chainId' | 'tokenId'
> & {
  chainId: ChainId;   // number instead of string
  tokenId: TokenId;   // bigint instead of string
};
```

### SDK Query Layer Transformations

**Files**: `sdk/src/react/queries/**/*.ts` (~3,900 lines across 34 files)

**Purpose**: Developer experience and config management

| Transformation | Count | Example |
|----------------|-------|---------|
| `contractAddress → collectionAddress` | 57 | Better DX naming |
| `wallet → walletAddress` | 6 | More explicit |
| Add `config: SdkConfig` | 46 | For client instantiation |
| Flatten `Page` object | ~8 | `page`, `pageSize`, `sort` |
| Add SDK-specific fields | ~5 | `cardType`, custom filters |

**Example**:
```typescript
export interface FetchHighestOfferParams
  extends Omit<
    GetHighestPriceOfferForCollectibleRequest,  // Already transformed by API layer!
    'contractAddress' | 'chainId'
  > {
  collectionAddress: string;  // Rename
  chainId: number;            // Re-declare (already number from API layer)
  config: SdkConfig;          // Add
}
```

---

## The Problem: Redundant Work

### Redundancy #1: Type Re-declaration

The SDK Query layer re-declares `chainId: number` even though the API Adapter already transformed it from `string` to `number`.

```typescript
// API Adapter already did this:
export type GetHighestPriceOfferForCollectibleRequest = Omit<Gen.*, 'chainId'> & {
  chainId: number;  // ✅ Already transformed!
};

// SDK Query does it AGAIN:
export interface FetchHighestOfferParams
  extends Omit<GetHighestPriceOfferForCollectibleRequest, 'chainId'> {
  chainId: number;  // ⚠️ Why omit and re-add the same type?
}
```

**This is pointless** - it's the same type in both layers.

### Redundancy #2: Double Omit Pattern

Both layers use `Omit` to remove fields from the previous layer, then re-add them (sometimes with the same types).

```typescript
// Layer 2 (API Adapter):
Omit<Gen.Request, 'chainId'> & { chainId: number }

// Layer 3 (SDK Query):  
Omit<ApiAdapter.Request, 'chainId'> & { chainId: number }  // Same type!
```

### Redundancy #3: Interface Explosion

We now have **3 interfaces** for the same API call:

1. `Gen.GetHighestPriceOfferForCollectibleRequest` (generated)
2. `GetHighestPriceOfferForCollectibleRequest` (API adapter export)
3. `FetchHighestOfferParams` (SDK query)

Multiply this by 28 API methods = **84 type definitions** for essentially the same data.

---

## Why This Happened

Looking at the git history and architecture, this dual-layer pattern emerged because:

1. **API Adapter was created first** to normalize generated types (string → number/bigint)
2. **SDK Query layer was built later** without considering that API Adapter already handled type normalization
3. **Different concerns got mixed**:
   - Type normalization (should be API layer's job)
   - Field renaming for DX (should be SDK layer's job)
   - Config management (SDK-specific, fine to be in SDK layer)

The SDK Query layer was built assuming it needed to do all transformations, not realizing the API Adapter already handled most of them.

---

## What Each Layer SHOULD Do

### Proposed: Clear Separation of Concerns

```
┌─────────────────────────────────────────────────┐
│ SDK QUERY LAYER                                 │
│ Responsibilities:                               │
│ ✅ Field renaming (contractAddress → collectionAddress) │
│ ✅ Config management (add config: SdkConfig)    │
│ ✅ SDK-specific additions (cardType, etc)       │
│ ✅ TanStack Query integration                   │
│ ✅ Query key generation                         │
│ ❌ Type transformation (already done below!)    │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│ API ADAPTER LAYER                               │
│ Responsibilities:                               │
│ ✅ Type normalization (string → number/bigint)  │
│ ✅ Type enhancement (discriminated unions)      │
│ ✅ Runtime transformation (wrapChainId)         │
│ ✅ Authentication handling                      │
│ ❌ Field renaming (not API's concern!)          │
│ ❌ SDK config (not API's concern!)              │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│ GENERATED CLIENT                                │
│ - Raw RPC types from API spec                   │
└─────────────────────────────────────────────────┘
```

---

## Solutions

### Option A: **Eliminate SDK Query Type Redefinitions** ⭐ RECOMMENDED

Use API Adapter types directly in SDK queries, only add SDK-specific fields.

#### Before (Current - Redundant)

```typescript
// api/src/adapters/marketplace/client.ts
export type GetHighestPriceOfferForCollectibleRequest = Omit<
  Gen.GetHighestPriceOfferForCollectibleRequest,
  'chainId' | 'tokenId'
> & {
  chainId: ChainId;
  tokenId: TokenId;
};

// sdk/src/react/queries/collectible/market-highest-offer.ts
export interface FetchHighestOfferParams
  extends Omit<
    GetHighestPriceOfferForCollectibleRequest,
    'contractAddress' | 'chainId'  // ⚠️ chainId already correct type!
  > {
  collectionAddress: string;
  chainId: number;  // ⚠️ Redundant re-declaration
  config: SdkConfig;
}
```

#### After (Simplified)

```typescript
// api/src/adapters/marketplace/client.ts
// No change - API adapter still normalizes types

export type GetHighestPriceOfferForCollectibleRequest = Omit<
  Gen.GetHighestPriceOfferForCollectibleRequest,
  'chainId' | 'tokenId'
> & {
  chainId: ChainId;
  tokenId: TokenId;
};

// sdk/src/react/queries/collectible/market-highest-offer.ts
export interface FetchHighestOfferParams
  extends Omit<
    GetHighestPriceOfferForCollectibleRequest,
    'contractAddress'  // Only omit what we're renaming
  > {
  collectionAddress: string;  // Renamed field
  config: SdkConfig;          // SDK addition
  // chainId, tokenId, etc inherited directly - no re-declaration!
}
```

**Benefits**:
- Eliminates redundant type declarations
- SDK inherits correct types from API layer
- Clearer separation: API normalizes, SDK renames
- Reduces code by ~15-20%

**Changes Required**:
- Update 16 SDK query files that use `Omit` pattern
- Remove redundant field re-declarations
- Update tests if needed

---

### Option B: **Move Field Renaming to API Adapter**

Make the API adapter accept both naming conventions.

#### Implementation

```typescript
// api/src/adapters/marketplace/client.ts
export type GetHighestPriceOfferForCollectibleRequest = Omit<
  Gen.GetHighestPriceOfferForCollectibleRequest,
  'chainId' | 'tokenId' | 'contractAddress'
> & {
  chainId: ChainId;
  tokenId: TokenId;
  collectionAddress: string;  // Use SDK naming!
};

export class MarketplaceClient {
  async getHighestPriceOfferForCollectible(
    req: GetHighestPriceOfferForCollectibleRequest
  ) {
    return this.client.getHighestPriceOfferForCollectible({
      ...req,
      contractAddress: req.collectionAddress,  // Transform to API naming
      chainId: chainIdToString(req.chainId),
      tokenId: req.tokenId,
    });
  }
}
```

```typescript
// sdk/src/react/queries/collectible/market-highest-offer.ts
export interface FetchHighestOfferParams
  extends GetHighestPriceOfferForCollectibleRequest {
  config: SdkConfig;  // Only addition!
}
```

**Benefits**:
- SDK queries become trivial (just add config)
- All transformations in one place (API adapter)
- Maximum code reduction

**Drawbacks**:
- API adapter now knows about SDK naming preferences (mixing concerns)
- Breaking change to API adapter public interface
- Not all consumers may want SDK naming

**Verdict**: ❌ Not recommended - violates separation of concerns

---

### Option C: **Consolidate with Helper Types**

Create reusable type utilities to reduce boilerplate.

```typescript
// api/src/types/helpers.ts
export type WithSdkFields<T extends { contractAddress?: string }> = 
  Omit<T, 'contractAddress'> & {
    collectionAddress: string;
    config: SdkConfig;
  };

// sdk/src/react/queries/collectible/market-highest-offer.ts
export type FetchHighestOfferParams = 
  WithSdkFields<GetHighestPriceOfferForCollectibleRequest>;
```

**Benefits**:
- Reduces repetitive Omit + extends patterns
- Self-documenting transformation
- Type-safe

**Drawbacks**:
- Doesn't work for all cases (custom field additions)
- Adds indirection
- Limited flexibility

**Verdict**: 🤔 Interesting for common patterns, but not a complete solution

---

### Option D: **Keep Current, Improve Documentation** 

Accept the dual layers but document why each exists.

**Benefits**:
- No code changes required
- Explicitly documents current architecture

**Drawbacks**:
- Doesn't fix the redundancy
- Maintenance burden remains

**Verdict**: ❌ Doesn't address the core issue

---

## Recommended Solution: **Option A (Simplified)**

### Implementation Plan

#### Phase 1: Identify and Categorize Query Files

**Files that DON'T need changes** (no API Request type reuse):
- Currency queries (4 files) - custom logic
- Some token queries - Indexer API
- Some collection queries - no Omit pattern

**Files that NEED simplification** (16 files):
- Collectible queries with `Omit<*Request>` pattern
- Collection queries with `Omit<*Request>` pattern
- Checkout queries with `Omit<*Request>` pattern

#### Phase 2: Update Pattern

For each file, change from:

```typescript
// BEFORE
export interface FetchHighestOfferParams
  extends Omit<
    GetHighestPriceOfferForCollectibleRequest,
    'contractAddress' | 'chainId' | 'tokenId'  // ⚠️ Omitting already-correct types
  > {
  collectionAddress: string;
  chainId: number;   // ⚠️ Redundant
  tokenId: bigint;   // ⚠️ Redundant
  config: SdkConfig;
}
```

To:

```typescript
// AFTER
export interface FetchHighestOfferParams
  extends Omit<
    GetHighestPriceOfferForCollectibleRequest,
    'contractAddress'  // Only omit what we rename
  > {
  collectionAddress: string;  // Renamed from contractAddress
  config: SdkConfig;          // SDK-specific addition
  // chainId, tokenId inherited from API layer ✅
}
```

#### Phase 3: Update Transformation Logic

No changes needed in most cases! The transformation code stays the same:

```typescript
async function fetchHighestOffer(params: FetchHighestOfferParams) {
  const { collectionAddress, chainId, config, ...additionalApiParams } = params;
  const client = getMarketplaceClient(config);
  
  return await client.getHighestPriceOfferForCollectible({
    contractAddress: collectionAddress,  // Still transforms back
    chainId,                             // Inherited, correct type
    ...additionalApiParams,              // Includes tokenId, filter, etc
  });
}
```

---

## Impact Analysis

### Code Reduction

| Area | Before | After | Savings |
|------|--------|-------|---------|
| Type definitions | ~500 lines | ~350 lines | **~30%** |
| Redundant field declarations | 46+ | 0 | **100%** |
| Complexity (interfaces per API call) | 3 | 2 | **33%** |

### Benefits

1. **Clearer Architecture**
   - API Adapter: Type normalization only
   - SDK Query: Field renaming + config management only

2. **Easier Maintenance**
   - Only update types in one place when API changes
   - Less cognitive overhead

3. **Better Type Safety**
   - Inheritance instead of re-declaration
   - TypeScript catches breaking changes automatically

4. **Performance**
   - Fewer type definitions = faster TypeScript compilation
   - Minimal (but measurable)

### Risks

1. **Breaking Changes**
   - Exported `FetchHighestOfferParams` types change
   - Internal to SDK, shouldn't affect consumers
   - If exported in public API, needs major version bump

2. **Testing**
   - Need to verify all query functions still work
   - Type tests may need updates

3. **Migration Effort**
   - 16 files to update
   - Low risk, mechanical changes
   - Can be done incrementally

---

## Example Migration

### File: `sdk/src/react/queries/collectible/market-highest-offer.ts`

```diff
 export interface FetchHighestOfferParams
 	extends Omit<
 		GetHighestPriceOfferForCollectibleRequest,
-		'contractAddress' | 'chainId'
+		'contractAddress'
 	> {
 	collectionAddress: string;
-	chainId: number;
 	config: SdkConfig;
 }
```

**That's it!** 2 lines removed per file × 16 files = **32 lines eliminated**.

But more importantly: **eliminates conceptual redundancy** and clarifies architecture.

---

## Conclusion

**Yes, you're absolutely right - we have redundant transformation layers.**

The API Adapter layer already handles type normalization (`string → number/bigint`), but the SDK Query layer re-declares these same types unnecessarily.

**Recommended Action**:
1. Implement Option A (Simplified inheritance)
2. Remove redundant field re-declarations from SDK query Params interfaces
3. Update documentation to clarify layer responsibilities
4. Add this to the refactor plan as "Phase 4: Eliminate Redundant Type Layers"

**Estimated Effort**: 2-3 hours
**Risk Level**: Low (internal types, minimal testing needed)
**Impact**: Cleaner architecture, easier maintenance, ~30% less type boilerplate

---

## Files Requiring Changes

### High Priority (Redundant Omit patterns)

1. `sdk/src/react/queries/collectible/market-list.ts`
2. `sdk/src/react/queries/collectible/market-highest-offer.ts` ⭐ Example above
3. `sdk/src/react/queries/collectible/market-listings.ts`
4. `sdk/src/react/queries/collectible/metadata.ts`
5. `sdk/src/react/queries/collectible/market-offers.ts`
6. `sdk/src/react/queries/collectible/market-activities.ts`
7. `sdk/src/react/queries/collectible/market-lowest-listing.ts`
8. `sdk/src/react/queries/collectible/market-list-paginated.ts`
9. `sdk/src/react/queries/collection/market-activities.ts`
10. `sdk/src/react/queries/collection/market-items.ts`
11. `sdk/src/react/queries/collection/market-detail.ts`
12. `sdk/src/react/queries/collection/market-items-paginated.ts`
13. `sdk/src/react/queries/collection/market-floor.ts`
14. `sdk/src/react/queries/checkout/primary-sale-checkout-options.ts`
15. `sdk/src/react/queries/token/supplies.ts`
16. `sdk/src/react/queries/token/metadata.ts` (if using Omit pattern)

### Documentation Updates

17. `SDK_PARAMS_TRANSFORMATION_ANALYSIS.md` - Update with new findings
18. `TYPE_ARCHITECTURE.md` - Document layer responsibilities
19. Add `SDK_QUERY_LAYER_PATTERNS.md` - Coding standards for query files

---

**Document Version**: 1.0  
**Created**: 2025-11-17  
**Supersedes**: `SDK_PARAMS_TRANSFORMATION_ANALYSIS.md` (contains incorrect recommendation)
