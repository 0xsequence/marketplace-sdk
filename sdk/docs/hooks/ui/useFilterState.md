---
title: useFilterState
description: Manages marketplace filter state with URL synchronization This hook provides a comprehensive filtering system for marketplace views, including property filters, search text, and listed-only toggles. All state is automatically synchronized with URL query parameters for shareable links.
sidebarTitle: useFilterState
---

# useFilterState

Manages marketplace filter state with URL synchronization This hook provides a comprehensive filtering system for marketplace views, including property filters, search text, and listed-only toggles. All state is automatically synchronized with URL query parameters for shareable links.

## Returns

returns.serialize - Serialize current state to URL string

## Example

```typescript
Sharing filter state via URL:
```typescript
const { serialize, filterOptions } = useFilterState();
// Get shareable URL
const shareUrl = `${window.location.origin}${window.location.pathname}?${serialize({
filters: filterOptions,
search: 'rare sword',
listedOnly: true
})}`;
// URL will be like: /marketplace?f=[...]&q=rare+sword&l=true
```
```

## Basic Usage

```typescript
import { useFilterState } from '@0xsequence/marketplace-sdk/react/hooks';

const result = useFilterState({
  // Add your parameters here
});
```

