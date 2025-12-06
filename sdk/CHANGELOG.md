# @0xsequence/marketplace-sdk

## 1.2.1

### Patch Changes


## 1.2.1

### ✨ Improvements

- **MetaMask Connector Support**: Added native MetaMask connector support, can be enabled from Sequence Builder, useful for environments that do not support walletDiscovery (EIP-6963)
- **Transfer Modal Prefetching**: `useTransferModal` now supports prefetching balances based on collectible details via the new `prefetch` option
- **ERC1155 Shop Checkout Refactor**: Major refactor of the ERC1155 shop checkout flow to improve error handling and loading states


### 🔧 Internal Improvements

- Upgraded Sequence packages and workspace dependencies to latest versions
- Disabled flanky filename hash generation in tsdown build config
- Updated and expanded test coverage for ERC1155 sale payment

## 1.2.0

### Minor Changes

- ## ✨ New Features & Improvements

  - Integrated with web-sdk's 5.4 new Transak implementation to support updated Transak API requirements
  - Added `useCollectionActiveListingsCurrencies` and `useCollectionActiveOffersCurrencies` hooks for fetching active currencies used in offer/listings
  - Added `useGetPrimarySaleItem` hook and query for fetching individual primary sale items
  - Added price filter functionality with new components, badges, and state management
  - Integrated `lowestListing` directly from collectible data in `MarketCard` and `ShopCard` components, saving additional queries
  - Fixed large percentage differences now display with comma separators (e.g., "199,900.00%" instead of "199900.00%") for better readability
  - Improved OpenSea currency support by fetching supported currencies directly from API instead of hardcoded constants
  - Added ENS contract addresses to wagmi chain configurations

  ## 🐛 Bug Fixes

  - Fixed error handling in MakeOfferModal to show clear error messages when no ERC-20 tokens are configured for a collection
  - Implemented OpenSea decimal validation for offers
  - Fixed calendar date selection: 'Today' now sets time to end of day (23:59:59.999) to prevent order errors
  - Added loading modal while fetching payment parameters to prevent user actions during checkout flow

  ## 🔧 Internal Improvements

  - Removed support for multiple checkout providers to simplify the checkout flow
  - Removed all LAOS network references, LAOS721 handling, and related configuration
  - Refactored PriceInput component to use `currencyDecimals` directly
  - Upgraded all workspace dependencies to latest versions
  - Expanded test coverage for currency endpoints and filtering functionality
  - Enhanced TypeScript types and improved type inference across the SDK

## 1.1.1

### ✨ Improvements

- **Query System Enhancements**: Reorganized queries into domain-specific directories and added `getQueryKey` functions for improved cache management
- **New Hooks and Queries**: Added `useListItemsOrdersForCollection` for fetching all orders for a given collection, `useCountItemsOrdersForCollection` for counting collection orders, and `useListItemsOrdersForCollectionPaginated` for paginated collection orders
- **UI/UX Enhancements**: Enhanced TransactionDetails with better formatting, improved error display with ErrorLogBox component, enhanced CalendarDropdown with TimeSelector, and added loading modal to ERC1155BuyModal
- **OpenSea Integration**: Limited currency support to currencies supported by OpenSea v2
- **Analytics & Tracking**: Improved analytics provider with better wallet tracking

### 🐛 Bug Fixes

- Fixed date selection issues where past times could be selected
- Fixed retry behavior in payment modal to prevent excessive requests
- Fixed PriceInput component conditional rendering
- Fixed initialPageParam logic in paginated collection orders

### 🔧 Internal Improvements

- Switched from `waitForTransactionReceipt` to `fetchTransactionReceipt` for more reliable transaction handling
- Updated marketplace API client with new endpoints for collection order operations
- Enhanced test coverage
- Better error handling and logging throughout the codebase

## 1.1.0

### ✨ Improvements

- Enhanced FooterName component with improved offer acceptance logic and balance-based behavior ([#533](https://github.com/0xsequence/marketplace-sdk/pull/533))
- Improved PriceInput component styling and user experience ([#532](https://github.com/0xsequence/marketplace-sdk/pull/532))
- Better event handling in collectible card components ([#528](https://github.com/0xsequence/marketplace-sdk/pull/528))
- Enhanced loading states and visual feedback across UI components
- Always import all available networks, even if not used in a collection, to improve swap options from chains not used in the marketplace ([#526](https://github.com/0xsequence/marketplace-sdk/pull/526))
- Improved chain switching logic with optimistic chain switching ([#521](https://github.com/0xsequence/marketplace-sdk/pull/521))
- Moved sort parameter outside page object in `useListOffersForCollectible` hook while maintaining backward compatibility ([#531](https://github.com/0xsequence/marketplace-sdk/pull/531))
- Better TypeScript support and type safety improvements
- Enhanced documentation and JSDoc comments
- Enhanced query invalidation in ERC1155 checkout flow
- Improved cache management for user balances with inactive refetch types
- Better synchronization between different data sources
- Enhanced switch chain error modal with current chain detection
- Improved modal state management and error handling
- Optimized data fetching patterns in shop card components ([#527](https://github.com/0xsequence/marketplace-sdk/pull/527))
- Reduced unnecessary re-renders in collectible card variants
- Improved loading states and skeleton components

### 🐛 Bug Fixes

- Fixed ERC1155 shop pagination where items beyond the first page were missing metadata and sale information
- Fixed bug in useSearchTokenMetadata to ensure collectionAddress is defined before doing checks for minted tokens
- Fixed window error when initializing analytics provider in server-side rendering ([#509](https://github.com/0xsequence/marketplace-sdk/pull/509))

### 🔧 Internal Improvements

- Updated all workspace dependencies to latest versions ([#530](https://github.com/0xsequence/marketplace-sdk/pull/530))

- Added complexity rules to Biome configuration for better code quality ([#535](https://github.com/0xsequence/marketplace-sdk/pull/535))

- Enhanced formatting and style consistency across the codebase
- Improved test coverage for critical components
- Enhanced test utilities and mocking capabilities
- Dynamic network configuration in tests for better reliability
- Better error handling in test scenarios

## 1.0.0

🎉 **Production Release** - Sequence Marketplace SDK 1.0! 🎉

#### Complete Marketplace Solution

- **Primary Sales (Shop)**: Full support for Sequence sales contracts (ERC721 v0 and ERC1155 v0 and v1)
- **Secondary Sales (Market)**: Comprehensive listing and offer management

### 🚀 New features

- Support for Sequence sales contracts (ERC721 v0 and ERC1155 v0 and v1)
- **New `useProcessStep` hook**: For transaction marketplace api transaction step handling
- **New buy checkout flow UI**: New checkout flow for buying collectibles, from @0xsequence/checkout
- Custom wallet class replaced with wagmi hooks and new hooks for wallet operations (useEnsureCorrectChain, useConnectorMetadata, useProcessStep), see breaking changes below
- All fetching hooks now have a separated query function that can be used with other data fetching libraries or SSR/SSG frameworks
- All fetching hooks only fetch data when all required parameters are provided
- Modal style isolation with shadow DOM, preventing global styles from leaking into the document body
- useSearchTokenMetadata now have an option to only return token metadata for minted tokens `onlyMinted: true`
- MarketplaceConfig is by now by default never invalidated, allow fetching only serverside

- **UI/UX Improvements**:
  - Added optional action buttons to buy flow success modal
  - Fixed ERC1155 quantity modal decimal precision handling
  - Fixed collectible card image opacity issues
  - Improved media display with object-contain for collectible cards

### ! Breaking Changes

By default, the SDK now uses shadow DOM for all modals. To disable this, you can set the `useShadowDOM` flag to `false` in the `SdkConfig`. Other components (media, collectible card etc) are rendered to the document body and requires Tailwind.
`useShopCollectibleSaleData` hook has been removed. Instead, use `useErc721SaleDetails` and `useErc1155SaleDetails` hooks leveraging api-client

- **Wallet**: Complete removal of custom wallet client in favor of wagmi hooks
  - Replace `wallet.address` with `useAccount()` hook from wagmi
  - Replace `wallet.isWaaS` with `useConnectorMetadata().isWaaS`
  - Replace `wallet.kind` with `useConnectorMetadata().walletKind`
  - Replace `wallet.switchChain` with `useEnsureCorrectChain` hook
  - Replace `wallet.signTransactionStep` and `wallet.transferStep` with `useProcessStep` hook

### 🐛 Bug Fixes

- Fixed ERC1155 quantity modal decimal handling with proper min/max calculations
- Fixed pagination issues with minted ERC721 sale tokens
- Resolved potential state management race conditions in action modals
- Fixed decimal handling in quantity inputs
- Fixed collectible card image opacity issues
- Fixed ERC721 sale contract quantity tracking for V1 contracts
- Fixed negative remaining supply display in shop cards
- Improved error handling when quantity values are 0
- Fixed token approval reset when transaction steps don't exist
- Auto fee selection for embedded wallets bug fix, now only applies for cancelling orders

### 🔧 Internal Improvements

#### Code Organization

- Reorganized hooks into logical subdirectories (data, transactions, ui, config)
- Removed duplicate hooks and consolidated functionality
- Increased test coverage
- Some internal hooks have been renamed for consistency

## 0.10.0

### New Features

**Alternative Wallet integration Support**

- Added support for using any wallet connection library (e.g., Privy, Rainbowkit, Dynamic Labs etc.) instead of Sequence Connect
- You can now provide a custom `openConnectModal` function to the `MarketplaceProvider` to integrate with your preferred wallet connection flow.

Example with any wallet provider:

```tsx
import { MarketplaceProvider } from "@0xsequence/marketplace-sdk/react";
import { useConnectModal } from "@my-wallet-provider/connect-modal";

function App() {
  const { openConnectModal } = useConnectModal();

  return (
    <MarketplaceProvider config={sdkConfig} openConnectModal={openConnectModal}>
      {/* Your marketplace app */}
    </MarketplaceProvider>
  );
}
```

See the [Alternative Wallet Integration Playground](https://github.com/0xsequence/marketplace-sdk/tree/master/playgrounds/alternative-wallets) for a complete example with Dynamic Labs

**Enhanced Media Component**

- Added `shouldListenForLoad` prop for controlling asset load event handling
- Introduced `mediaClassName` prop for controlling the inner media element
- Improved asset loading behavior with conditional handling

**Shop & Market Improvements**

- Added `ShopActions` component for handling collectible purchase interactions
- Enhanced `CollectibleDetails` to conditionally display information based on marketplace type
- Improved ERC1155 sale item handling - buy button now hidden when out of stock
- Added support for unlimited supply display in shop components

### API Updates

**New Hooks & Queries**

- `useGetCountOfPrimarySaleItems` - Now uses `useQuery` instead of `useInfiniteQuery`
- Added `contractAddress` parameter to `TokenBalancesParams` for more precise balance queries

**Analytics & Tracking**

- Enhanced buy modal tracking to track cart abandonment

### Developer Experience

**Testing & Documentation**

- Expanded test coverage for critical components
- Added JSDoc documentation improvements

**Build & Configuration**

- Fixed SSR issues with React Day Picker in React-Router V7

### Bug Fixes

- Fixed ERC1155 quantity modal to use `maxUint256` for infinity value
- Resolved React state update issues in various components
- Fixed missing contract type errors

## 0.9.0

### Patch Changes

**! Breaking Changes **

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

### 🖼 New `Media` component – render any type of collectible file

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

- Added new `useInventory` hook that combines data from api-client and indexer [#294](https://github.com/0xsequence/marketplace-sdk/pull/294)
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
