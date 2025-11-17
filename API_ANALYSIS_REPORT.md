# API Wrapper Analysis & Optimization Report

## Changelog

### 2025-01-17 - ProjectId Type Fix ✅
**Fixed**: `ProjectId` was unnecessarily being converted from `number` to `bigint` and back.

**Changes**:
- Updated `ProjectId` type definition: `bigint` → `number`
- Removed unnecessary `BigInt()` conversions in builder transforms
- Removed unnecessary `Number()` conversions in builder transforms
- Updated documentation comments

**Files Modified**:
- `api/src/types/primitives.ts` - Changed type definition
- `api/src/adapters/builder/transforms.ts` - Removed conversions (8 locations)
- `api/src/adapters/builder/index.ts` - Updated documentation

**Impact**: More efficient, matches actual API type, eliminates unnecessary conversions.

---

## Executive Summary

The `@api/` folder provides a clean abstraction layer over multiple Sequence APIs (Builder, Indexer, Marketplace, Metadata), normalizing inconsistent type representations into a unified SDK-friendly interface. The architecture is **well-designed** with clear patterns, but there are several opportunities for:

1. **Code deduplication** through shared utilities
2. **Enhanced type safety** to reduce SDK-level type duplication
3. **Simplified transform patterns** using generic factories
4. **Better documentation** of the normalization strategy

## Architecture Overview

```
api/
├── types/
│   └── primitives.ts           # Universal type primitives (ChainId, TokenId, etc.)
├── utils/
│   ├── bigint.ts               # BigInt parsing/formatting helpers
│   ├── chain.ts                # ChainId normalization
│   ├── token.ts                # TokenId normalization
│   └── type-assertions.ts      # Compile-time type verification
└── adapters/
    ├── builder/                # Normalizes Builder API
    ├── indexer/                # Normalizes Indexer API
    ├── marketplace/            # Normalizes Marketplace API
    └── metadata/               # Normalizes Metadata API
```

### Key Normalizations

| Adapter | Raw API Types | Normalized Types |
|---------|--------------|------------------|
| **Builder** | `projectId: number`<br>`chainId: number`<br>`tokenIds: string[]` | `ProjectId: number` ✅<br>`ChainId: number`<br>`TokenId[]: bigint[]` |
| **Indexer** | `chainId: number`<br>`tokenID: string` ⚠️ uppercase<br>`balance: string` | `ChainId: number`<br>`TokenId: bigint`<br>`Amount: bigint` |
| **Marketplace** | `chainId: string`<br>`tokenId: bigint`<br>`quantity: string` | `ChainId: number`<br>`TokenId: bigint`<br>`Quantity: bigint` |
| **Metadata** | `chainID: string` ⚠️ uppercase<br>`tokenId: string`<br>`tokenIDs: string[]` | `ChainId: number`<br>`TokenId: bigint`<br>`TokenId[]: bigint[]` |

⚠️ **Note**: The inconsistency in field naming (`tokenID` vs `tokenId`, `chainID` vs `chainId`) across APIs is a significant source of transformation complexity.

---

## 1. Current Implementation Strengths

### ✅ Clear Separation of Concerns
Each adapter follows a consistent pattern:
- `types.ts` - Normalized type definitions
- `transforms.ts` - Bidirectional transformations
- `client.ts` - Wrapped client with automatic conversion
- `index.ts` - Public API surface

### ✅ Type Safety via Primitives
The `types/primitives.ts` provides universal type aliases:
```typescript
export type ChainId = number;
export type TokenId = bigint;
export type Amount = bigint;
export type Address = ViemAddress;
```

This ensures consistency across all adapters.

### ✅ Compile-Time Verification
`utils/type-assertions.ts` validates type compatibility across packages:
```typescript
const _assertPropertyTypeMatch: AssertIdentical<
  typeof MarketplacePropertyType,
  typeof MetadataPropertyType
> = true;
```

### ✅ Discriminated Step Types
The marketplace adapter provides excellent type refinement:
```typescript
export type Step = SignatureStep | TransactionStep;

export function isSignatureStep(step: Step): step is SignatureStep {
  return step.id === StepType.signEIP191 || step.id === StepType.signEIP712;
}
```

---

## 2. Issues & Optimization Opportunities

### 🔴 Issue 1: Repetitive ChainId Conversion in Marketplace Client

**Problem**: The `MarketplaceClient` manually converts `chainId` in **28 methods**, all following the same pattern:

```typescript
// Repeated 28 times!
async getCollectible(req: GetCollectibleRequest) {
  return this.client.getCollectible({
    ...req,
    chainId: chainIdToString(req.chainId),
  });
}
```

**Impact**: 
- ~400 lines of boilerplate code
- High maintenance burden when adding new methods
- Risk of inconsistent conversion

**Solution**: Use a generic proxy or method decorator

```typescript
class MarketplaceClient {
  private normalizeRequest<T extends { chainId?: ChainId }>(
    req: T
  ): Omit<T, 'chainId'> & { chainId: string } {
    return {
      ...req,
      chainId: req.chainId?.toString() ?? '',
    };
  }

  // Then each method becomes:
  async getCollectible(req: GetCollectibleRequest) {
    return this.client.getCollectible(this.normalizeRequest(req));
  }
}
```

**Better Solution**: Auto-wrapping proxy (see Section 3)

---

### 🔴 Issue 2: Duplicate Request Type Definitions

**Problem**: The marketplace adapter manually redefines **28 request types** using `Omit<...>`:

```typescript
export type GetCollectibleRequest = Omit<Gen.GetCollectibleRequest, 'chainId'> & {
  chainId: ChainId; // number instead of string
};

export type ListCurrenciesRequest = Omit<Gen.ListCurrenciesRequest, 'chainId'> & {
  chainId: ChainId; // number instead of string
};

// ... 26 more times
```

**Impact**:
- ~400 lines of type definitions
- Synchronization risk with generated types
- Every new API method requires manual type definition

**Solution**: Generic type transformer

```typescript
type NormalizeRequest<T> = T extends { chainId: string }
  ? Omit<T, 'chainId'> & { chainId: ChainId }
  : T;

// Auto-applies to all request types
export type GetCollectibleRequest = NormalizeRequest<Gen.GetCollectibleRequest>;
```

---

### 🟡 Issue 3: Transform Function Duplication

**Problem**: Similar transformation patterns across adapters:

**Builder** (`builder/transforms.ts`):
```typescript
export function toMarketCollection(data: BuilderGen.MarketCollection) {
  return {
    ...data,
    projectId: BigInt(data.projectId),
    chainId: normalizeChainId(data.chainId),
  };
}
```

**Indexer** (`indexer/transforms.ts`):
```typescript
export function toContractInfo(raw: IndexerGen.ContractInfo) {
  return {
    ...raw,
    chainId: normalizeChainId(raw.chainId),
    // ... more normalizations
  };
}
```

**Metadata** (`metadata/transforms.ts`):
```typescript
export function toContractInfo(raw: MetadataGen.ContractInfo) {
  return {
    ...raw,
    chainId: normalizeChainId(raw.chainId),
    extensions: toContractInfoExtensions(raw.extensions),
  };
}
```

**Impact**: 
- Pattern repetition across 4 adapters
- ~1000 lines of similar transformation code

**Solution**: Generic transformation utilities (see Section 3)

---

### ✅ ~~Issue 4: Missing SDK Type Optimization~~ **FIXED**

~~**Problem**: The SDK still redefines types that could be imported from the API wrapper:~~

**UPDATE**: This has been fixed! `ProjectId` is now correctly defined as `number` in both the API wrapper and SDK, matching the actual API response type. The unnecessary BigInt conversions have been removed.

**Changes Made**:
- Changed `ProjectId` type from `bigint` → `number` in `api/src/types/primitives.ts`
- Removed `BigInt(projectId)` conversions in Builder transforms
- Removed `Number(projectId)` conversions in Builder transforms
- Updated documentation to reflect passthrough behavior

**Remaining Opportunity**:
- SDK still redefines ~200 lines of types that could be imported from API wrapper
- Consider importing and extending API wrapper types instead of duplicating them

---

### 🟢 Issue 5: Inconsistent Array Transformers

**Problem**: Some adapters provide convenience array transformers, others don't:

**Indexer** (✅ Has convenience transformers):
```typescript
export function toTokenBalances(raw: IndexerGen.TokenBalance[]) {
  return raw.map(toTokenBalance);
}
```

**Builder** (❌ Missing):
```typescript
// No convenience transformers for arrays
// Users must manually map: data.shopCollections.map(toShopCollection)
```

**Impact**: Inconsistent developer experience

**Solution**: Standardize array transformer pattern across all adapters

---

### 🟢 Issue 6: Missing Transform Utilities

**Problem**: Some common transformations lack dedicated utilities:

1. **Nested object transformations** - No helper for deep object transformations
2. **Conditional transformations** - Manual `? ... : undefined` patterns repeated
3. **Array filtering** - No utilities for filtering during transformation

**Examples**:

```typescript
// Repeated conditional pattern
originChainId: raw.extensions.originChainId !== undefined
  ? normalizeChainId(raw.extensions.originChainId)
  : undefined,

// Repeated array mapping
tokenIds: data.tokenIds.map(id => normalizeTokenId(id)),
```

**Solution**: Utility functions for common patterns

---

## 3. Proposed Global Helpers

### Helper 1: Generic Field Transformer

```typescript
// api/src/utils/transform.ts

/**
 * Transform specific fields in an object using provided transform functions
 */
export function transformFields<
  T extends Record<string, any>,
  K extends keyof T,
  R = {
    [P in keyof T]: P extends K 
      ? ReturnType<Extract<Transformers[P], (...args: any) => any>>
      : T[P]
  }
>(
  obj: T,
  transformers: { [P in K]?: (value: T[P]) => any }
): R {
  const result = { ...obj } as any;
  
  for (const key in transformers) {
    if (key in obj && transformers[key]) {
      result[key] = transformers[key]!(obj[key]);
    }
  }
  
  return result;
}

// Usage in transforms:
export function toMarketCollection(data: BuilderGen.MarketCollection) {
  return transformFields(data, {
    projectId: BigInt,
    chainId: normalizeChainId,
  });
}
```

### Helper 2: Auto-Wrapping Client Proxy

```typescript
// api/src/utils/client-proxy.ts

type ChainIdNormalizer<T> = T extends { chainId: string }
  ? Omit<T, 'chainId'> & { chainId: number }
  : T;

/**
 * Wraps a client and auto-converts chainId: number → string for all methods
 */
export function createChainIdNormalizingProxy<T extends object>(
  client: T
): {
  [K in keyof T]: T[K] extends (req: infer Req, ...args: infer Args) => infer Ret
    ? Req extends { chainId: string }
      ? (req: ChainIdNormalizer<Req>, ...args: Args) => Ret
      : T[K]
    : T[K]
} {
  return new Proxy(client, {
    get(target, prop) {
      const value = target[prop as keyof T];
      
      if (typeof value !== 'function') {
        return value;
      }
      
      return function(req: any, ...args: any[]) {
        // Auto-convert chainId if present
        const normalizedReq = req?.chainId !== undefined
          ? { ...req, chainId: req.chainId.toString() }
          : req;
          
        return value.call(target, normalizedReq, ...args);
      };
    }
  }) as any;
}

// Usage:
export class MarketplaceClient {
  private client: Gen.Marketplace;
  private proxy: ReturnType<typeof createChainIdNormalizingProxy<Gen.Marketplace>>;
  
  constructor(hostname: string, fetch: typeof globalThis.fetch) {
    this.client = new Gen.Marketplace(hostname, fetch);
    this.proxy = createChainIdNormalizingProxy(this.client);
  }
  
  // Now all methods auto-convert chainId!
  getCollectible = this.proxy.getCollectible;
  listCurrencies = this.proxy.listCurrencies;
  // ... etc (or use Proxy for all methods)
}
```

### Helper 3: Type-Safe Array Transformer

```typescript
// api/src/utils/transform.ts

/**
 * Transform an array, handling undefined/null gracefully
 */
export function transformArray<T, R>(
  arr: T[] | undefined | null,
  transformer: (item: T) => R
): R[] | undefined {
  return arr?.map(transformer);
}

/**
 * Transform optional field
 */
export function transformOptional<T, R>(
  value: T | undefined,
  transformer: (value: T) => R
): R | undefined {
  return value !== undefined ? transformer(value) : undefined;
}

// Usage:
export function toContractInfo(raw: MetadataGen.ContractInfo) {
  return {
    ...raw,
    chainId: normalizeChainId(raw.chainId),
    assets: transformArray(raw.assets, toAsset),
    extensions: transformOptional(raw.extensions, toContractInfoExtensions),
  };
}
```

### Helper 4: Generic Request Type Normalizer

```typescript
// api/src/utils/types.ts

/**
 * Normalize chainId field from string to number in any type
 */
export type NormalizeChainId<T> = T extends { chainId: string }
  ? Omit<T, 'chainId'> & { chainId: ChainId }
  : T;

/**
 * Normalize tokenId field from string to bigint in any type
 */
export type NormalizeTokenId<T> = T extends { tokenId: string | bigint }
  ? Omit<T, 'tokenId'> & { tokenId: TokenId }
  : T;

/**
 * Normalize both chainId and tokenId
 */
export type NormalizeRequest<T> = 
  NormalizeTokenId<NormalizeChainId<T>>;

// Auto-generate normalized types:
export type GetCollectibleRequest = NormalizeRequest<Gen.GetCollectibleRequest>;
export type ListCurrenciesRequest = NormalizeRequest<Gen.ListCurrenciesRequest>;
```

### Helper 5: Deep Object Field Transformer

```typescript
// api/src/utils/transform.ts

type TransformSpec<T> = {
  [K in keyof T]?: T[K] extends Array<infer U>
    ? (item: U) => any
    : T[K] extends object
    ? TransformSpec<T[K]>
    : (value: T[K]) => any;
};

/**
 * Deep transform object fields using a specification object
 */
export function deepTransform<T extends object, S extends TransformSpec<T>>(
  obj: T,
  spec: S
): any {
  const result: any = { ...obj };
  
  for (const key in spec) {
    const value = obj[key];
    const transformer = spec[key];
    
    if (value === undefined || transformer === undefined) {
      continue;
    }
    
    if (Array.isArray(value)) {
      result[key] = value.map(transformer as any);
    } else if (typeof value === 'object' && value !== null) {
      result[key] = deepTransform(value, transformer as any);
    } else {
      result[key] = (transformer as any)(value);
    }
  }
  
  return result;
}

// Usage:
export function toLookupMarketplaceReturn(data: BuilderGen.LookupMarketplaceReturn) {
  return deepTransform(data, {
    marketplace: {
      projectId: BigInt,
    },
    marketCollections: (collection) => ({
      ...collection,
      projectId: BigInt,
      chainId: normalizeChainId,
    }),
    shopCollections: (collection) => ({
      ...collection,
      projectId: BigInt,
      chainId: normalizeChainId,
      tokenIds: (ids) => ids.map(normalizeTokenId),
    }),
  });
}
```

---

## 4. SDK Type Improvements

### Current State: Type Duplication

**SDK** defines its own types:
```typescript
// sdk/src/types/types.ts
export interface MarketplaceConfig {
  projectId: number;  // ❌ Should be bigint
  // ... 50 more lines of type definitions
}

export interface MarketCollection {
  chainId: number;
  // ... duplicated from API wrapper
}
```

**API Wrapper** already has normalized types:
```typescript
// api/src/adapters/builder/types.ts
export interface Marketplace {
  projectId: ProjectId;  // ✅ bigint
  // ... same structure
}

export interface MarketCollection {
  chainId: ChainId;  // ✅ number
  // ... same structure
}
```

### Recommendation: Import and Extend

```typescript
// sdk/src/types/types.ts
import type {
  Marketplace,
  MarketCollection as ApiMarketCollection,
  ShopCollection as ApiShopCollection,
} from '@0xsequence/marketplace-api';

// SDK extends API types (only add SDK-specific fields)
export interface MarketplaceConfig extends Marketplace {
  // Only add SDK-specific computed fields here
}

export interface MarketCollection extends ApiMarketCollection {
  cardType: CardType;  // SDK-specific UI field
}

export interface ShopCollection extends ApiShopCollection {
  cardType: CardType;  // SDK-specific UI field
}
```

**Benefits**:
- Eliminate ~200 lines of duplicate type definitions
- Single source of truth for data types
- Automatic updates when API types change
- Better type safety (`projectId: bigint` propagates to SDK)

---

## 5. Better Type Returns from API Wrapper

### Current: SDK Needs Additional Transformations

```typescript
// SDK still needs to transform API responses
const response = await builder.lookupMarketplace(...);

// SDK manually adds `cardType` field
const marketCollections = response.marketCollections.map(c => ({
  ...c,
  cardType: 'market' as const,
}));
```

### Recommended: API Wrapper Returns SDK-Ready Types

**Option A**: Add optional SDK-specific fields to API types

```typescript
// api/src/adapters/builder/types.ts
export interface MarketCollection {
  // ... existing fields
  cardType?: 'market' | 'shop' | 'inventory-non-tradable';  // Optional SDK hint
}

// api/src/adapters/builder/transforms.ts
export function toMarketCollection(data: BuilderGen.MarketCollection) {
  return {
    // ... existing transformations
    cardType: 'market' as const,  // Auto-added by API wrapper
  };
}
```

**Option B**: SDK-specific transformer layer (RECOMMENDED)

```typescript
// sdk/src/adapters/marketplace.ts
import { Builder } from '@0xsequence/marketplace-api';

export function toSdkMarketCollection(
  apiCollection: Builder.MarketCollection
): SdkMarketCollection {
  return {
    ...apiCollection,
    cardType: 'market' as const,
  };
}

// Clean separation:
// - API wrapper handles API normalization (bigint, etc.)
// - SDK layer handles UI enrichment (cardType, etc.)
```

---

## 6. Recommended Implementation Plan

### Phase 1: Utility Helpers (1-2 days)
**Priority: HIGH | Impact: HIGH**

1. Create `api/src/utils/transform.ts` with generic helpers:
   - `transformFields<T>()` - Generic field transformer
   - `transformArray<T>()` - Safe array transformer
   - `transformOptional<T>()` - Optional field transformer
   - `deepTransform<T>()` - Deep object transformer

2. Create `api/src/utils/types.ts` with type helpers:
   - `NormalizeChainId<T>` - Auto-normalize chainId field
   - `NormalizeTokenId<T>` - Auto-normalize tokenId field
   - `NormalizeRequest<T>` - Combine both normalizations

3. Apply to one adapter (metadata) as proof of concept
4. Measure LOC reduction and type safety improvements

**Expected Impact**: 
- Reduce transform code by ~40%
- Eliminate ~200 lines of manual type definitions
- Improve maintainability

---

### Phase 2: Client Proxy Pattern (2-3 days)
**Priority: MEDIUM | Impact: HIGH**

1. Implement `createChainIdNormalizingProxy()` in `api/src/utils/client-proxy.ts`
2. Refactor `MarketplaceClient` to use proxy pattern
3. Remove 28 manual type definitions
4. Remove 28 manual method wrappers

**Expected Impact**:
- Reduce marketplace client from ~700 lines to ~100 lines
- Automatic chainId conversion for all methods
- Easier to add new API methods

---

### Phase 3: SDK Type Consolidation (2-3 days)
**Priority: MEDIUM | Impact: MEDIUM**

1. Review all SDK types in `sdk/src/types/types.ts`
2. Identify types that can be imported from API wrapper
3. Replace duplicates with imports + extensions
4. Fix `projectId: number` → `projectId: bigint` inconsistency

**Expected Impact**:
- Eliminate ~200 lines of SDK type definitions
- Fix type inconsistencies (projectId)
- Single source of truth for data types

---

### Phase 4: Standardization (1-2 days)
**Priority: LOW | Impact: MEDIUM**

1. Add array transformers to all adapters (Builder, Metadata)
2. Standardize error handling across adapters
3. Add JSDoc comments to all public transform functions
4. Update documentation with normalization guide

**Expected Impact**:
- Consistent developer experience
- Better IDE autocomplete and documentation
- Easier onboarding for new developers

---

## 7. Metrics & Expected Outcomes

### Current State
- **Total LOC**: ~4,500 lines across adapters
- **Transform functions**: ~80 functions
- **Type definitions**: ~120 types
- **Manual conversions**: ~28 in marketplace client alone

### After Phase 1-4 Implementation
- **Total LOC**: ~2,800 lines (38% reduction)
- **Transform functions**: ~40 functions (50% reduction via generics)
- **Type definitions**: ~60 types (50% reduction via generic normalizers)
- **Manual conversions**: 0 (proxy pattern eliminates all)

### Qualitative Improvements
- ✅ Easier to add new API methods (no manual wrapping)
- ✅ Type safety improvements (generic transformers are type-safe)
- ✅ Reduced maintenance burden (single source of truth)
- ✅ Better developer experience (consistent patterns)
- ✅ Lower risk of bugs (automated transformations)

---

## 8. Risks & Considerations

### Risk 1: Runtime Performance
**Concern**: Proxy pattern may have performance overhead

**Mitigation**: 
- Proxy overhead is negligible for async API calls (network latency >> proxy cost)
- Can benchmark and switch to generated wrappers if needed
- Consider build-time code generation as alternative

### Risk 2: Type Complexity
**Concern**: Generic helpers may be harder to understand

**Mitigation**:
- Provide extensive JSDoc comments
- Include usage examples in docs
- Keep generics simple and focused
- Maintain both generic and manual patterns initially

### Risk 3: Migration Effort
**Concern**: Refactoring existing code may introduce bugs

**Mitigation**:
- Implement in phases with testing at each step
- Use existing test suite to verify equivalence
- Keep old code alongside new for gradual migration
- Add runtime assertions during transition

---

## 9. Alternative Approaches

### Alternative 1: Code Generation
Instead of runtime proxies, use **build-time code generation**:

```typescript
// config/codegen.ts
generateNormalizedClient({
  source: 'Gen.Marketplace',
  normalizations: {
    chainId: 'string → number',
    tokenId: 'string → bigint',
  },
  output: 'MarketplaceClient',
});
```

**Pros**: Zero runtime overhead, explicit code
**Cons**: More build complexity, harder to debug

### Alternative 2: Decorator Pattern
Use TypeScript decorators for method normalization:

```typescript
class MarketplaceClient {
  @normalizeChainId
  async getCollectible(req: GetCollectibleRequest) {
    return this.client.getCollectible(req);
  }
}
```

**Pros**: Clean syntax, explicit per-method
**Cons**: Decorator syntax may change, requires experimental TS features

---

## 10. Conclusion

The `@api/` folder is **architecturally sound** with clear patterns and good separation of concerns. However, the implementation suffers from:

1. **High repetition** in transformation code (~40% of code is boilerplate)
2. **Type duplication** between API wrapper and SDK (~200 lines)
3. **Manual method wrapping** in clients (~700 lines in marketplace alone)

The proposed **utility helpers** and **proxy pattern** can reduce code by **38%** while improving type safety and maintainability.

**Recommended Action**: Implement **Phase 1** (utility helpers) as a proof of concept on the metadata adapter. Measure impact, gather feedback, then proceed with remaining phases.

### Priority Rankings
1. **Phase 1** (Utility Helpers): ⭐⭐⭐⭐⭐ - Highest ROI, foundational
2. **Phase 2** (Client Proxy): ⭐⭐⭐⭐ - Big impact, moderate risk
3. **Phase 3** (SDK Types): ⭐⭐⭐ - Important for consistency
4. **Phase 4** (Standardization): ⭐⭐ - Polish, nice-to-have

---

## Appendix A: Code Examples

### Example 1: Before/After Transformation

**Before** (manual transformation):
```typescript
export function toShopCollection(data: BuilderGen.ShopCollection) {
  return {
    id: data.id,
    projectId: BigInt(data.projectId),
    chainId: normalizeChainId(data.chainId),
    itemsAddress: data.itemsAddress,
    saleAddress: data.saleAddress,
    name: data.name,
    bannerUrl: data.bannerUrl,
    tokenIds: data.tokenIds.map(id => normalizeTokenId(id)),
    customTokenIds: data.customTokenIds.map(id => normalizeTokenId(id)),
    sortOrder: data.sortOrder,
    private: data.private,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}
```

**After** (with generic helper):
```typescript
export function toShopCollection(data: BuilderGen.ShopCollection) {
  return transformFields(data, {
    projectId: BigInt,
    chainId: normalizeChainId,
    tokenIds: (ids) => ids.map(normalizeTokenId),
    customTokenIds: (ids) => ids.map(normalizeTokenId),
  });
}
```

**Reduction**: 16 lines → 8 lines (50% reduction)

### Example 2: Client Method Wrapping

**Before** (28 manual methods):
```typescript
class MarketplaceClient {
  async getCollectible(req: GetCollectibleRequest) {
    return this.client.getCollectible({
      ...req,
      chainId: chainIdToString(req.chainId),
    });
  }
  
  async listCurrencies(req: ListCurrenciesRequest) {
    return this.client.listCurrencies({
      ...req,
      chainId: chainIdToString(req.chainId),
    });
  }
  
  // ... 26 more identical patterns
}
```

**After** (with proxy):
```typescript
class MarketplaceClient {
  private client: Gen.Marketplace;
  
  constructor(hostname: string, fetch: typeof globalThis.fetch) {
    this.client = createChainIdNormalizingProxy(
      new Gen.Marketplace(hostname, fetch)
    );
  }
  
  // All methods auto-wrapped!
  getCollectible = this.client.getCollectible;
  listCurrencies = this.client.listCurrencies;
  // ... etc
}
```

**Reduction**: ~700 lines → ~50 lines (93% reduction)

---

## Appendix B: Testing Strategy

### Unit Tests for Generic Helpers
```typescript
describe('transformFields', () => {
  it('transforms specified fields', () => {
    const input = { a: '123', b: 'hello', c: '456' };
    const result = transformFields(input, {
      a: BigInt,
      c: BigInt,
    });
    
    expect(result).toEqual({
      a: 123n,
      b: 'hello',
      c: 456n,
    });
  });
  
  it('preserves undefined fields', () => {
    const input = { a: '123', b: undefined };
    const result = transformFields(input, { a: BigInt });
    
    expect(result.b).toBeUndefined();
  });
});
```

### Integration Tests for Clients
```typescript
describe('MarketplaceClient', () => {
  it('auto-converts chainId from number to string', async () => {
    const client = new MarketplaceClient(HOSTNAME, fetch);
    
    // SDK passes number
    await client.getCollectible({
      chainId: 137,  // number
      contractAddress: '0x...',
      tokenId: 1n,
    });
    
    // Verify API received string
    expect(mockFetch).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        body: expect.stringContaining('"chainId":"137"'),
      })
    );
  });
});
```

---

**Report Generated**: 2025-01-17  
**Analyzed Lines of Code**: ~4,500  
**Reduction Potential**: ~38% (~1,700 lines)  
**Implementation Effort**: 6-10 days (4 phases)
