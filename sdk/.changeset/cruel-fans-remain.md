---
"@0xsequence/marketplace-sdk": patch
---

feat: move sort parameter outside page object in useListOffersForCollectible

- Refactor `listOffersForCollectible` to accept `sort` as a top-level parameter instead of nested within `page` object
- Maintain backwards compatibility by detecting and handling sort within page object for existing implementations

This change improves the API ergonomics by separating pagination concerns from sorting configuration while ensuring no breaking changes for existing consumers.