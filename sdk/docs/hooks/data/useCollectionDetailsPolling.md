---
title: useCollectionDetailsPolling
description: Polls collection details until a terminal state is reached This hook fetches collection details with automatic polling that continues until the collection reaches a terminal state (active, failed, inactive, or incompatible_type). It uses exponential backoff to reduce server load while waiting for collection processing to complete.
sidebarTitle: useCollectionDetailsPolling
---

# useCollectionDetailsPolling

Polls collection details until a terminal state is reached This hook fetches collection details with automatic polling that continues until the collection reaches a terminal state (active, failed, inactive, or incompatible_type). It uses exponential backoff to reduce server load while waiting for collection processing to complete.

## Parameters

| Name | Type | Description |
|------|------|-------------|
| `args` |  | Configuration for polling |
| `args` |  | .collectionAddress - The collection contract address to poll |
| `args` |  | .chainId - The blockchain network ID |
| `args` |  | .query - Optional query configuration |
| `args` |  | .query.enabled - Whether to enable polling (default: true) |

## Returns

returns.error - Error object if fetching fails

## Example

```typescript
Conditional polling:
```typescript
const [shouldPoll, setShouldPoll] = useState(true);
const { data: collection } = useCollectionDetailsPolling({
collectionAddress: newCollectionAddress,
chainId: 1,
query: {
enabled: shouldPoll && !!newCollectionAddress
}
});
// Stop polling once active
useEffect(() => {
if (collection?.status === CollectionStatus.active) {
setShouldPoll(false);
onCollectionReady(collection);
}
}, [collection?.status]);
```
```

## Basic Usage

```typescript
import { useCollectionDetailsPolling } from '@0xsequence/marketplace-sdk/react/hooks';

const result = useCollectionDetailsPolling({
  // Add your parameters here
});
```

