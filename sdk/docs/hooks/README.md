# 🚀 Marketplace SDK React Hooks

Welcome to the comprehensive documentation for all React hooks provided by the Marketplace SDK. These hooks provide a powerful and type-safe way to interact with marketplace functionality.

## 🎯 Quick Start

```bash
npm install @0xsequence/marketplace-sdk
```

```typescript
import { useCollectible, useListCollectibles } from '@0xsequence/marketplace-sdk/react/hooks';

// Fetch a single collectible
const { data: collectible, isLoading } = useCollectible({
  chainId: 137,
  collectionAddress: '0x...',
  collectibleId: '123'
});

// List collectibles with filters
const { data: collectibles } = useListCollectibles({
  chainId: 137,
  collectionAddress: '0x...',
  includeEmpty: false
});
```

## 📚 Hook Categories

### [Configuration](./config/)

3 hooks available in this category.

- [useConfig](./config/useConfig.md)
- [useConnectorMetadata](./config/useConnectorMetadata.md)
- [useMarketplaceConfig](./config/useMarketplaceConfig.md)

### [Contracts](./contracts/)

1 hooks available in this category.

- [useSalesContractABI](./contracts/useSalesContractABI.md)

### [Data Fetching](./data/)

35 hooks available in this category.

- [useBalanceOfCollectible](./data/useBalanceOfCollectible.md)
- [useCollectible](./data/useCollectible.md)
- [useCollection](./data/useCollection.md)
- [useCollectionBalanceDetails](./data/useCollectionBalanceDetails.md)
- [useCollectionDetails](./data/useCollectionDetails.md)
- [useCollectionDetailsPolling](./data/useCollectionDetailsPolling.md)
- [useCountListingsForCollectible](./data/useCountListingsForCollectible.md)
- [useCountOfCollectables](./data/useCountOfCollectables.md)
- [useCountOffersForCollectible](./data/useCountOffersForCollectible.md)
- [useCountOfPrimarySaleItems](./data/useCountOfPrimarySaleItems.md)
- [useCurrency](./data/useCurrency.md)
- [useCurrencyBalance](./data/useCurrencyBalance.md)
- [useErc721SalesData](./data/useErc721SalesData.md)
- [useFloorOrder](./data/useFloorOrder.md)
- [useGetCountOfPrimarySaleItems](./data/useGetCountOfPrimarySaleItems.md)
- [useGetTokenRanges](./data/useGetTokenRanges.md)
- [useHighestOffer](./data/useHighestOffer.md)
- [useInventory](./data/useInventory.md)
- [useList1155ShopCardData](./data/useList1155ShopCardData.md)
- [useList721ShopCardData](./data/useList721ShopCardData.md)
- [useListBalances](./data/useListBalances.md)
- [useListCollectibleActivities](./data/useListCollectibleActivities.md)
- [useListCollectibles](./data/useListCollectibles.md)
- [useListCollectiblesPaginated](./data/useListCollectiblesPaginated.md)
- [useListCollectionActivities](./data/useListCollectionActivities.md)
- [useListCollections](./data/useListCollections.md)
- [useListListingsForCollectible](./data/useListListingsForCollectible.md)
- [useListMarketCardData](./data/useListMarketCardData.md)
- [useListOffersForCollectible](./data/useListOffersForCollectible.md)
- [useListPrimarySaleItems](./data/useListPrimarySaleItems.md)
- [useListTokenMetadata](./data/useListTokenMetadata.md)
- [useLowestListing](./data/useLowestListing.md)
- [useMarketCurrencies](./data/useMarketCurrencies.md)
- [useSearchTokenMetadata](./data/useSearchTokenMetadata.md)
- [useTokenSupplies](./data/useTokenSupplies.md)

### [Transactions](./transactions/)

9 hooks available in this category.

- [useCancelOrder](./transactions/useCancelOrder.md)
- [useCancelTransactionSteps](./transactions/useCancelTransactionSteps.md)
- [useGenerateCancelTransaction](./transactions/useGenerateCancelTransaction.md)
- [useGenerateListingTransaction](./transactions/useGenerateListingTransaction.md)
- [useGenerateOfferTransaction](./transactions/useGenerateOfferTransaction.md)
- [useGenerateSellTransaction](./transactions/useGenerateSellTransaction.md)
- [useOrderSteps](./transactions/useOrderSteps.md)
- [useProcessStep](./transactions/useProcessStep.md)
- [useTransferTokens](./transactions/useTransferTokens.md)

### [UI](./ui/)

3 hooks available in this category.

- [useFilters](./ui/useFilters.md)
- [useFilterState](./ui/useFilterState.md)
- [useOpenConnectModal](./ui/useOpenConnectModal.md)

### [Utilities](./utils/)

9 hooks available in this category.

- [useAutoSelectFeeOption](./utils/useAutoSelectFeeOption.md)
- [useCheckoutOptions](./utils/useCheckoutOptions.md)
- [useCheckoutOptionsSalesContract](./utils/useCheckoutOptionsSalesContract.md)
- [useComparePrices](./utils/useComparePrices.md)
- [useConvertPriceToUSD](./utils/useConvertPriceToUSD.md)
- [useEnsureCorrectChain](./utils/useEnsureCorrectChain.md)
- [useGetReceiptFromHash](./utils/useGetReceiptFromHash.md)
- [useRoyalty](./utils/useRoyalty.md)
- [useSwitchChainWithModal](./utils/useSwitchChainWithModal.md)


## 📝 Contributing

Found an issue or want to improve the documentation? Please check our [contributing guidelines](../../../CONTRIBUTING.md).

## 📄 License

This documentation is part of the Marketplace SDK project.
