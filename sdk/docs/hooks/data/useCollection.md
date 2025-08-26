---
title: useCollection
description: Hook to fetch collection information from the metadata API Retrieves basic contract information including name, symbol, type, and extension data for a given collection contract.
sidebarTitle: useCollection
---

# useCollection

Hook to fetch collection information from the metadata API Retrieves basic contract information including name, symbol, type, and extension data for a given collection contract.

## Parameters

| Name | Type | Description |
|------|------|-------------|
| `params` |  | Configuration parameters |
| `params` |  | .chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon) |
| `params` |  | .collectionAddress - The collection contract address |
| `params` |  | .query - Optional React Query configuration |

## Returns

Query result containing contract information

## Example

```typescript
With custom query options:
```typescript
const { data, isLoading } = useCollection({
chainId: 1,
collectionAddress: '0x...',
query: {
refetchInterval: 30000,
enabled: userWantsToFetch
}
})
```
```

## Basic Usage

```typescript
import { useCollection } from '@0xsequence/marketplace-sdk/react/hooks';

const result = useCollection({
  // Add your parameters here
});
```

