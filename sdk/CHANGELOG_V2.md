# @0xsequence/marketplace-sdk

## 2.0.0

### Major Release - v2.0.0

This release introduces first-class support for **Trails**, complete **headless mode** for all modals, and a modernized type system with **BigInt and viem compatibility**.

---

## Highlights

### Trails Integration - 1-Click Checkout

[Trails](https://trails.build) is now the **default checkout mode** for the Marketplace SDK, enabling seamless 1-click purchases across any chain, with any token, from any wallet.

**What Trails enables:**
- **Cross-chain payments** - Users can pay with tokens on any supported chain; Trails handles bridging and swapping automatically
- **Any token, any wallet** - Pay with ETH, USDC, POL, or any supported token from MetaMask, WalletConnect, or Sequence wallets
- **Intent-based transactions** - Complex multi-step transactions (approve → swap → bridge → purchase) are orchestrated into a single 1-click experience
- **Gasless options** - Pay gas fees with tokens like USDC instead of native chain tokens

**How it works:**

The SDK automatically uses Trails when available, with intelligent fallback to direct crypto payment when needed:

```typescript
import { MarketplaceSdkProvider } from '@0xsequence/marketplace-sdk/react';

// Trails is enabled by default
<MarketplaceSdkProvider config={{
  projectAccessKey: 'your-key',
  projectId: 'your-project-id',
  // checkoutMode: 'trails' is the default
}}>
  {children}
</MarketplaceSdkProvider>
```

**Checkout modes:**

| Mode | Description |
|------|-------------|
| `'trails'` | **Default** - 1-click checkout with cross-chain support. Falls back to `'crypto'` when chain/order doesn't support Trails |
| `'crypto'` | Direct on-chain payment in the listing currency |
| `{ mode: 'sequence-checkout', options }` | Sequence Checkout with custom options |

---

### Complete Headless Mode

All modal components now export their internal context hooks and types, enabling fully custom UI implementations while leveraging the SDK's transaction logic.

**New exports:**

```typescript
import {
  // Modal controls
  useBuyModal,
  useCreateListingModal,
  useMakeOfferModal,
  useSellModal,
  useTransferModal,
  
  // Context hooks for headless UI (NEW)
  useBuyModalContext,
  useCreateListingModalContext,
  useMakeOfferModalContext,
  useSellModalContext,
  useTransferModalContext,
  
  // Context types for TypeScript (NEW)
  type BuyModalContext,
  type CreateListingModalContext,
  type MakeOfferModalContext,
  type SellModalContext,
  type TransferModalContext,
} from '@0xsequence/marketplace-sdk/react';
```

**Example - Custom Buy UI:**

```typescript
function CustomBuyButton() {
  const { show } = useBuyModal();
  const ctx = useBuyModalContext();
  
  // Access all modal state and handlers
  const {
    collectible,
    collection,
    checkoutMode,      // 'trails' | 'crypto' | sequence-checkout config
    steps,             // Transaction steps
    isLoading,
    formattedAmount,
    handleTransactionSuccess,
    handleTrailsSuccess,
  } = ctx;
  
  // Build your own UI with full control
  return (
    <button onClick={() => handleTransactionSuccess(txHash)}>
      Buy for {formattedAmount} {currency.symbol}
    </button>
  );
}
```

---

### Modern Type System - BigInt & Viem Compatible

All SDK types now use `bigint` primitives and are fully compatible with [viem](https://viem.sh) types, providing better type safety and seamless integration with the viem/wagmi ecosystem.

**Key type changes:**

| Property | Before (v1.x) | After (v2.0) |
|----------|---------------|--------------|
| `tokenId` | `string` | `bigint` |
| `amount` / `priceAmount` | `string` | `bigint` |
| `quantity` | `string \| number` | `bigint` |
| `Address` | `string` | `viem Address` |
| `Hash` | `string` | `viem Hash` |

**Migration:**

```typescript
// Before (v1.x)
const tokenId = "123";
const amount = "1000000000000000000";

// After (v2.0)
const tokenId = 123n;
const amount = 1000000000000000000n;
// or
const tokenId = BigInt("123");
```

**New utility for React Query compatibility:**

```typescript
import { serializeBigInts } from '@0xsequence/marketplace-sdk/react';

// Converts BigInt values to strings for query keys
const queryKey = ['collectible', serializeBigInts({ tokenId: 123n })];
```

---

## Breaking Changes

### Type Changes (Migration Required)

Components and hooks now expect/return `bigint` for numeric blockchain values:

```typescript
// Component props
interface CollectibleCardProps {
  tokenId: bigint;              // Was: string
  onCollectibleClick?: (tokenId: bigint) => void;
}

// Hook parameters and returns
const { data } = useCollectible({
  chainId: 1,
  collectionAddress: '0x...',
  tokenId: 123n,               // Was: "123"
});
```

### Removed APIs

| Removed | Notes |
|---------|-------|
| `useListCollectionActivities` | Activities API removed |
| `useListCollectibleActivities` | Activities API removed |
| `quantityDecimals` prop | Removed from all components |

### Hook Changes

| Hook | Change |
|------|--------|
| `useCollection` | `collectionAddress` now accepts `undefined` |
| Count hooks (`useMarketItemsCount`, etc.) | Return `number` directly instead of `{ count: number }` |

---

## New Features

### New Hooks

- **`usePrimarySaleItem`** - Fetch individual primary sale item details
- **`useERC721Owner`** - Read ERC721 token owner address
- **`useCollectionActiveListingsCurrencies`** - Get currencies used in active listings
- **`useCollectionActiveOffersCurrencies`** - Get currencies used in active offers

### New Utilities

- **`normalizeProperties`** / **`normalizeAttributes`** - Normalize NFT metadata properties
- **`normalizePriceFilters`** - URL-safe price filter handling
- **`serializeBigInts`** - Convert BigInt values for React Query keys

---

## Bug Fixes

- Fixed "Price amount not found" error for free item purchases
- Fixed BigInt serialization errors in URL state for price filters
- Fixed WaaS fee options handling for invalid chainId
- Fixed balance display showing incorrect values when wallet not connected
- Fixed Transfer Modal chainId race condition
- Fixed CryptoPaymentModal sufficient balance check
- Fixed OpenSea currency filtering with correct side parameter
- Improved error handling and refetch logic in BuyModal

---

## Internal Improvements

- Upgraded dependencies: wagmi, @tanstack/react-query, nuqs (deduped)
- Updated Trails SDK to v0.9.5
- Added comprehensive test coverage for transaction hooks
- Improved TypeScript type inference across the SDK
- Streamlined inventory queries for better performance

---

## Migration Guide

### 1. Update numeric values to BigInt

```typescript
// Before
useBuyModal().show({
  collectionAddress: '0x...',
  tokenId: '123',
  // ...
});

// After
useBuyModal().show({
  collectionAddress: '0x...',
  tokenId: 123n,
  // ...
});
```

### 2. Update count hook usage

```typescript
// Before
const { data } = useMarketItemsCount({ ... });
const count = data?.count;

// After
const { data: count } = useMarketItemsCount({ ... });
// count is now a number directly
```

### 3. Handle removed activities hooks

```typescript
// Before
const { data } = useListCollectionActivities({ ... });

// After
// Activities hooks have been removed. 
// Fetch directly from the indexer if needed.
```

### 4. Leverage headless mode (optional)

```typescript
// For custom UI implementations
function MyCustomModal() {
  const ctx = useBuyModalContext();
  
  // Use ctx.steps, ctx.checkoutMode, ctx.handleTransactionSuccess
  // to build your own transaction UI
}
```

---

## Full Changelog

See [GitHub Releases](https://github.com/0xsequence/marketplace-sdk/releases) for the complete list of changes.
