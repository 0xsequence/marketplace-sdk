---
"@0xsequence/marketplace-sdk": major
---

**BREAKING:** Count hooks now consistently return `number` instead of `{ count: number }`

All count hooks (`useCountListingsForCollectible`, `useCountOffersForCollectible`, and `useCountOfCollectables`) now return a plain `number` directly instead of an object with a `count` property, making the API consistent across all count operations.

## Migration Required

Update any code accessing the count value:

```typescript
// Before
const { data } = useCountListingsForCollectible(params);
const listingCount = data?.count;

const { data } = useCountOffersForCollectible(params);  
const offerCount = data?.count;

// After  
const { data } = useCountListingsForCollectible(params);
const listingCount = data;

const { data } = useCountOffersForCollectible(params);
const offerCount = data;
```

**Note:** `useCountOfCollectables` already returned a plain number and remains unchanged.

## Additional Changes

- All count hooks migrated to new consistent query pattern with improved TypeScript types
- Enhanced JSDoc documentation with comprehensive usage examples
- Better parameter validation and error handling