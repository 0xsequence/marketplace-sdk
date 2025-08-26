---
title: useOpenConnectModal
description: Provides access to the wallet connection modal opener function This hook extracts the `openConnectModal` function from the SDK context, providing a convenient way to trigger the wallet connection flow from any component within the MarketplaceSdkProvider.
sidebarTitle: useOpenConnectModal
---

# useOpenConnectModal

Provides access to the wallet connection modal opener function This hook extracts the `openConnectModal` function from the SDK context, providing a convenient way to trigger the wallet connection flow from any component within the MarketplaceSdkProvider.

## Returns

returns.openConnectModal - Function to open the wallet connection modal

## Example

```typescript
In response to restricted actions:
```typescript
const { openConnectModal } = useOpenConnectModal();
const { address } = useAccount();
const handleBuyClick = () => {
if (!address) {
openConnectModal();
return;
}
// Proceed with purchase
startPurchaseFlow();
};
```
```

## Basic Usage

```typescript
import { useOpenConnectModal } from '@0xsequence/marketplace-sdk/react/hooks';

const result = useOpenConnectModal({
  // Add your parameters here
});
```

