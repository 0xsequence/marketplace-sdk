# @0xsequence/marketplace-sdk

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
