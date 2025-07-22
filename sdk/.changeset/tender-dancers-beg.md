---
"@0xsequence/marketplace-sdk": patch
---

feat(transfer): improve WaaS transfer UX with better loading states

- Enhance TransferButton to show more accurate loading states for WaaS transfers.
- Skip FollowWalletInstructions view for WaaS wallets since they don't need UI interaction

