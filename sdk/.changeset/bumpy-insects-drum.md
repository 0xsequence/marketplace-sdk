---
"@0xsequence/marketplace-sdk": patch
---

- Added `MarketCollection` and `ShopCollection` types
- Updated `index.ts` to export types from `marketplace-collectible-card`
- Added `MARKETPLACE_TYPES` constants to replace string literals
- Added comprehensive JSDoc documentation to new hooks (`useListMarketCardData`, `useList1155ShopCardData`, `useList721ShopCardData`)
- Replaced unsafe type assertions with proper default values
- Improved error handling with structured logging instead of console.log
- Added migration guide documentation for CollectibleCard refactoring
