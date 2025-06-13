---
"@0xsequence/marketplace-sdk": major
---

**BREAKING CHANGES:** Updated hook parameter types for improved consistency and TypeScript support.

The following hooks have had their parameter type names changed:

- `useCollection`: `UseCollectionArgs` → `UseCollectionParams`
- `useHighestOffer`: `UseHighestOfferArgs` → `UseHighestOfferParams`  
- `useLowestListing`: `UseLowestListingArgs` → `UseLowestListingParams`
- `useFloorOrder`: `UseFloorOrderArgs` → `UseFloorOrderParams`

**Migration Guide:**

Replace the old type imports with the new ones:

```typescript
// Before
import type { UseCollectionArgs } from '@0xsequence/marketplace-sdk';

// After  
import type { UseCollectionParams } from '@0xsequence/marketplace-sdk';
```

The hook usage remains unchanged - only the TypeScript type names have been updated for consistency across the SDK.