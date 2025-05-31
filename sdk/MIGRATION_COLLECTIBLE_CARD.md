# CollectibleCard Migration Guide

This guide will help you migrate from the old `CollectibleCard` component to the new specialized card components introduced in PR #317.

## Overview

The `CollectibleCard` component has been refactored into three specialized versions:
- `MarketplaceCollectibleCard` - The main component that automatically handles both types
- `MarketCollectibleCard` - For marketplace/secondary sales
- `ShopCollectibleCard` - For primary sales/shop context

## Key Changes

### 1. New Import Path

```typescript
// Old
import { CollectibleCard } from '@0xsequence/marketplace-sdk/react';

// New
import { CollectibleCard } from '@0xsequence/marketplace-sdk/react';
// The import path remains the same, but the component now uses the new architecture
```

### 2. Simplified Props

The new `CollectibleCard` component accepts pre-computed props from the new data hooks, significantly simplifying usage:

#### Before:
```tsx
<CollectibleCard
  collectibleId={collectible.metadata.tokenId}
  chainId={chainId}
  collectionAddress={collectionAddress}
  orderbookKind={orderbookKind}
  collectionType={collection?.type as ContractType}
  collectible={collectible}
  onCollectibleClick={onCollectibleClick}
  balance={
    collectionBalance?.balances?.find(
      (balance) => balance.tokenID === collectible.metadata.tokenId,
    )?.balance
  }
  balanceIsLoading={collectionBalanceLoading}
  onOfferClick={({ order, e }) => {
    handleOfferClick({
      balances: collectionBalance?.balances || [],
      accountAddress: accountAddress as `0x${string}`,
      chainId,
      collectionAddress,
      order: order as Order,
      showSellModal: () => {
        showSellModal({
          chainId,
          collectionAddress,
          tokenId: collectible.metadata.tokenId,
          order: order as Order,
        });
      },
      e: e,
    });
  }}
  cardLoading={
    infiniteLoading ||
    collectionLoading ||
    collectionBalanceLoading
  }
  onCannotPerformAction={(action) => {
    console.log(`Cannot perform action: ${action}`);
  }}
/>
```

#### After:
```tsx
<CollectibleCard {...collectibleCard} />
```

### 3. Using the New Data Hooks

The complexity is now handled by specialized hooks that prepare the card data:

#### For Marketplace Cards:
```tsx
import { useListMarketCardData } from '@0xsequence/marketplace-sdk/react';

const { collectibleCards, isLoading } = useListMarketCardData({
  collectionAddress,
  chainId,
  orderbookKind,
  collectionType: collection?.type || ContractType.ERC721,
  filterOptions,
  onCollectibleClick,
  onCannotPerformAction: (action) => {
    console.error(`Cannot perform action: ${action}`);
  },
});

// Render the cards
{collectibleCards.map((card) => (
  <CollectibleCard key={card.collectibleId} {...card} />
))}
```

#### For Shop Cards (ERC1155):
```tsx
import { useList1155ShopCardData } from '@0xsequence/marketplace-sdk/react';

const { collectibleCards, isLoading } = useList1155ShopCardData({
  tokenIds: ['1', '2', '3'],
  chainId,
  contractAddress,
  salesContractAddress,
});

// Render the cards
{collectibleCards.map((card) => (
  <CollectibleCard key={card.collectibleId} {...card} />
))}
```

#### For Shop Cards (ERC721):
```tsx
import { useList721ShopCardData } from '@0xsequence/marketplace-sdk/react';

const { collectibleCards, isLoading } = useList721ShopCardData({
  tokenIds: ['1', '2', '3'],
  chainId,
  contractAddress,
  salesContractAddress,
});

// Render the cards
{collectibleCards.map((card) => (
  <CollectibleCard key={card.collectibleId} {...card} />
))}
```

### 4. Marketplace Type Constants

Use the new `MARKETPLACE_TYPES` constants instead of string literals:

```typescript
import { MARKETPLACE_TYPES } from '@0xsequence/marketplace-sdk';

// Old
marketplaceType === 'market'
marketplaceType === 'shop'

// New
marketplaceType === MARKETPLACE_TYPES.MARKET
marketplaceType === MARKETPLACE_TYPES.SHOP
```

### 5. Type Safety Improvements

Type assertions have been replaced with safer alternatives:

```typescript
// Old
collectionType={collection?.type as ContractType}

// New
collectionType={collection?.type || ContractType.ERC721}
```

### 6. Error Handling

The `onCannotPerformAction` callback now provides structured error logging:

```typescript
const handleCannotPerformAction = (action: CollectibleCardAction) => {
  // In production, show a toast notification or modal
  console.error(`[CollectibleCard] Cannot perform action: ${action}`, {
    collectionAddress,
    chainId,
    accountAddress,
    action,
  });
};
```

## Migration Steps

1. **Update imports** - Ensure you're importing from the correct path
2. **Replace manual prop construction** with the appropriate data hook
3. **Update marketplace type checks** to use `MARKETPLACE_TYPES` constants
4. **Add proper error handling** for `onCannotPerformAction`
5. **Remove type assertions** and use default values where appropriate
6. **Test thoroughly** - The new architecture handles edge cases differently

## Benefits

- **Simplified component usage** - Just spread the props from the data hooks
- **Better type safety** - Discriminated unions and type guards
- **Cleaner code** - Logic moved to specialized hooks
- **Improved maintainability** - Clear separation between shop and marketplace contexts
- **Better error handling** - Structured error information

## Need Help?

If you encounter any issues during migration, please:
1. Check the updated type definitions in `marketplace-collectible-card/types.ts`
2. Review the example implementations in the playground apps
3. Open an issue on GitHub with specific migration challenges