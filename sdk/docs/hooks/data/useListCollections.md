---
title: useListCollections
description: Hook to fetch collections from marketplace configuration Retrieves all collections configured in the marketplace, with optional filtering by marketplace type. Combines metadata from the metadata API with marketplace configuration to provide complete collection information.
sidebarTitle: useListCollections
---

# useListCollections

Hook to fetch collections from marketplace configuration Retrieves all collections configured in the marketplace, with optional filtering by marketplace type. Combines metadata from the metadata API with marketplace configuration to provide complete collection information.

## Parameters

| Name | Type | Description |
|------|------|-------------|
| `params` |  | Configuration parameters |
| `params` |  | .marketplaceType - Optional filter by marketplace type |
| `params` |  | .query - Optional React Query configuration |

## Returns

Query result containing array of collections with metadata

## Example

```typescript
Filtering by marketplace type:
```typescript
const { data: marketCollections } = useListCollections({
marketplaceType: 'market'
});
```
```

## Basic Usage

```typescript
import { useListCollections } from '@0xsequence/marketplace-sdk/react/hooks';

const result = useListCollections({
  // Add your parameters here
});
```

