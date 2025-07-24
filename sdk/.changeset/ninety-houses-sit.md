---
"@0xsequence/marketplace-sdk": patch
---

feat(sdk): Add useSearchTokenMetadata hook

Introduces a new query hook `useSearchTokenMetadata` that enables searching and filtering token metadata from the metadata API. The query:

- Supports infinite pagination with configurable page size
- Accepts chain ID, collection address, and filter parameters
- Returns token metadata array with pagination information