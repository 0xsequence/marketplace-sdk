---
title: useLowestListing
description: Hook to fetch the lowest listing for a collectible Retrieves the lowest priced listing currently available for a specific token in a collection from the marketplace.
sidebarTitle: useLowestListing
---

# useLowestListing

Hook to fetch the lowest listing for a collectible Retrieves the lowest priced listing currently available for a specific token in a collection from the marketplace.

## Parameters

| Name | Type | Description |
|------|------|-------------|
| `params` |  | Configuration parameters |
| `params` |  | .chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon) |
| `params` |  | .collectionAddress - The collection contract address |
| `params` |  | .tokenId - The token ID within the collection |
| `params` |  | .query - Optional React Query configuration |

## Returns

Query result containing the lowest listing data or null if no listings exist

## Example

```typescript
With custom query options:
```typescript
const { data, isLoading } = useLowestListing({
chainId: 1,
collectionAddress: '0x...',
tokenId: '42',
query: {
refetchInterval: 15000,
enabled: hasTokenId
}
})
```
```

## Basic Usage

```typescript
import { useLowestListing } from '@0xsequence/marketplace-sdk/react/hooks';

const result = useLowestListing({
  // Add your parameters here
});
```

