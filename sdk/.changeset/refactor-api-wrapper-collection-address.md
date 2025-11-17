---
"@0xsequence/marketplace-sdk": patch
"@0xsequence/marketplace-api": patch
---

refactor: move collectionAddress → contractAddress transformation to API wrapper layer

**Breaking Change**: None (internal refactor only)

**Summary**:
Eliminates redundant dual transformation layers by moving `collectionAddress → contractAddress` 
field renaming from SDK queries to the API wrapper layer, matching the existing `chainId` 
transformation pattern.

**Changes**:

API Package (`@0xsequence/marketplace-api`):
- Add `wrapCollectionAddress()` utility to handle both `chainId` and `collectionAddress` transformations
- Update 14 MarketplaceClient Request types to use `collectionAddress` instead of `contractAddress`
- Update 14 MarketplaceClient methods to use new wrapper

SDK Package (`@0xsequence/marketplace-sdk`):
- Simplify 18 query files by removing manual `contractAddress` mapping
- Query interfaces now inherit `collectionAddress` from API types instead of manually adding it
- Update query cache keys to use `collectionAddress` for consistency

**Benefits**:
- Architecturally correct: transformation happens at API boundary, not in application code
- Reduced code duplication: ~60 lines of redundant mapping code removed
- Better maintainability: single source of truth for field transformations
- Consistent with existing `chainId` transformation pattern

**Migration**: No action required - this is an internal refactor with no API changes.
