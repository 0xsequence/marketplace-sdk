# Marketplace SDK Hooks Documentation Status

This document provides a comprehensive overview of all React hooks in the Marketplace SDK and their JSDoc documentation status.

## Summary

- **Total Hooks**: 60
- **✅ Documented**: 60 (100%)
- **❌ Undocumented**: 0 (0%)

## Hooks by Category

### Configuration Hooks

| Hook | Location | JSDoc Status | Description |
|------|----------|--------------|-------------|
| `useConfig` | `config/useConfig.tsx` | ✅ Documented | Gets marketplace SDK configuration context |
| `useConnectorMetadata` | `config/useConnectorMetadata.tsx` | ✅ Documented | Gets wallet connector metadata |
| `useMarketplaceConfig` | `config/useMarketplaceConfig.tsx` | ✅ Documented | Gets marketplace-specific configuration |

### Contract Hooks

| Hook | Location | JSDoc Status | Description |
|------|----------|--------------|-------------|
| `useSalesContractABI` | `contracts/useSalesContractABI.ts` | ✅ Documented | Gets sales contract ABI |

### Data Hooks

#### Collectibles

| Hook | Location | JSDoc Status | Description |
|------|----------|--------------|-------------|
| `useBalanceOfCollectible` | `data/collectibles/useBalanceOfCollectible.tsx` | ✅ Documented | Gets the balance of a specific collectible for an account |
| `useCollectible` | `data/collectibles/useCollectible.tsx` | ✅ Documented | Fetches metadata for a specific collectible |
| `useCountOfCollectables` | `data/collectibles/useCountOfCollectables.tsx` | ✅ Documented | Gets the count of collectibles in a collection |
| `useListCollectibleActivities` | `data/collectibles/useListCollectibleActivities.tsx` | ✅ Documented | Lists activities for a specific collectible |
| `useListCollectibles` | `data/collectibles/useListCollectibles.tsx` | ✅ Documented | Lists collectibles with filters |
| `useListCollectiblesPaginated` | `data/collectibles/useListCollectiblesPaginated.tsx` | ✅ Documented | Lists collectibles with pagination |

#### Collections

| Hook | Location | JSDoc Status | Description |
|------|----------|--------------|-------------|
| `useCollection` | `data/collections/useCollection.tsx` | ✅ Documented | Fetches collection information |
| `useCollectionBalanceDetails` | `data/collections/useCollectionBalanceDetails.tsx` | ✅ Documented | Gets collection balance details for an account |
| `useCollectionDetails` | `data/collections/useCollectionDetails.ts` | ✅ Documented | Fetches detailed collection information |
| `useCollectionDetailsPolling` | `data/collections/useCollectionDetailsPolling.tsx` | ✅ Documented | Polls for collection details updates |
| `useListCollectionActivities` | `data/collections/useListCollectionActivities.tsx` | ✅ Documented | Lists activities for a collection |
| `useListCollections` | `data/collections/useListCollections.tsx` | ✅ Documented | Lists collections with filters |

#### Inventory

| Hook | Location | JSDoc Status | Description |
|------|----------|--------------|-------------|
| `useInventory` | `data/inventory/useInventory.tsx` | ✅ Documented | Gets user inventory |

#### Market

| Hook | Location | JSDoc Status | Description |
|------|----------|--------------|-------------|
| `useCurrency` | `data/market/useCurrency.tsx` | ✅ Documented | Fetches currency information |
| `useListMarketCardData` | `data/market/useListMarketCardData.tsx` | ✅ Documented | Lists market card data |
| `useMarketCurrencies` | `data/market/useMarketCurrencies.tsx` | ✅ Documented | Fetches market-supported currencies |

#### Orders

| Hook | Location | JSDoc Status | Description |
|------|----------|--------------|-------------|
| `useCountListingsForCollectible` | `data/orders/useCountListingsForCollectible.tsx` | ✅ Documented | Counts listings for a collectible |
| `useCountOffersForCollectible` | `data/orders/useCountOffersForCollectible.tsx` | ✅ Documented | Counts offers for a collectible |
| `useFloorOrder` | `data/orders/useFloorOrder.tsx` | ✅ Documented | Gets floor price for a collection |
| `useHighestOffer` | `data/orders/useHighestOffer.tsx` | ✅ Documented | Gets highest offer for a collectible |
| `useListListingsForCollectible` | `data/orders/useListListingsForCollectible.tsx` | ✅ Documented | Lists all listings for a collectible |
| `useListOffersForCollectible` | `data/orders/useListOffersForCollectible.tsx` | ✅ Documented | Lists offers for a collectible |
| `useLowestListing` | `data/orders/useLowestListing.tsx` | ✅ Documented | Gets lowest listing for a collectible |

#### Primary Sales

| Hook | Location | JSDoc Status | Description |
|------|----------|--------------|-------------|
| `useCountOfPrimarySaleItems` | `data/primary-sales/useCountOfPrimarySaleItems.tsx` | ✅ Documented | Counts primary sale items (deprecated) |
| `useErc721SalesData` | `data/primary-sales/useErc721SalesData.tsx` | ✅ Documented | Fetches ERC721 sales contract data |
| `useGetCountOfPrimarySaleItems` | `data/primary-sales/useGetCountOfPrimarySaleItems.tsx` | ✅ Documented | Gets count of primary sale items |
| `useList1155ShopCardData` | `data/primary-sales/useList1155ShopCardData.tsx` | ✅ Documented | Lists ERC1155 shop card data |
| `useList721ShopCardData` | `data/primary-sales/useList721ShopCardData.tsx` | ✅ Documented | Lists ERC721 shop card data |
| `useListPrimarySaleItems` | `data/primary-sales/useListPrimarySaleItems.tsx` | ✅ Documented | Lists primary sale items |

#### Tokens

| Hook | Location | JSDoc Status | Description |
|------|----------|--------------|-------------|
| `useCurrencyBalance` | `data/tokens/useCurrencyBalance.tsx` | ✅ Documented | Gets currency balance for an account |
| `useGetTokenRanges` | `data/tokens/useGetTokenRanges.tsx` | ✅ Documented | Gets token ID ranges for a collection |
| `useListBalances` | `data/tokens/useListBalances.tsx` | ✅ Documented | Lists token balances for an account |
| `useListTokenMetadata` | `data/tokens/useListTokenMetadata.tsx` | ✅ Documented | Lists token metadata |
| `useSearchTokenMetadata` | `data/tokens/useSearchTokenMetadata.tsx` | ✅ Documented | Searches token metadata |
| `useTokenSupplies` | `data/tokens/useTokenSupplies.ts` | ✅ Documented | Gets token supply information |

### Transaction Hooks

| Hook | Location | JSDoc Status | Description |
|------|----------|--------------|-------------|
| `useCancelOrder` | `transactions/useCancelOrder.tsx` | ✅ Documented | Cancels an order |
| `useCancelTransactionSteps` | `transactions/useCancelTransactionSteps.tsx` | ✅ Documented | Gets cancel transaction steps |
| `useGenerateCancelTransaction` | `transactions/useGenerateCancelTransaction.tsx` | ✅ Documented | Generates cancel transaction |
| `useGenerateListingTransaction` | `transactions/useGenerateListingTransaction.tsx` | ✅ Documented | Generates listing transaction |
| `useGenerateOfferTransaction` | `transactions/useGenerateOfferTransaction.tsx` | ✅ Documented | Generates offer transaction |
| `useGenerateSellTransaction` | `transactions/useGenerateSellTransaction.tsx` | ✅ Documented | Generates sell transaction |
| `useOrderSteps` | `transactions/useOrderSteps.tsx` | ✅ Documented | Gets order execution steps |
| `useProcessStep` | `transactions/useProcessStep.ts` | ✅ Documented | Processes transaction steps |
| `useTransferTokens` | `transactions/useTransferTokens.tsx` | ✅ Documented | Transfers tokens |

### UI Hooks

| Hook | Location | JSDoc Status | Description |
|------|----------|--------------|-------------|
| `useFilters` | `ui/useFilters.tsx` | ✅ Documented | Manages filter state |
| `useFilterState` | `ui/useFilterState.tsx` | ✅ Documented | Manages filter UI state |
| `useOpenConnectModal` | `ui/useOpenConnectModal.tsx` | ✅ Documented | Opens wallet connect modal |

### Utility Hooks

| Hook | Location | JSDoc Status | Description |
|------|----------|--------------|-------------|
| `useAutoSelectFeeOption` | `utils/useAutoSelectFeeOption.tsx` | ✅ Documented | Auto-selects optimal fee option |
| `useCheckoutOptions` | `utils/useCheckoutOptions.tsx` | ✅ Documented | Gets checkout options |
| `useCheckoutOptionsSalesContract` | `utils/useCheckoutOptionsSalesContract.tsx` | ✅ Documented | Gets sales contract checkout options |
| `useComparePrices` | `utils/useComparePrices.tsx` | ✅ Documented | Compares prices between currencies |
| `useConvertPriceToUSD` | `utils/useConvertPriceToUSD.tsx` | ✅ Documented | Converts price to USD |
| `useEnsureCorrectChain` | `utils/useEnsureCorrectChain.ts` | ✅ Documented | Ensures correct chain is selected |
| `useGetReceiptFromHash` | `utils/useGetReceiptFromHash.tsx` | ✅ Documented | Gets transaction receipt from hash |
| `useRoyalty` | `utils/useRoyalty.tsx` | ✅ Documented | Fetches royalty information |
| `useSwitchChainWithModal` | `utils/useSwitchChainWithModal.ts` | ✅ Documented | Switches chain with modal |

## Hooks Missing JSDoc Documentation

The following 24 hooks need JSDoc documentation added:

### Priority 1 - Core Configuration (3 hooks)
- `useConfig`
- `useConnectorMetadata`
- `useMarketplaceConfig`

### Priority 2 - Transaction Hooks (9 hooks)
- `useCancelOrder`
- `useCancelTransactionSteps`
- `useGenerateCancelTransaction`
- `useGenerateListingTransaction`
- `useGenerateOfferTransaction`
- `useGenerateSellTransaction`
- `useOrderSteps`
- `useProcessStep`
- `useTransferTokens`

### Priority 3 - Data Hooks (7 hooks)
- `useCollectionDetailsPolling`
- `useInventory`
- `useListMarketCardData`
- `useListOffersForCollectible`
- `useCountOfPrimarySaleItems`
- `useList1155ShopCardData`
- `useList721ShopCardData`

### Priority 4 - UI & Utility Hooks (5 hooks)
- `useFilterState`
- `useOpenConnectModal`
- `useEnsureCorrectChain`
- `useSwitchChainWithModal`
- `useSalesContractABI`

## JSDoc Template

When adding JSDoc documentation, follow this template:

```typescript
/**
 * Brief one-line description of what the hook does
 *
 * More detailed explanation of the hook's functionality,
 * including what it returns and when to use it.
 *
 * @param params - Configuration parameters (if applicable)
 * @param params.paramName - Description of parameter
 * 
 * @returns Description of what the hook returns
 * @throws {ErrorType} Description of when errors are thrown (if applicable)
 *
 * @example
 * Basic usage:
 * ```typescript
 * const result = useHookName({
 *   param1: 'value1',
 *   param2: 'value2'
 * });
 * ```
 *
 * @example
 * Advanced usage with options:
 * ```typescript
 * const result = useHookName({
 *   param1: 'value1',
 *   param2: 'value2',
 *   options: {
 *     enabled: condition,
 *     refetchInterval: 5000
 *   }
 * });
 * ```
 */
```

## Documentation Complete! 🎉

All 60 hooks in the Marketplace SDK now have comprehensive TSDoc documentation following best practices from https://tsdoc.org/.

### What Was Accomplished
1. ✅ Added TSDoc to all 24 previously undocumented hooks
2. ✅ Ensured consistency in documentation style across all hooks
3. ✅ Included multiple examples for each hook showing different use cases
4. ✅ Added proper `@throws`, `@remarks`, and `@see` tags where applicable
5. ✅ Validated all documentation against actual code behavior

### Documentation Standards Applied
- **Brief description**: One-line summary of hook purpose
- **Detailed explanation**: When and why to use the hook
- **Parameter documentation**: All params with clear descriptions
- **Return documentation**: Detailed return types with nested properties
- **Multiple examples**: Basic usage, advanced patterns, edge cases
- **Cross-references**: Links to related hooks and types
- **Error documentation**: Thrown errors and error conditions
- **Deprecation notices**: Clear migration paths for deprecated hooks

## Documentation Progress & Learnings

### Completed Hooks (24/24) 🎉
1. ✅ `useConfig` - Core SDK configuration access
2. ✅ `useConnectorMetadata` - Wallet type detection
3. ✅ `useMarketplaceConfig` - Marketplace settings retrieval
4. ✅ `useSalesContractABI` - Sales contract version detection
5. ✅ `useCancelOrder` - High-level order cancellation
6. ✅ `useCancelTransactionSteps` - Low-level cancel transaction management
7. ✅ `useGenerateCancelTransaction` - Cancel transaction generation
8. ✅ `useGenerateListingTransaction` - Listing creation transaction generation
9. ✅ `useGenerateOfferTransaction` - Offer creation transaction generation
10. ✅ `useGenerateSellTransaction` - Sale execution transaction generation
11. ✅ `useOrderSteps` - Unified step execution with chain switching
12. ✅ `useProcessStep` - Smart step processing with type detection
13. ✅ `useTransferTokens` - Direct NFT transfers between addresses
14. ✅ `useCollectionDetailsPolling` - Polls collection status until terminal state
15. ✅ `useInventory` - Fetches user's complete NFT inventory
16. ✅ `useListMarketCardData` - Prepares marketplace card display data
17. ✅ `useListOffersForCollectible` - Lists all offers on a collectible
18. ✅ `useCountOfPrimarySaleItems` - Counts primary sale items (deprecated)
19. ✅ `useList1155ShopCardData` - Prepares ERC1155 shop cards
20. ✅ `useList721ShopCardData` - Prepares ERC721 shop cards with minted status
21. ✅ `useFilterState` - URL-synchronized filter state management
22. ✅ `useOpenConnectModal` - Wallet connection modal trigger
23. ✅ `useEnsureCorrectChain` - Smart chain switching with UX
24. ✅ `useSwitchChainWithModal` - Low-level chain switch with modal

### Key Learnings

#### 1. Code Verification is Critical
- **Learning**: Before documenting, always verify what the code actually does
- **Example**: For `useMarketplaceConfig`, I examined the query options, return types, and data structure to ensure accurate documentation
- **Action**: Read source code, check return types, and trace data flow before writing docs

#### 2. React Query Hooks Pattern
- **Learning**: Hooks using `useQuery` return standard React Query result objects
- **Pattern**: Document both the query state (isLoading, error) and the data structure
- **Best Practice**: Show examples handling loading states and errors

#### 3. Nested Return Documentation
- **Learning**: For complex return objects, document nested properties clearly
- **Format**: Use `@returns returns.data.property` for nested structures
- **Example**: `@returns returns.data.market.enabled - Whether market is enabled`

#### 4. Context Dependencies
- **Learning**: Many hooks depend on provider context and will throw if used incorrectly
- **Documentation**: Always note provider requirements in `@remarks`
- **Pattern**: Check for `useContext` calls and error throws

#### 5. Query Configuration Details
- **Learning**: Some queries have specific caching strategies (infinite cache, no refetch)
- **Important**: Document these behaviors as they affect how developers use the hook
- **Example**: `useMarketplaceConfig` caches indefinitely - important for understanding data freshness

#### 6. Discriminated Union Return Types
- **Learning**: Some hooks use TypeScript discriminated unions for type-safe returns
- **Pattern**: `useSalesContractABI` returns different shapes based on loading/success/error states
- **Documentation**: Explain each possible return shape clearly
- **Best Practice**: Show how to handle each case in examples

#### 7. Version Detection Patterns
- **Learning**: Hooks may implement fallback logic (try V1, fallback to V0)
- **Important**: Document the detection strategy so developers understand the behavior
- **Example**: `useSalesContractABI` attempts V1 first, only tries V0 if V1 fails

#### 8. Transaction Hook Hierarchy
- **Learning**: Transaction hooks often have high-level and low-level variants
- **Pattern**: High-level hooks (like `useCancelOrder`) use low-level hooks internally
- **Documentation**: Clearly distinguish between user-facing and internal hooks
- **Example**: `useCancelOrder` → `useCancelTransactionSteps` → `useGenerateCancelTransaction`

#### 9. Mutation Hooks Pattern
- **Learning**: Hooks using `useMutation` return both sync and async variants
- **Pattern**: `mutate` (void) and `mutateAsync` (returns promise)
- **Documentation**: Show examples of both patterns and when to use each
- **Best Practice**: Name consistently: `generateX` and `generateXAsync`

#### 10. State Management in Transaction Hooks
- **Learning**: Transaction hooks often manage complex state (steps, execution status)
- **Important**: Document what state is tracked and how it changes
- **Pattern**: Using `setSteps` callbacks to communicate state between hooks
- **Example**: `useCancelTransactionSteps` uses setSteps to update execution status

#### 11. Date Handling in Transaction Hooks
- **Learning**: Transaction hooks convert JavaScript Dates to Unix timestamps
- **Pattern**: Accept Date objects in params, convert with `dateToUnixTime`
- **Documentation**: Always mention date format expectations in examples
- **Example**: Listing and offer expiry dates

#### 12. Dual-Purpose Transaction Hooks
- **Learning**: Some hooks serve multiple transaction types
- **Example**: `useGenerateSellTransaction` handles both buying and accepting offers
- **Documentation**: Clearly explain all use cases with separate examples
- **Best Practice**: Name parameters generically (e.g., `orderId` not `listingId`)

#### 13. Wallet Type Detection Integration
- **Learning**: Some hooks automatically detect and include wallet metadata
- **Example**: `useGenerateOfferTransaction` includes wallet type via `useConnectorMetadata`
- **Documentation**: Note when wallet type affects transaction generation
- **Pattern**: Hooks handling wallet-specific logic internally for better DX

#### 14. Step Execution Hierarchy
- **Learning**: Step execution has multiple abstraction levels
- **Hierarchy**: `useProcessStep` (smart) → `useOrderSteps` (manual) → wagmi hooks
- **Documentation**: Explain when to use each level of abstraction
- **Pattern**: Higher-level hooks handle more complexity automatically

#### 15. Discriminated Union Returns
- **Learning**: Step processors return discriminated unions for type safety
- **Example**: `ProcessStepResult` has `type: 'transaction' | 'signature'`
- **Documentation**: Show type narrowing in examples
- **Best Practice**: Use switch statements or type guards in examples

#### 16. Contract Type Polymorphism
- **Learning**: Some hooks handle multiple NFT standards with same interface
- **Example**: `useTransferTokens` supports both ERC721 and ERC1155
- **Documentation**: Show examples for each supported standard
- **Pattern**: Use discriminated unions for parameters too

#### 17. State Exposure Pattern
- **Learning**: Transaction hooks expose multiple state flags
- **Pattern**: `isPending`, `isError`, `isSuccess` alongside the main function
- **Documentation**: Document all exposed state properties
- **Example**: `useTransferTokens` exposes transferring, transferFailed, transferSuccess

#### 18. Polling Patterns with Exponential Backoff
- **Learning**: Some hooks implement sophisticated polling strategies
- **Example**: `useCollectionDetailsPolling` uses exponential backoff (1.5x multiplier)
- **Documentation**: Document polling intervals, max attempts, terminal conditions
- **Best Practice**: Explain when polling stops to prevent confusion

#### 19. Data Aggregation Hooks
- **Learning**: Some hooks combine multiple data sources for complete views
- **Example**: `useInventory` merges marketplace API with indexer data
- **Documentation**: Explain the data sources and merge strategy
- **Pattern**: Cache management and state tracking across calls

#### 20. Card Data Preparation Hooks
- **Learning**: Several hooks transform raw data into UI-ready props
- **Pattern**: Name as `useList*CardData` for consistency
- **Documentation**: Show the prop spreading pattern in examples
- **Example**: `const cards = useListMarketCardData(); <Card {...cards[0]} />`

#### 21. Deprecated Hook Documentation
- **Learning**: Deprecated hooks should still be fully documented
- **Pattern**: Start with `@deprecated` tag mentioning replacement
- **Documentation**: Include migration path in remarks
- **Example**: `useCountOfPrimarySaleItems` → `useGetCountOfPrimarySaleItems`

#### 22. Complex State Management in Hooks
- **Learning**: Some hooks maintain complex internal state across renders
- **Example**: `useList721ShopCardData` tracks all token supplies fetching
- **Documentation**: Explain any loading states that aggregate multiple queries
- **Pattern**: Use effects to orchestrate multiple data fetches

#### 23. URL State Synchronization
- **Learning**: Some hooks sync state with URL for shareable links
- **Example**: `useFilterState` uses nuqs for query param management
- **Documentation**: Show URL format and serialization examples
- **Pattern**: Shortened URL keys (f=filters, q=query, l=listedOnly)

#### 24. Context Extraction Hooks
- **Learning**: Simple hooks that extract specific functions from context
- **Example**: `useOpenConnectModal` extracts just the modal opener
- **Documentation**: Explain why this pattern improves API design
- **Pattern**: Provide focused interfaces instead of exposing entire context

#### 25. Chain Switching UX Patterns
- **Learning**: Different UX for different wallet types (WaaS vs standard)
- **Example**: `useEnsureCorrectChain` switches directly for WaaS, shows modal for others
- **Documentation**: Explain the UX differences and why they exist
- **Pattern**: Abstract wallet-specific logic in utility hooks

#### 26. Promise vs Callback APIs
- **Learning**: Some hooks provide both patterns for flexibility
- **Example**: `ensureCorrectChain` (callbacks) vs `ensureCorrectChainAsync` (promise)
- **Documentation**: Show when to use each pattern
- **Best Practice**: Async for sequential flows, callbacks for UI events