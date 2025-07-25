---
"@0xsequence/marketplace-sdk": patch
---

prevent marketplace config invalidation

Makes marketplace config query persistent. Adds persistentQueryMeta and disables automatic refetching to ensure config stability.
