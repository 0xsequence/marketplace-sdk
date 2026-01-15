# Headless Playground Tasks

## Goal

Create a minimal React/Vite playground that tests the SDK in a truly headless way:
- **No** `@0xsequence/connect` (use raw wagmi + MetaMask)
- **No** `@0xsequence/design-system` 
- **No** `shared-components`
- Custom modal UI built on top of SDK hooks/stores
- Find bugs, missing exports, and UX improvements in headless usage

---

## Context & Background

### Why This Playground?

The marketplace SDK is designed to work with Sequence's wallet infrastructure (`@0xsequence/connect`), but many developers want to:
1. Use their own wallet provider (MetaMask, RainbowKit, etc.)
2. Build completely custom UI on top of SDK data/transaction hooks
3. Avoid Sequence design system dependencies

This playground validates that the SDK works in this "headless" mode and helps us find any issues.

### Technical Investigation Findings

#### SDK Export Structure

```
@0xsequence/marketplace-sdk
├── /react              # Full exports including UI
│   ├── /hooks          # Data & transaction hooks (HEADLESS) ✅
│   ├── /queries        # TanStack Query options (HEADLESS) ✅
│   ├── /providers      # MarketplaceProvider, ModalProvider
│   ├── /ui             # Pre-built components (NOT for headless)
│   └── /ssr            # SSR utilities
├── /react/hooks        # Direct hook imports
├── /react/queries      # Direct query imports
└── /styles/index.css   # CSS (not needed for headless)
```

#### How @0xsequence/connect is Used in SDK

Searched SDK source and found these usages:

| File | Import | Purpose | Needed for MetaMask? |
|------|--------|---------|---------------------|
| `providers/index.tsx` | `useOpenConnectModal` | Default connect modal | **NO** - we provide custom `openConnectModal` |
| `_internal/wagmi/get-connectors.ts` | Multiple connectors | Create wagmi config | **NO** - we create our own config |
| `hooks/transactions/useCancelOrder.tsx` | `useWaasFeeOptions` | WaaS fee selection | **NO** - WaaS only |
| `hooks/utils/useAutoSelectFeeOption.tsx` | `useChain` | Chain utilities | **NO** - WaaS only |
| `ui/modals/BuyModal/hooks/useExecuteBundledTransactions.ts` | `sendTransactions` | Transaction bundling | **NO** - WaaS only |

**Key finding:** Most `@0xsequence/connect` usage is for WaaS (embedded wallet) features. For MetaMask, we bypass all of this.

#### MarketplaceProvider Architecture

```tsx
// From sdk/src/react/providers/index.tsx
export function MarketplaceProvider({
  config,
  children,
  openConnectModal,  // <-- KEY: If provided, skips @0xsequence/connect
}: MarketplaceSdkProviderProps) {
  // ...
  if (openConnectModal) {
    // Uses OUR openConnectModal function
    // Does NOT use useOpenConnectModal from @0xsequence/connect
    return (
      <MarketplaceSdkContext.Provider value={context}>
        {children}
      </MarketplaceSdkContext.Provider>
    );
  }
  // Falls back to Sequence connect only if openConnectModal not provided
}
```

#### Modal Store Architecture

Each modal (Buy, Sell, List, Offer, Transfer) uses `@xstate/store`:

```tsx
// Example: BuyModal store (sdk/src/react/ui/modals/BuyModal/store.ts)
export const buyModalStore = createStore({
  context: {
    isOpen: boolean,
    props: BuyModalProps | null,
    quantity: number,
    paymentModalState: 'idle' | 'opening' | 'open' | 'closed',
  },
  on: {
    open: (context, event) => { /* ... */ },
    close: (context) => { /* ... */ },
    setQuantity: (context, event) => { /* ... */ },
  },
});

// Exported selectors
export const useIsOpen = () => useSelector(buyModalStore, (s) => s.context.isOpen);
export const useBuyModalProps = () => useSelector(buyModalStore, (s) => s.context.props);
export const useQuantity = () => useSelector(buyModalStore, (s) => s.context.quantity);
```

**For custom modals:** Subscribe to these stores and build your own UI!

#### Wagmi + MetaMask Setup (No @0xsequence/connect)

```tsx
import { createConfig, http } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { arbitrumSepolia, polygon } from 'wagmi/chains';

// Simple config with just injected connector (MetaMask, Rabby, etc.)
const wagmiConfig = createConfig({
  chains: [arbitrumSepolia, polygon],
  connectors: [injected()],
  transports: {
    [arbitrumSepolia.id]: http(),
    [polygon.id]: http(),
  },
});

// Connect button using wagmi hooks
function ConnectButton() {
  const { connect, connectors } = useConnect();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  
  if (isConnected) {
    return <button onClick={() => disconnect()}>{address}</button>;
  }
  return (
    <button onClick={() => connect({ connector: connectors[0] })}>
      Connect Wallet
    </button>
  );
}
```

#### Minimum Provider Setup for Headless

```tsx
import { 
  getQueryClient,
  MarketplaceProvider,
  getWagmiChainsAndTransports,
  marketplaceConfigOptions,
} from '@0xsequence/marketplace-sdk/react';
import { QueryClientProvider, useQuery } from '@tanstack/react-query';
import { WagmiProvider, createConfig } from 'wagmi';
import { injected } from 'wagmi/connectors';

function Providers({ children }) {
  const [showConnectDialog, setShowConnectDialog] = useState(false);
  
  // Fetch marketplace config
  const queryClient = getQueryClient();
  const { data: marketplaceConfig } = useQuery(
    marketplaceConfigOptions(sdkConfig),
    queryClient,
  );

  // Create wagmi config with SDK's chain/transport helpers
  const wagmiConfig = useMemo(() => {
    if (!marketplaceConfig) return null;
    return createConfig({
      ...getWagmiChainsAndTransports({ marketplaceConfig, sdkConfig }),
      connectors: [injected()],
    });
  }, [marketplaceConfig]);

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        <MarketplaceProvider 
          config={sdkConfig}
          openConnectModal={() => setShowConnectDialog(true)}
        >
          {children}
          {/* NO ModalProvider - we build custom modals */}
        </MarketplaceProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
}
```

#### Transaction Hooks (Fully Headless)

These hooks work independently of UI:

```tsx
// Listing
import { useGenerateListingTransaction } from '@0xsequence/marketplace-sdk/react/hooks';
const { generateListingTransaction } = useGenerateListingTransaction();

// Offer
import { useGenerateOfferTransaction } from '@0xsequence/marketplace-sdk/react/hooks';
const { generateOfferTransaction } = useGenerateOfferTransaction();

// Sell (accept offer)
import { useGenerateSellTransaction } from '@0xsequence/marketplace-sdk/react/hooks';
const { generateSellTransaction } = useGenerateSellTransaction();

// Cancel
import { useCancelOrder } from '@0xsequence/marketplace-sdk/react/hooks';
const { cancelOrder } = useCancelOrder();

// Transfer
import { useTransferTokens } from '@0xsequence/marketplace-sdk/react/hooks';
const { transferTokens } = useTransferTokens();
```

---

## Phase 1: Basic Setup

### 1.1 Create Playground Structure
- [ ] Create `playgrounds/headless/` directory
- [ ] `package.json` with minimal dependencies
- [ ] `vite.config.ts` with React + Tailwind plugins
- [ ] `tsconfig.json`
- [ ] `index.html`
- [ ] Basic Tailwind v4 setup (uses Vite plugin, no config file needed)

### 1.2 Wagmi Config (No @0xsequence/connect)
- [ ] Create `src/config/wagmi.ts`
  - Use `injected()` connector only (MetaMask/Rabby/etc)
  - Configure chains from SDK's marketplace config
  - Use SDK's `getWagmiChainsAndTransports()` for RPC URLs
- [ ] Verify wagmi works independently

### 1.3 SDK Provider Setup
- [ ] Create `src/providers/Providers.tsx`
  - `WagmiProvider` with our custom config
  - `QueryClientProvider` with SDK's `getQueryClient()`
  - `MarketplaceProvider` with custom `openConnectModal`
  - **NO** `ModalProvider` (we'll build custom modals)
- [ ] Create simple `ConnectButton.tsx` component
- [ ] Create simple connect dialog/modal

### 1.4 Basic Routing
- [ ] Set up react-router with basic routes:
  - `/` - Home/Collections list
  - `/:chainId/:collectionAddress` - Collection view
  - `/:chainId/:collectionAddress/:tokenId` - Collectible detail

### 1.5 SDK Config
- [ ] Create `src/config/sdk.ts` with `SdkConfig`
- [ ] Use existing project access key from other playgrounds
- [ ] Configure for testnet initially (arbitrum-sepolia)

---

## Phase 2: Data Hooks Testing

### 2.1 Collection Data
- [ ] Use marketplace config's `collections` array
- [ ] Display collections in a simple grid/list
- [ ] Test `useCollectionMetadata` hook
- [ ] Verify data loads correctly without Sequence design system

### 2.2 Collectible Hooks  
- [ ] Test `useListCollectibles` (paginated)
- [ ] Test `useCollectibleMetadata` for single item
- [ ] Test `useCollectibleMarketLowestListing`
- [ ] Test `useCollectibleMarketHighestOffer`
- [ ] Test `useCollectibleBalance` for connected wallet
- [ ] Display collectible cards with raw data (image, name, price)

### 2.3 Inventory Hooks
- [ ] Test `useListInventory` for connected wallet
- [ ] Display owned items
- [ ] Show balance for each item

### 2.4 Currency Hooks
- [ ] Test `useListCurrencies` for available currencies
- [ ] Test `useCurrency` for specific currency details
- [ ] Display prices correctly formatted

### 2.5 Order Hooks
- [ ] Test `useListCollectibleListings` for active listings
- [ ] Test `useListCollectibleOffers` for active offers
- [ ] Display order data in tables/lists

---

## Phase 3: Custom Modal Implementations

### 3.1 Buy Modal (Marketplace)
- [ ] Create `src/components/modals/BuyModal.tsx`
- [ ] Subscribe to `buyModalStore` for open/close state
- [ ] Use `useBuyModalProps()` to get modal props
- [ ] Build custom UI:
  - Collectible image & name
  - Price display with currency
  - Quantity selector (for ERC1155)
  - Total calculation
  - Confirm/Cancel buttons
- [ ] Use transaction hooks for execution
- [ ] Handle states: idle, confirming, pending, success, error
- [ ] Test with MetaMask signing flow

### 3.2 Buy Modal (Shop/Primary Sale)
- [ ] Extend BuyModal to handle `cardType: 'shop'`
- [ ] Test `useCheckoutOptionsSalesContract` for payment options
- [ ] Handle ERC1155 quantity selection
- [ ] Test minting flow

### 3.3 Create Listing Modal
- [ ] Create `src/components/modals/ListModal.tsx`
- [ ] Build custom form:
  - Price input with validation
  - Currency selector dropdown
  - Expiry date picker (simple date input)
  - Marketplace selector (if multiple)
- [ ] Use `useGenerateListingTransaction`
- [ ] Handle multi-step flow:
  1. Approval transaction (if needed)
  2. Listing transaction
- [ ] Show step progress
- [ ] Test full flow with MetaMask

### 3.4 Make Offer Modal
- [ ] Create `src/components/modals/OfferModal.tsx`
- [ ] Build custom form:
  - Price input
  - Currency selector (ERC20 only)
  - Expiry date
  - Quantity (for ERC1155)
- [ ] Use `useGenerateOfferTransaction`
- [ ] Handle ERC20 approval flow
- [ ] Test with MetaMask

### 3.5 Sell Modal (Accept Offer)
- [ ] Create `src/components/modals/SellModal.tsx`
- [ ] Display offer details
- [ ] Show earnings calculation (price - fees)
- [ ] Use `useGenerateSellTransaction`
- [ ] Test accepting offers

### 3.6 Transfer Modal
- [ ] Create `src/components/modals/TransferModal.tsx`
- [ ] Simple form:
  - Recipient address input
  - Quantity (for ERC1155)
- [ ] Use `useTransferTokens`
- [ ] Test NFT transfers

---

## Phase 4: Edge Cases & Bug Hunting

### 4.1 Wallet Connection Edge Cases
- [ ] Test connecting/disconnecting rapidly
- [ ] Test switching accounts mid-session
- [ ] Test switching chains
- [ ] Test with wallet locked
- [ ] Test rejecting connection request
- [ ] Test with no wallet installed

### 4.2 Transaction Edge Cases
- [ ] Test user rejecting transaction in wallet
- [ ] Test insufficient ETH balance for gas
- [ ] Test insufficient token balance
- [ ] Test insufficient ERC20 allowance
- [ ] Test network errors during transaction
- [ ] Test gas estimation failures
- [ ] Test transaction timeout

### 4.3 UI State Edge Cases
- [ ] Test opening modal while another is open
- [ ] Test closing modal mid-transaction
- [ ] Test browser back/forward during flow
- [ ] Test page refresh during pending transaction
- [ ] Test rapid open/close of modals

### 4.4 Non-Sequence Wallet Specific
- [ ] Verify no WaaS-specific code throws errors
- [ ] Verify `isSequenceConnector` checks handle `false` gracefully
- [ ] Verify approval flows work (no bundling available)
- [ ] Verify transaction confirmation UX is acceptable
- [ ] Test that fee options UI doesn't appear (WaaS only)

### 4.5 Data Edge Cases
- [ ] Test with collection that has no listings
- [ ] Test with collection that has no offers
- [ ] Test with empty inventory
- [ ] Test with very long token names/descriptions
- [ ] Test with missing metadata

---

## Phase 5: Documentation & Findings

### 5.1 Document Issues Found
- [ ] Create GitHub issues for any bugs discovered
- [ ] Note any missing hook exports needed for headless
- [ ] Note any missing type exports
- [ ] Note documentation gaps
- [ ] Note any confusing APIs

### 5.2 Headless Usage Guide
- [ ] Document minimum provider setup
- [ ] Document wagmi config requirements
- [ ] Document how to use each transaction hook
- [ ] Document modal store subscription pattern
- [ ] Provide complete code examples
- [ ] Document which features require @0xsequence/connect

### 5.3 SDK Improvements
- [ ] List suggested improvements for headless DX
- [ ] Propose new exports if needed
- [ ] Suggest documentation additions

---

## File Structure

```
playgrounds/headless/
├── package.json
├── vite.config.ts
├── tsconfig.json
├── index.html
└── src/
    ├── main.tsx                 # Entry point
    ├── App.tsx                  # Main app with routing
    ├── styles.css               # Tailwind imports
    │
    ├── config/
    │   ├── sdk.ts               # SdkConfig
    │   └── wagmi.ts             # Wagmi config (no @0xsequence/connect)
    │
    ├── providers/
    │   └── Providers.tsx        # All providers composed
    │
    ├── components/
    │   ├── ConnectButton.tsx    # Simple wallet connect
    │   ├── ConnectDialog.tsx    # Connection modal
    │   │
    │   └── modals/
    │       ├── BuyModal.tsx     # Custom buy UI
    │       ├── ListModal.tsx    # Custom listing UI
    │       ├── OfferModal.tsx   # Custom offer UI
    │       ├── SellModal.tsx    # Custom sell UI
    │       └── TransferModal.tsx
    │
    └── pages/
        ├── Home.tsx             # Collections list
        ├── Collection.tsx       # Collectibles grid
        └── Collectible.tsx      # Detail + actions
```

---

## Dependencies

### Required (Minimal)

```json
{
  "dependencies": {
    "@0xsequence/marketplace-sdk": "workspace:*",
    "@0xsequence/api": "catalog:",
    "@0xsequence/indexer": "catalog:",
    "@0xsequence/metadata": "catalog:",
    "@0xsequence/network": "catalog:",
    "@tanstack/react-query": "catalog:",
    "react": "catalog:",
    "react-dom": "catalog:",
    "react-router": "^7.x",
    "viem": "catalog:",
    "wagmi": "catalog:",
    "tailwindcss": "catalog:",
    "@tailwindcss/vite": "catalog:"
  },
  "devDependencies": {
    "@biomejs/biome": "catalog:",
    "@types/react": "catalog:",
    "@types/react-dom": "catalog:",
    "@vitejs/plugin-react": "^5.x",
    "typescript": "catalog:",
    "vite": "catalog:",
    "vite-tsconfig-paths": "catalog:"
  }
}
```

### Explicitly NOT Including

| Package | Reason |
|---------|--------|
| `@0xsequence/connect` | Testing without Sequence wallet kit |
| `@0xsequence/design-system` | Testing without Sequence UI |
| `@0xsequence/checkout` | Only needed if using Sequence checkout |
| `shared-components` | Building from scratch |
| `nuqs` | Keep URL state simple |
| `react-virtuoso` | Not needed for basic testing |
| `sonner` | Use simple alerts or custom toasts |

---

## Success Criteria

This playground is successful when:

1. **Connection works** - Can connect MetaMask without any @0xsequence/connect code
2. **Data loads** - All hooks return data correctly
3. **Transactions work** - Can complete buy/sell/list/offer/transfer flows
4. **No runtime errors** - No errors from missing Sequence dependencies
5. **Documented** - Clear guide for other developers to do the same
