---
title: useGenerateSellTransaction
description: Generates transaction steps for selling a collectible (accepting an offer or buying a listing) This hook creates a mutation that calls the marketplace API to generate the necessary transaction steps for completing a sale. This includes both accepting offers on your collectibles and buying collectibles from existing listings.
sidebarTitle: useGenerateSellTransaction
---

# useGenerateSellTransaction

Generates transaction steps for selling a collectible (accepting an offer or buying a listing) This hook creates a mutation that calls the marketplace API to generate the necessary transaction steps for completing a sale. This includes both accepting offers on your collectibles and buying collectibles from existing listings.

## Parameters

| Name | Type | Description |
|------|------|-------------|
| `params` |  | Configuration parameters |
| `params` |  | .chainId - The blockchain network ID for the transaction |
| `params` |  | .onSuccess - Optional callback when generation succeeds |

## Returns

returns.data - The generated transaction steps when successful

## Example

```typescript
Buying from a listing:
```typescript
const { generateSellTransaction, isLoading } = useGenerateSellTransaction({
chainId: 1,
onSuccess: (steps) => {
console.log('Purchase steps ready:', steps);
executeSteps(steps);
}
});
generateSellTransaction({
chainId: 137,
collectionAddress: '0x...',
seller: '0x...',
marketplace: MarketplaceKind.sequence_marketplace_v2,
ordersData: [
{
orderId: 'listing-123',
quantity: '2'
}
],
additionalFees: [
{
amount: '1000000000000000000', // 1 ETH in wei
receiver: '0x...' // Platform fee receiver address
}
],
walletType: WalletKind.sequence,
});
```
```

## Basic Usage

```typescript
import { useGenerateSellTransaction } from '@0xsequence/marketplace-sdk/react/hooks';

const result = useGenerateSellTransaction({
  // Add your parameters here
});
```

