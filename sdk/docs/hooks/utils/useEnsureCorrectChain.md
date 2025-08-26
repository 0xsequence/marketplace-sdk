---
title: useEnsureCorrectChain
description: Ensures the wallet is connected to the correct blockchain network This hook provides functions to check and switch chains with appropriate UX for different wallet types. For WaaS wallets, it switches directly. For other wallets, it shows a modal explaining the chain switch.
sidebarTitle: useEnsureCorrectChain
---

# useEnsureCorrectChain

Ensures the wallet is connected to the correct blockchain network This hook provides functions to check and switch chains with appropriate UX for different wallet types. For WaaS wallets, it switches directly. For other wallets, it shows a modal explaining the chain switch.

## Returns

returns.currentChainId - The currently connected chain ID

## Example

```typescript
In transaction flows:
```typescript
const { ensureCorrectChainAsync } = useEnsureCorrectChain();
const { buyToken } = useBuyToken({
onBeforeTransaction: async ({ chainId }) => {
// Ensure correct chain before transaction
await ensureCorrectChainAsync(chainId);
}
});
```
```

## Basic Usage

```typescript
import { useEnsureCorrectChain } from '@0xsequence/marketplace-sdk/react/hooks';

const result = useEnsureCorrectChain({
  // Add your parameters here
});
```

