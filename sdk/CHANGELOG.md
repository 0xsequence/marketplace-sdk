# @0xsequence/marketplace-sdk

## 0.8.13

### Patch Changes

**⚠️ Breaking Changes **

**Hook Parameter Type Updates**
- Updated hook parameter types for consistency:
  - `useCollection`: `UseCollectionArgs` → `UseCollectionParams`  
  - `useHighestOffer`: `UseHighestOfferArgs` → `UseHighestOfferParams`
  - `useLowestListing`: `UseLowestListingArgs` → `UseLowestListingParams`
  - `useFloorOrder`: `UseFloorOrderArgs` → `UseFloorOrderParams`

**Count Hook Return Types**
- All count hooks now consistently return `number` instead of `{ count: number }`
- Affected hooks: `useCountListingsForCollectible`, `useCountOffersForCollectible`, `useCountOfCollectables`
- Migration: Replace `data?.count` with `data` directly


**Shop Integration & Primary Sales Enhancements**
- Enhanced shop integration with improved primary sales support
- Added `useCountOfPrimarySaleItems` hook for returning the total number of primary sale items
- Added `useGetTokenRanges` hook for fetching token ID ranges from indexer
- Improved 721 and 1155 sale controls with better quantity tracking

**Hook System Overhaul**
- Migrated 20+ hooks to new consistent fetching pattern
- Exported all fetching function in a separate file, allowing them to be used with other loaders and during prerendering (SSR) 
- Added comprehensive JSDoc documentation with usage examples
- Enhanced TypeScript types and parameter validation across all hooks
- Improved error handling and query optimization
- Added support for most react query options https://tanstack.com/query/latest/docs/framework/react/reference/useQuery

**API & Configuration Updates**  
- Support for granular service environment configurations with manual URL overrides

**UI/UX Enhancements**
- Fixed Safari detection in Media component for better SSR compatibility
- Improved loading states across all components  
- Enhanced collectible card rendering for both minted and unminted items


**Misc**
- Fixed grayed-out media display in collectible cards
- Upgraded all dependencies to latest versions
- Extensive code cleanup: removed unused exports, comments, and TODOs


### Patch Changes

## 0.8.12

### 🚀 Primary Sales Support with Marketplace Shop

✅ **Zero Breaking Changes** - All existing functionality remains unchanged. This release is fully backwards compatible.
This release introduces hooks for usage with the upcoming **Shop**, a new marketplace type that enables primary sales alongside the existing **Market** for secondary sales. You can now handle both minting (primary) and trading (secondary) in a unified marketplace experience.
**What's the difference?**

- **Market** (existing): P2P secondary marketplace for trading existing Collectibles
- **Shop** (new): Primary sales where users mint Collectibles directly using Sequence's sales contracts

## ✨ New Features

### Primary Sales Integration

**New Hooks for Shop Operations**

```tsx
// Fetch items available for minting
const { data: saleItems, isLoading } = useListPrimarySaleItems({
  chainId: 137,
  primarySaleContractAddress: "0x1234...",
  filter: { isActive: true },
  enabled: true, // Optional: control when to fetch
});
// Get payment options for minting
const { data: checkoutOptions } = useCheckoutOptionsSalesContract({
  chainId: 137,
  salesContractAddress: "0x1234...",
});
// Track minted tokens from ERC721 sales
const { data: mintedTokens } = useERC721SaleMintedTokens({
  chainId: 137,
  salesContractAddress: "0x1234...",
});
```

**Enhanced Data Fetching**

```tsx
// Get display data for shop collectibles
const { data: shopCardData } = useList1155ShopCardData({
  chainId: 137,
  contractAddress: "0x1234...",
  tokenIds: ["1", "2", "3"],
});
// Batch fetch token supplies across contracts
const { data: suppliesMap } = useGetTokenSuppliesMap({
  requests: [
    { chainId: 137, contractAddress: "0x1234...", tokenIds: ["1", "2"] },
  ],
});
```

### Enhanced Components with `marketplaceType` Support

The following components now accept a `marketplaceType` prop to automatically adapt between Shop (primary sales) and Market (secondary sales) behaviors:
**`CollectibleCard` - Universal Card Component**

```tsx
// For Shop (primary sales) - shows mint actions
<CollectibleCard
  collectibleId="1"
  chainId={137}
  collectionAddress="0x1234..."
  marketplaceType="shop"
  salesContractAddress="0x5678..."
  tokenMetadata={tokenMetadata}
  salePrice={{ amount: "1000000", currencyAddress: "0x..." }}
  quantityDecimals={0}
  quantityRemaining="100"
/>

// For Market (secondary sales) - shows buy/sell actions
<CollectibleCard
  collectibleId="1"
  chainId={137}
  collectionAddress="0x1234..."
  marketplaceType="market"
  collectible={collectibleOrder}
  balanceIsLoading={false}
/>
```

**`useBuyModal` Hook - Universal Purchase Flow**

```tsx
const { show: showBuyModal, close: closeBuyModal } = useBuyModal({
  onSuccess: ({ hash }) => console.log("Purchase successful:", hash),
  onError: (error) => console.error("Purchase failed:", error),
});

// For Shop - opens minting flow
const handleMintClick = () => {
  showBuyModal({
    chainId: 137,
    collectionAddress: "0x1234...",
    marketplaceType: "shop",
    salesContractAddress: "0x5678...",
    items: [{ tokenId: "1" }],
    quantityDecimals: 0,
    quantityRemaining: 100,
    salePrice: { amount: "1000000", currencyAddress: "0x..." },
  });
};

// For Market - opens standard purchase flow
const handleBuyClick = () => {
  showBuyModal({
    chainId: 137,
    collectionAddress: "0x1234...",
    marketplaceType: "market",
    collectibleId: "1",
    marketplace: "sequence",
    orderId: "order-123",
  });
};
```

### Enhanced Existing Features

**Smarter Data Fetching**

- `fetchCollectibles` now automatically detects Shop marketplace types
- Components automatically adapt UI and actions based on marketplace context
- Improved `Media` component with better type detection for various formats
  **Backwards Compatibility**
- All existing components work unchanged: `BuyModal`, `SellModal`, `CreateListingModal`, `MakeOfferModal`
- All existing hooks preserved: `useListMarketItems`, `useCollectibleDetails`, etc.
- Zero migration required for current Market implementations

### 🖼️ New `Media` component – render any type of collectible file

This update adds a new `Media` component that can display **images**, **videos**, **3D models**, or **HTML iframes**, depending on the file type.

#### Key features

- **Supports multiple file types** – automatically detects and displays the right format.
- **Tries multiple asset URLs** – uses the first one that works from the `assets` list.
- **Shows a loading state** – displays a skeleton loader while the file loads.
- **Custom fallback** – if no asset loads, shows a default placeholder or your own custom content.
- **Works in Safari** – handles browser quirks like hiding video controls.

#### Example usage

```tsx
<Media
  name="Collectible #42"
  assets={[
    undefined,
    "ipfs://QmImageHash",
    "https://cdn.example.com/model.glb",
  ]}
  assetSrcPrefixUrl="https://w3s.link/ipfs/"
  className="w-full h-full rounded-lg"
/>
```

## 📋 Complete Feature List

**New Hooks**

- `useListPrimarySaleItems` - Fetch mintable items from sales contracts
- `useCheckoutOptionsSalesContract` - Get payment options for minting
- `useList1155ShopCardData` - Display data for ERC1155 shop items
- `useList721ShopCardData` - Display data for ERC721 shop items
- `useERC721SaleMintedTokens` - Track minted tokens
- `useListMarketCardData` - Enhanced market item display data
- `useGetTokenSuppliesMap` - Batch token supply fetching
- `useListTokenMetadata` - Multi-token metadata retrieval

SSR config do not require passing query client anymore, and leverages an internal query client

**Components with `marketplaceType` Support**

- `CollectibleCard` - Universal card that adapts to Shop/Market via `marketplaceType` prop
- `useBuyModal` hook - Universal modal controller that handles both minting (Shop) and purchasing (Market) flows

**Internal Changes**

- Bundler changes from tsup to [tsdown](https://tsdown.dev/) highly improving bundling speed and memory usage during build
- Better test coverage and improved test suite
- More flexible config options for mocking in the sdk playgrounds
- Removed legend-state from the action modal, switch chain modal and the successful purchase modal

## 0.8.11

### Patch Changes

- Handle fee options of non-sponsored testnets

- Refactored marketplace configuration to support the new dual-market structure:
  - Marketplace config now contains Market (P2P marketplace) and the upcoming Shop (primary sales)
  - Added new marketplace types and interfaces to support the upcoming Shop/Market structure
  - Updated collection references to use `itemsAddress` instead of `address` for consistency
  - Renamed `useCurrencies` to `useMarketCurrencies` to indicate that it is only used for the currency related to the market

## 0.8.10

### Patch Changes

#### New hooks

- useList1155SaleSupplies to batch fetch supply data for the ERC1155 sales contracts
- useListTokenMetadata to list token metadata for a given set of tokens

#### New ABIs

- ERC1155 sales contract (ERC1155_SALES_CONTRACT_ABI).
- ERC721 sales contract (ERC721_SALE_ABI).
- ERC1155 Items contract (SEQUENCE_1155_ITEMS_ABI).

#### Media Component

- Renamed `CollectibleAsset` to `Media`
- Introduced a new `supply` prop to display asset supply information.
- Improved error handling for scenarios where asset data might be missing or malformed.

#### Utility Functions

- Enhanced `getContentType` utility with better error handling mechanisms.
- Updated `fetchContentType` to gracefully handle cases where the URL might be undefined.

#### Other

- Fetching Transak configs for nftCheckout

## 0.8.9

### Patch Changes

- Fixed issues with input components while using sequence-design-system v2.1.12

## 0.8.8

### Patch Changes

- Improved metadata for analytics
- Better identification of asset file types (video, audio, image, 3D)
- Support for web-SDKs new "native-currency-address" config
- Removes the need to setup embedded wallet in the SDK config and retrieve wallet config from builder

  ```diff
  type SdkConfig = {
    projectAccessKey: string;
    projectId: string;
  -  wallet?: {
  -    walletConnectProjectId?: string;
  -    embedded?: {
  -      waasConfigKey: string;
  -      googleClientId?: string;
  -      appleClientId?: string;
  -      appleRedirectURI?: string;
  -    };
  -  };
  +  walletConnectProjectId?: string;
  };
  ```

## 0.8.7

### Patch Changes

- Added new Eden Mart marketplace kind

## 0.8.6

### Patch Changes

- - Added `useFilterState` to easily manage filter state with [nuqs](https://nuqs.47ng.com/)
  - Added `useFiltersProgressive` hook for initializing filters with only keys, speeding up initial load
  - Updated dependencies and improved tests

## 0.8.5

### Patch Changes

- Ignore embedded connectors if ecosystem connector is enabled
- CollectibleCard prop `lowestListing` renamed to `collectible` and `balanceIsLoading` is mandatory
- Improved test coverage and misc fixes

## 0.8.4

### Patch Changes

- Added new `useInventory` hook that combines data from marketplace-api and indexer [#294](https://github.com/0xsequence/marketplace-sdk/pull/294)
- Added optimistic updates for listings and offers [#290](https://github.com/0xsequence/marketplace-sdk/pull/290)
- Improved test coverage and fixed various bugs

## 0.8.3

### Patch Changes

- Updated marketplace API client
- Fixed issue with off-chain cancellation failing on some chains, (Removed ExecuteType enum and replaced with new payload for execute endpoint)

## 0.8.2

### Patch Changes

- - Unified order type and new query for lowest listing [#278](https://github.com/0xsequence/marketplace-sdk/pull/278)
  - Fixed earnings calculation and improved number formatting in transaction details [#281](https://github.com/0xsequence/marketplace-sdk/pull/281)
  - Fixed incorrect native currency decimals in QuantetyModal [#280](https://github.com/0xsequence/marketplace-sdk/pull/280)
  - Fixed React state updates during render in BuyModal [#277](https://github.com/0xsequence/marketplace-sdk/pull/277)

## 0.8.1

### Patch Changes

- Add skipNativeBalanceCheck flag

## 0.8.0

### Minor Changes

- Buy flow cleanup, various fixes
