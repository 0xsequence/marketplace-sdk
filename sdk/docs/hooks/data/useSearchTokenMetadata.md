---
title: useSearchTokenMetadata
description: If true, only return minted tokens (tokens with supply > 0) / onlyMinted?: boolean; }; /** Hook to search token metadata using filters with infinite pagination support Searches for tokens in a collection based on text and property filters. Supports filtering by attributes, ranges, and text search. Can optionally filter to only show minted tokens (tokens with supply > 0).
sidebarTitle: useSearchTokenMetadata
---

# useSearchTokenMetadata

If true, only return minted tokens (tokens with supply > 0) / onlyMinted?: boolean; }; /** Hook to search token metadata using filters with infinite pagination support Searches for tokens in a collection based on text and property filters. Supports filtering by attributes, ranges, and text search. Can optionally filter to only show minted tokens (tokens with supply > 0).

## Parameters

| Name | Type | Description |
|------|------|-------------|
| `params` |  | Configuration parameters |
| `params` |  | .chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon) |
| `params` |  | .collectionAddress - The collection contract address |
| `params` |  | .filter - Filter criteria for the search |
| `params` |  | .filter.text - Optional text search query |
| `params` |  | .filter.properties - Optional array of property filters |
| `params` |  | .page - Optional pagination parameters |
| `params` |  | .query - Optional React Query configuration |
| `params` |  | .onlyMinted - If true, only return minted tokens (tokens with supply > 0) |

## Returns

Infinite query result containing matching token metadata with pagination support

## Example

```typescript
Search only minted tokens:
```typescript
const { data, fetchNextPage } = useSearchTokenMetadata({
chainId: 1,
collectionAddress: '0x...',
onlyMinted: true,
filter: {
text: 'dragon'
}
})
```
```

## Basic Usage

```typescript
import { useSearchTokenMetadata } from '@0xsequence/marketplace-sdk/react/hooks';

const result = useSearchTokenMetadata({
  // Add your parameters here
});
```

