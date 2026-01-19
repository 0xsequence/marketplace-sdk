# @0xsequence/marketplace-sdk v2.0.0 - Changelog Draft

## Overview

This document captures all changes since v1.2.1 for the v2.0.0 release. The release includes **~100 merged PRs** with **679 files changed, 44,204 insertions, 29,450 deletions**.

**Last Release**: v1.2.1 (2025-12-05)
**Target Release**: v2.0.0

---

## Major Feature Areas

### 1. Trails Integration (Default Checkout Mode)

**What is Trails?**
Trails (`0xtrails` package) is Sequence's new unified checkout solution that enables:
- Fiat on-ramp payments (credit card, bank transfer)
- Cross-chain payments 
- Gasless transactions
- Unified payment UX across all supported chains

**Implementation Details:**
- Trails is now the **default checkout mode** for the SDK (`checkoutMode: 'trails'`)
- Falls back to `'crypto'` mode when:
  - Chain is not supported by Trails
  - Order doesn't support Trails (`canBeUsedWithTrails: false`)
- New `isTrailsEnabled` property in `MarketplaceSettings` interface (PR #722)
- Custom CSS theming to match Sequence design system (`TrailsCss.ts`)
- Integration with `CollectibleMetadataSummary` component in TrailsWidget modal (PR #677)

**Configuration:**
```typescript
type CheckoutMode =
  | 'crypto'        // Direct crypto payment
  | 'trails'        // Default - Trails unified checkout
  | {
      mode: 'sequence-checkout';
      options: CheckoutOptions;
    };

// SDK Config
const config: SdkConfig = {
  projectAccessKey: '...',
  projectId: '...',
  checkoutMode: 'trails', // Default
  _internal: {
    overrides: {
      api: {
        trails: {
          env: 'production', // or 'development', 'next'
          url: 'custom-url', // optional override
        }
      }
    }
  }
};
```

**Related PRs:**
- PR #648: V2 trails (initial integration)
- PR #671: Trails theme
- PR #672: Fix useWithTrailsParam
- PR #673: fix: add required param validation for market count and floor hooks
- PR #674: fix: update trails API URL to include dynamic postfix
- PR #675: Trails: Add node and indexer url
- PR #676: Fix services config
- PR #677: integrate CollectibleMetadataSummary into TrailsWidget modal
- PR #690: upgrade trails 0.9.3
- PR #722: feat: add isTrailsEnabled property to MarketplaceSettings

---

### 2. Complete Headless Mode (Modal Context Hooks)

**What Changed:**
All modal components now export their internal context hooks, enabling fully headless/custom UI implementations.

**Exported Context Hooks:**
```typescript
// From '@0xsequence/marketplace-sdk/react'
import {
  useBuyModal,
  useBuyModalContext,           // NEW
  useCreateListingModal,
  useCreateListingModalContext, // NEW
  useMakeOfferModal,
  useMakeOfferModalContext,     // NEW
  useSellModal,
  useSellModalContext,          // NEW
  useTransferModal,
  useTransferModalContext,      // NEW
} from '@0xsequence/marketplace-sdk/react';
```

**Context Types Exported:**
- `BuyModalContext`
- `CreateListingModalContext`
- `MakeOfferModalContext`
- `SellModalContext`
- `TransferModalContext`

**Usage Pattern:**
```typescript
// Headless implementation - use the context hook to build custom UI
function CustomBuyComponent() {
  const {
    config,
    modalProps,
    close,
    steps,
    collectible,
    collection,
    primarySaleItem,
    marketOrder,
    isShop,
    buyStep,
    isLoading,
    checkoutMode,
    formattedAmount,
    handleTransactionSuccess,
    handleTrailsSuccess,
  } = useBuyModalContext();
  
  // Build your own UI with full access to modal state
}
```

**Related PRs:**
- PR #727: feat(modals): export context hooks for headless implementations
- PR #628: Headless buy modal (foundation)

---

### 3. Type System Overhaul - BigInt & Viem Compatible Types

**Major Changes:**
All exported types now use `bigint` primitives and are fully compatible with viem types.

**New Universal Type Primitives (`@0xsequence/api-client`):**
```typescript
// From api/src/types/primitives.ts
import type { Address, Hash } from 'viem';

export type ChainId = number;
export type TokenId = bigint;       // Was: string
export type Address = ViemAddress;  // viem compatible
export type ContractAddress = Address;
export type WalletAddress = Address;
export type Amount = bigint;        // Wei, was: string
export type Quantity = bigint;      // Was: string/number
export type Hash = ViemHash;        // viem compatible
export type ProjectId = number;
```

**SDK Types Using BigInt:**
```typescript
// Types now using bigint
type Price = {
  amountRaw: bigint;  // Was: string
  currency: Currency;
};

// Card/Component props
interface CardProps {
  tokenId: bigint;              // Was: string
  amount: bigint;               // Was: string
  quantityInitial: bigint;      // Was: string
  quantityRemaining: bigint;    // Was: string
  onCollectibleClick?: (tokenId: bigint) => void;
}

// Transaction types
interface PrimarySaleParams {
  tokenIds: bigint[];
  maxTotal: bigint;
}
```

**Utility Functions for BigInt Handling:**
```typescript
// Price utilities
formatPrice(amount: bigint, decimals: number): string;
formatReadablePrice(amount: bigint, decimals: number): string;
formatFullPrice(amount: bigint, decimals: number): string;
parsePrice(amount: string, decimals: number): bigint;

// BigInt serialization for query keys
serializeBigInts<T>(obj: T): T;  // Converts bigint to string for React Query keys

// Price filter normalization (URL state)
normalizePriceFilters(filters: UrlPriceFilter[]): PriceFilter[];
```

**Breaking Change:** Components and hooks now expect/return `bigint` for:
- `tokenId`
- `amount` / `priceAmount`
- `quantity` / `quantityInput`
- `quantityInitial` / `quantityRemaining`

**Related PRs:**
- PR #716: Feat/type inference refactor
- PR #714: refactor: derive types from API contract
- PR #712: Fix type transform getTokenBalances
- PR #707: fix: resolve BigInt serialization error in price filter URL state
- PR #650: V2 bigint fix
- PR #646: Use bigint for tokenId in UseTransferModalArgs.prefetch
- PR #666: fix: Externalize peer dependency types to resolve wagmi/viem type conflicts
- PR #667: External peer dependency viem

---

### 4. New `@0xsequence/api-client` Package

A new internal package providing unified API adapters with normalized types:

**Exports:**
```typescript
// Enums (value exports)
export {
  CollectionStatus,
  ContractType,
  MarketplaceKind,
  OrderbookKind,
  OrderSide,
  OrderStatus,
  PropertyType,
  SortOrder,
  StepType,
  TransactionCrypto,
  WalletKind,
} from '@0xsequence/api-client';

// Types
export type {
  Collectible,
  CollectibleOrder,
  Collection,
  Currency,
  Order,
  OrderData,
  Step,
  TokenMetadata,
  // ... many more
} from '@0xsequence/api-client';

// Namespace exports for direct API access
export * as Builder from './adapters/builder';
export * as Indexer from './adapters/indexer';
export * as Marketplace from './adapters/marketplace';
export * as Metadata from './adapters/metadata';
```

**Key Features:**
- Types derived directly from generated API clients
- Consistent `ContractType` enum across all adapters (unified export)
- viem-compatible primitive types
- MSW mocks for testing (separate entry points)

**Related PRs:**
- PR #686: Unify contract type export
- PR #701: Remove indexer-v2 import
- PR #702: fix: remove msw mock exports from api-client main entry

---

## Breaking Changes Summary

### Type Changes
| Before (v1.x) | After (v2.0) | Migration |
|--------------|--------------|-----------|
| `tokenId: string` | `tokenId: bigint` | Use `BigInt(tokenId)` |
| `amount: string` | `amount: bigint` | Use `BigInt(amount)` |
| `quantity: string` | `quantity: bigint` | Use `BigInt(quantity)` |
| Types bundled in SDK | Types from `@0xsequence/api-client` | Import from api-client |

### Removed APIs
| Removed | Replacement |
|---------|-------------|
| `listCollectionActivities` | Removed (PR #725) |
| `listCollectibleActivities` | Removed (PR #725) |
| Indexer v2 imports | Use Indexer v3 (PR #701) |
| `quantityDecimals` prop | Removed from all components (PR #684) |

### Hook Parameter Changes
| Hook | Change |
|------|--------|
| `useCollection` | `collectionAddress` now accepts `undefined` (optional value) |
| `useCollectionMetadata` | Now requires `chainId` and `collectionAddress` |
| `useTokenBalances` | Now requires `contractAddress` |
| All count hooks | Return `number` instead of `{ count: number }` |

---

## New Features

### New Hooks
- `useERC721Owner` - Read ERC721 token owner (PR #659)
- `usePrimarySaleItem` - Fetch single primary sale item (PR #645)
- `useGetPrimarySaleItem` - Query for individual primary sale items
- `useCollectionActiveListingsCurrencies` - Fetch active listing currencies
- `useCollectionActiveOffersCurrencies` - Fetch active offer currencies

### New Components
- Modal context hooks for headless implementations
- `NonTradableInventoryCard` with proper metadata typing (PR #717)

### New Utilities
- `normalizeProperties` / `normalizeAttributes` - Property/attribute normalization (PR #718)
- `normalizePriceFilters` - URL-safe price filter handling (PR #707)
- `serializeBigInts` - BigInt serialization for query keys

---

## Bug Fixes (Since v1.2.1)

### Critical Fixes
- **Free item purchases**: Fixed "Price amount not found" error (PR #709)
- **BigInt serialization**: Resolved URL state errors with price filters (PR #707)
- **WaaS fee options**: Handle invalid chainId gracefully (PR #726)
- **Balance display**: Show 0 items when wallet not connected (PR #708)
- **TanStack Query v5**: Return `null` instead of `undefined` (PR #711)

### Modal Fixes
- **CryptoPaymentModal**: Integrated WaaS fee selection (PR #720)
- **CryptoPaymentModal**: Fixed sufficient balance check (PR #691)
- **Transfer Modal**: Fixed chainId race condition (PR #726, #727)
- **Buy Modal**: Fixed content modals display (PR #670)

### Transaction Fixes
- **Unbundled transactions**: Fixed approval button state (PR #679)
- **toStep validation**: Improved transaction/signature step validation (PR #678)
- **sendTransactions**: Handle return type and wallet client availability (PR #724)
- **Approval**: Adjusted arguments to maxUint256 (PR #692)

### API/Query Fixes
- **GetContractInfoBatch**: Chunk requests to respect 15 address limit (PR #696)
- **Empty address handling**: Defensive validation in transforms (PR #697, #700)
- **WalletConnect SSR**: Use window check for detection (PR #710)
- **Query keys**: Updated for market offers/listings (PR #706)

---

## Internal Improvements

### Testing
- Comprehensive tests for:
  - `useMarketTransactionSteps` (PR #715)
  - `useTransactionExecution` (PR #715)
  - `useCollectibleCardOfferState` (PR #715)
  - `useFilterState` (PR #715)
  - `optimisticCancelUpdates` (PR #715)
- Tests for ERC1155 sale payment (PR #688)
- Updated test mocks for API types (PR #715)

### Build/Dependencies
- Upgraded and deduped: wagmi, nuqs, react-query (PR #729)
- Node 24 / pnpm 10 in CI (PR #704)
- Updated trails to 0.9.5
- Removed legendstate dependency (PR #661)

### Code Quality
- ESLint type enforcement configs (PR #716)
- Type derivation from API clients (PR #714)
- Removed unused exports and comments
- Streamlined inventory queries (PR #703)

---

## Migration Guide

### 1. Update Types to BigInt

```typescript
// Before
const tokenId = "123";
const amount = "1000000000000000000";

// After
const tokenId = BigInt("123");
const amount = BigInt("1000000000000000000");
// or
const tokenId = 123n;
const amount = 1000000000000000000n;
```

### 2. Update Modal Usage for Headless

```typescript
// Before - Using modals with callbacks
const { show } = useBuyModal();
show({ ...props });

// After - Headless with context
function CustomBuyUI() {
  const ctx = useBuyModalContext();
  // Full control over UI with ctx.steps, ctx.checkoutMode, etc.
}
```

### 3. Handle Removed APIs

```typescript
// Before
const { data } = useListCollectionActivities(...);

// After - Activities hooks removed
// Use alternative API or fetch directly from indexer
```

### 4. Update Count Hook Usage

```typescript
// Before
const count = data?.count;

// After
const count = data; // Returns number directly
```

---

## Full PR List (Since v1.2.1)

### Features
- PR #727: feat(modals): export context hooks for headless implementations
- PR #722: feat: add isTrailsEnabled property to MarketplaceSettings
- PR #720: feat: integrate WaaS fee selection into CryptoPaymentModal
- PR #718: Standardize properties and attributes
- PR #716: Feat/type inference refactor
- PR #705: feat: enhance validation for collection addresses

### Refactors
- PR #730: Crypto payment modal use bundled txn execution
- PR #728: fix(useMarketTransactionSteps): update walletType based on connector metadata
- PR #725: Remove activities query hooks
- PR #723: indexer-v3-gettokenbalances
- PR #714: refactor: derive types from API contract
- PR #713: refactor: Update UseCollectionMetadataParams
- PR #706: refactor: update query keys for market offers/listings
- PR #703: streamline collectible handling in inventory queries
- PR #686: Unify contract type export

### Fixes
- PR #729: Upgrade and dedupe dependencies
- PR #726: fix(useWaasFeeOptions): handle invalid chainId gracefully
- PR #724: fix: handle sendTransactions return type
- PR #721: fix: enhance primarySalePrice validation
- PR #719: fix: make collectionAddress value optional
- PR #712: Fix type transform getTokenBalances
- PR #711: fix: return null instead of undefined for TanStack Query v5
- PR #710: fix: use window check for WalletConnect SSR detection
- PR #709: fix: allow free item purchases (price = 0)
- PR #708: fix: show 0 items for balance when wallet not connected
- PR #707: fix: resolve BigInt serialization error
- PR #704: fix: bump CI node/pnpm versions
- PR #702: fix: remove msw mock exports from api-client
- PR #701: Remove indexer-v2 import
- PR #700: Add defensive validation for empty address
- PR #697: fix(api): handle empty address in toContractInfo
- PR #696: fix(sdk): chunk GetContractInfoBatch requests
- PR #693: fix(playground): resolve nested button hydration error
- PR #692: adjust approval function arguments to maxUint256
- PR #691: Fix CryptoPaymentModal sufficient balance check

### Tests & Docs
- PR #715: Tests (multiple hooks)
- PR #688: Write tests
- PR #694: refactor(playground): update collection type

### Trails Integration
- PR #690: upgrade trails 0.9.3
- PR #677: integrate CollectibleMetadataSummary into TrailsWidget
- PR #676: Fix services config
- PR #675: Trails: Add node and indexer url
- PR #674: fix: update trails API URL
- PR #673: fix: add required param validation
- PR #672: Fix useWithTrailsParam
- PR #671: Trails theme
- PR #670: Fix buy modal content modals
- PR #669: show SequenceCheckout for free sale items
- PR #668: Display 'Free' for zero-cost items
- PR #648: V2 trails

### Modal Refactors
- PR #684: Remove quantity decimals
- PR #683: Simplify shop buy modal props
- PR #681: Fix: Price and value missing from step
- PR #680: use orderbook from marketplace config
- PR #679: fix unbundled txns - fix approval button state
- PR #678: Refactor toStep function
- PR #667: External peer dependency viem
- PR #666: fix: Externalize peer dependency types
- PR #665: Buy modal params for shop
- PR #664: Only load wallet connect clientside
- PR #662: Make useCurrency hook accept optional parameters
- PR #661: remove unused legendstate dependency
- PR #660: refactor(buy-modal): change items array to single item
- PR #659: Add useERC721Owner hook
- PR #658: Conditionally render Trails based on canBeUsedWithTrails
- PR #657: Remove hook callbacks
- PR #656: Add explicit return typing for useTransferTokens
- PR #655: remove unnecessary useeffect in contexts
- PR #654: transfer flow v2
- PR #653: refactor sell modal and context to v2 structure
- PR #652: Refactor query options to enforce required parameters
- PR #650: V2 bigint fix
- PR #649: Make config optional in SdkQueryParams
- PR #647: add marketCollections and shopCollections to LookupMarketplace
- PR #646: Use bigint for tokenId in UseTransferModalArgs
- PR #645: Add usePrimarySaleItem hook
- PR #644: V2 merge master
- PR #643: Listing modal v2
- PR #637: Refactor BuyModal to use new payment parameters hook
- PR #636: Make offer modal refactor
- PR #633: Checkout mode - Sequence Checkout flow
- PR #631: Sell modal guards
- PR #630: Remove `quantityDecimals` from components and hooks
- PR #628: Headless buy modal

---

## Summary for Final Changelog

**Key Highlights for v2.0:**

1. **Trails Integration** - Default checkout mode with fiat on-ramp, cross-chain payments, and gasless transactions
2. **Complete Headless Support** - All modal context hooks exported for custom UI implementations
3. **BigInt & Viem Types** - All types now use `bigint` primitives and are viem-compatible
4. **New API Client Package** - Unified `@0xsequence/api-client` with normalized types
5. **Breaking Changes** - Type system overhaul requires migration from string to bigint for tokenId, amounts, quantities

