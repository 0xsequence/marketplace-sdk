# Naming Inconsistency Report: collectableId vs collectibleId vs tokenId

## Executive Summary

There is a naming inconsistency in the codebase where three different terms are used to refer to the same concept:
- `collectableId` (6 files)
- `collectibleId` (62 files) 
- `tokenId` (131 files)

**Recommendation: Standardize on `tokenId`**

## Analysis

### Current Usage Statistics

| Term | Files | Percentage | Layer |
|------|-------|------------|-------|
| `tokenId` | 131 | 66% | API layer, Core types |
| `collectibleId` | 62 | 31% | SDK layer, Playgrounds, UI |
| `collectableId` | 6 | 3% | Hook interfaces only |

### Where Each Term is Used

#### `collectableId` (Least Common - 6 files)
Used exclusively in the **balance hook interface**:
- `sdk/src/react/hooks/collectible/balance.tsx` (hook interface parameter)
- `sdk/src/react/hooks/collectible/balance.test.tsx` (tests)
- `sdk/src/react/queries/collectible/balance.ts` (query type definition)
- `playgrounds/shared/src/components/pages/CollectiblePageController.tsx` (passing to hook)
- `playgrounds/shared/src/components/ordersTable/_components/Action.tsx` (passing to hook)
- `sdk/src/react/ui/modals/CreateListingModal/Modal.tsx` (passing to hook)

**Key Issue**: This creates the awkward pattern:
```typescript
const collectibleId = ... // variable name
useCollectibleBalance({
  collectableId: collectibleId  // property name differs from variable
})
```

#### `collectibleId` (Common - 62 files)
Used throughout the **SDK and playground layers**:
- Route parameters: `:collectibleId`
- Store state: `collectibleId: bigint`
- Modal state: `collectibleId: bigint`
- Component props and variables
- JSDoc comments

#### `tokenId` (Most Common - 131 files)
Used in the **API layer and core types**:
- `api/src/adapters/indexer/types.ts`: All normalized types use `tokenId`
- `api/src/adapters/marketplace/*.ts`: All API types use `tokenId`
- Generated types: `tokenId: bigint`
- ERC standards reference: NFTs have a `tokenId`

## Why `tokenId` is the Correct Choice

### 1. **Industry Standard**
- ERC-721 and ERC-1155 standards use `tokenId`
- Ethereum ecosystem universally uses `tokenId`
- All blockchain APIs use `tokenId`

### 2. **Already Dominant in Codebase**
- API layer (66% of usage) already uses `tokenId`
- All generated types from marketplace/indexer APIs use `tokenId`
- Core type definitions use `tokenId`

### 3. **Clearer Semantics**
- "Collectible" is a domain concept (an NFT with metadata, listings, etc.)
- "Token" is the blockchain primitive (ERC-721/1155 token with an ID)
- The ID belongs to the token, not to the abstract collectible concept

### 4. **Eliminates Spelling Ambiguity**
- "Collectable" vs "Collectible" is a common spelling confusion
- "Token" has no such ambiguity

### 5. **Consistency with Related Terms**
The codebase already uses token-based terminology:
- `tokenMetadata`
- `TokenBalance`
- `TokenSupply`
- `tokenId` in API responses

## Current Problems

### Problem 1: Awkward Object Property Assignment
```typescript
// Current - requires different names
const collectibleId = params.collectibleId;
useCollectibleBalance({
  collectableId: collectibleId  // ❌ Not shorthand-compatible
})

// After fix with tokenId
const tokenId = params.tokenId;
useCollectibleBalance({
  tokenId  // ✅ Clean shorthand
})
```

### Problem 2: Inconsistent Mental Model
Developers must remember:
- API layer → use `tokenId`
- SDK hooks → use `collectableId` (typo: collectable)
- SDK components → use `collectibleId` (correct spelling)
- Routes → use `collectibleId`

### Problem 3: Type Mismatches
```typescript
// Current awkwardness
interface UseBalanceOfCollectibleArgs {
  collectableId: bigint;  // Different from what API uses
}

// API expects
interface GetTokenBalancesArgs {
  tokenId?: bigint;  // Different name!
}
```

## Recommended Migration Path

### Phase 1: Update Hook Interface (Breaking Change)
```typescript
// sdk/src/react/queries/collectible/balance.ts
export type UseBalanceOfCollectibleArgs = {
  collectionAddress: Address;
- collectableId: bigint;
+ tokenId: bigint;
  userAddress: Address | undefined;
  chainId: number;
  // ...
}
```

### Phase 2: Update All Hook Calls
Update 6 files that call `useCollectibleBalance`:
- `playgrounds/shared/src/components/pages/CollectiblePageController.tsx`
- `playgrounds/shared/src/components/ordersTable/_components/Action.tsx`
- `sdk/src/react/ui/modals/CreateListingModal/Modal.tsx`
- Test files

### Phase 3: Gradual SDK Layer Migration
Gradually rename `collectibleId` → `tokenId` in:
- Route parameters (62 files)
- Store state
- Component props
- Variable names

This can be done incrementally without breaking changes by:
1. Adding `tokenId` alongside `collectibleId` in interfaces
2. Deprecating `collectibleId` 
3. Removing after adoption

### Phase 4: Documentation Update
Update all JSDoc comments to use `tokenId` terminology.

## Alternative: Keep Domain Language

**Counter-argument**: Some might argue to keep `collectibleId` for domain clarity.

**Response**: 
- The term "collectible" is already used at a higher level (components, routes, hooks)
- The ID parameter should align with the blockchain primitive
- Example: `useCollectibleBalance({ tokenId })` is clear - fetching collectible balance by token ID
- This mirrors how we say "user address" not "user identifier" - the primitive name is clearer

## Conclusion

**Recommendation**: Migrate all usage to `tokenId`

**Priority**: 
1. **High Priority**: Fix `collectableId` → `tokenId` in balance hook (6 files)
   - This is a typo and creates awkward non-shorthand patterns
   - Small scope, high impact
2. **Medium Priority**: Standardize remaining `collectibleId` → `tokenId` gradually
   - Larger scope but can be done incrementally
   - Aligns with industry standards and API layer

**Benefits**:
- ✅ Consistent with ERC standards
- ✅ Consistent with API layer (66% of current usage)
- ✅ Enables object shorthand: `{ tokenId }` instead of `{ collectableId: collectibleId }`
- ✅ No spelling ambiguity (collectable vs collectible)
- ✅ Clearer mental model (token ID is the blockchain primitive)
- ✅ Better TypeScript developer experience
