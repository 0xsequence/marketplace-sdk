---
title: useGenerateCancelTransaction
description: Generates transaction steps for cancelling a marketplace order This hook creates a mutation that calls the marketplace API to generate the necessary transaction or signature steps for cancelling an order. The returned steps can then be executed to complete the cancellation.
sidebarTitle: useGenerateCancelTransaction
---

# useGenerateCancelTransaction

Generates transaction steps for cancelling a marketplace order This hook creates a mutation that calls the marketplace API to generate the necessary transaction or signature steps for cancelling an order. The returned steps can then be executed to complete the cancellation.

## Parameters

| Name | Type | Description |
|------|------|-------------|
| `params` |  | Configuration parameters |
| `params` |  | .chainId - The blockchain network ID where the order exists |
| `params` |  | .onSuccess - Optional callback when generation succeeds |

## Returns

returns.data - The generated transaction steps when successful

## Example

```typescript
With success callback:
```typescript
const { generateCancelTransaction, isLoading } = useGenerateCancelTransaction({
chainId: 1,
onSuccess: (steps) => {
console.log(`Generated ${steps?.length} steps for cancellation`);
// Process the steps...
}
});
// Trigger generation
generateCancelTransaction({
walletAddress: account.address,
orderId: orderToCancel,
marketplace: MarketplaceKind.sequence_marketplace_v1
});
```
```

## Basic Usage

```typescript
import { useGenerateCancelTransaction } from '@0xsequence/marketplace-sdk/react/hooks';

const result = useGenerateCancelTransaction({
  // Add your parameters here
});
```

