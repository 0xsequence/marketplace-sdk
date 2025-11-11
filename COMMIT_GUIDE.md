# Commit Message Guide

## Format
Write one-line commit messages in lowercase, imperative mood.

## Template
```
<action> <what was changed>
```

## Common Actions
- `add` - new feature or file
- `remove` - delete feature or file
- `update` - enhance existing feature
- `fix` - bug fix
- `refactor` - code restructure
- `rename` - rename files/functions
- `clean up` - remove unused code
- `simplify` - make code simpler
- `replace` - substitute one thing for another
- `merge` - merge branches

## Examples from this repo
- `simplify dnum usage`
- `add dnum helpers`
- `remove old hook`
- `fix ts error`
- `update sellmodal exports to expose context`
- `replace observable-based modal with context provider`
- `clean up ctas`

## Tips
- Start with lowercase verb
- Be specific but concise
- No period at the end
- Focus on what changed, not why (details go in PR/description)
- Aim for 50 characters or less

## Strategy for Multiple Files
1. Group related changes into logical commits
2. Each commit should represent one complete change
3. Don't mix unrelated changes in one commit
4. Example groupings:
   - All test file updates: `update tests for new api types`
   - API migration: `migrate to new api wrapper`
   - Component updates: `update ui components for bigint support`
   - Cleanup: `remove deprecated api type files`

## How to Commit This Repo

Based on the current changes, here's the recommended commit order with detailed, granular commits:

### Phase 1: Add New Infrastructure

#### 1. Add new API package
```bash
git add api/
git commit -m "add new api package with generated types"
```

#### 2. Add API mocks
```bash
git add sdk/src/react/_internal/api-mocks.ts
git commit -m "add centralized api mocks"
```

#### 3. Add query key constants
```bash
git add sdk/src/react/queries/collectible/queryKeys.ts
git add sdk/src/react/queries/collection/queryKeys.ts
git add sdk/src/react/queries/marketplace/queryKeys.ts
git add sdk/src/react/queries/token/queryKeys.ts
git commit -m "add query key constants for better cache management"
```

#### 4. Add type definitions
```bash
git add sdk/src/images.d.ts
git commit -m "add images type definitions"
```

### Phase 2: Remove Deprecated Files

#### 5. Remove old API mocks
```bash
git add sdk/src/react/_internal/api/__mocks__/
git commit -m "remove deprecated api mocks"
```

#### 6. Remove old generated API types
```bash
git add sdk/src/react/_internal/api/builder.gen.ts
git add sdk/src/react/_internal/api/marketplace.gen.ts
git commit -m "remove old generated api types"
```

#### 7. Remove deprecated type files
```bash
git add sdk/src/types/api-types.ts
git add sdk/src/types/new-marketplace-types.ts
git add sdk/src/types/custom.d.ts
git commit -m "remove deprecated type definitions"
```

#### 8. Remove dnum utilities
```bash
git add sdk/src/utils/__tests__/dnum-utils.test.ts
git add sdk/src/utils/dnum-utils.ts
git commit -m "remove deprecated dnum utilities"
```

#### 9. Remove activities table component
```bash
git add playgrounds/shared/src/components/activitiesTable/
git commit -m "remove deprecated activities table component"
```

### Phase 3: Update Core API Integration

#### 10. Update API client wrappers
```bash
git add sdk/src/react/_internal/api/builder-api.ts
git add sdk/src/react/_internal/api/marketplace-api.ts
git commit -m "update api client wrappers for new package"
```

#### 11. Update API services
```bash
git add sdk/src/react/_internal/api/services.ts
git add sdk/src/react/_internal/api/index.ts
git commit -m "update api services integration"
```

#### 12. Update internal types
```bash
git add sdk/src/react/_internal/types.ts
git add sdk/src/react/_internal/databeat/types.ts
git commit -m "update internal types for new api"
```

#### 13. Update internal utilities
```bash
git add sdk/src/react/_internal/utils.ts
git add sdk/src/react/_internal/index.ts
git commit -m "update internal utilities"
```

### Phase 4: Update Wagmi Integration

#### 14. Update wagmi config creation
```bash
git add sdk/src/react/_internal/wagmi/create-config.ts
git add sdk/src/react/_internal/wagmi/__tests__/create-config.test.ts
git commit -m "update wagmi config for new api types"
```

#### 15. Update wagmi connectors
```bash
git add sdk/src/react/_internal/wagmi/get-connectors.ts
git commit -m "update wagmi connector configuration"
```

### Phase 5: Update Query Layer

#### 16. Update collectible queries
```bash
git add sdk/src/react/queries/collectible/balance.ts
git add sdk/src/react/queries/collectible/market-activities.ts
git add sdk/src/react/queries/collectible/market-count.ts
git add sdk/src/react/queries/collectible/market-highest-offer.ts
git add sdk/src/react/queries/collectible/market-list-paginated.ts
git add sdk/src/react/queries/collectible/market-list.ts
git commit -m "update collectible market queries"
```

#### 17. Update collectible listing queries
```bash
git add sdk/src/react/queries/collectible/market-listings-count.ts
git add sdk/src/react/queries/collectible/market-listings.ts
git add sdk/src/react/queries/collectible/market-lowest-listing.ts
git commit -m "update collectible listing queries"
```

#### 18. Update collectible offer queries
```bash
git add sdk/src/react/queries/collectible/market-offers-count.ts
git add sdk/src/react/queries/collectible/market-offers.ts
git commit -m "update collectible offer queries"
```

#### 19. Update collectible metadata queries
```bash
git add sdk/src/react/queries/collectible/metadata.ts
git add sdk/src/react/queries/collectible/token-balances.ts
git commit -m "update collectible metadata queries"
```

#### 20. Update collectible primary sale queries
```bash
git add sdk/src/react/queries/collectible/primary-sale-items-count.ts
git add sdk/src/react/queries/collectible/primary-sale-items.ts
git commit -m "update collectible primary sale queries"
```

#### 21. Update collection queries
```bash
git add sdk/src/react/queries/collection/balance-details.ts
git add sdk/src/react/queries/collection/list.ts
git add sdk/src/react/queries/collection/market-activities.ts
git add sdk/src/react/queries/collection/market-detail.ts
git commit -m "update collection queries"
```

#### 22. Update collection market queries
```bash
git add sdk/src/react/queries/collection/market-filtered-count.ts
git add sdk/src/react/queries/collection/market-floor.ts
git add sdk/src/react/queries/collection/market-items-count.ts
git add sdk/src/react/queries/collection/market-items-paginated.ts
git add sdk/src/react/queries/collection/market-items.ts
git commit -m "update collection market queries"
```

#### 23. Update collection metadata queries
```bash
git add sdk/src/react/queries/collection/metadata.ts
git commit -m "update collection metadata queries"
```

#### 24. Update currency queries
```bash
git add sdk/src/react/queries/currency/convert-to-usd.ts
git add sdk/src/react/queries/currency/currency.ts
git add sdk/src/react/queries/currency/list.ts
git commit -m "update currency queries"
```

#### 25. Update marketplace queries
```bash
git add sdk/src/react/queries/marketplace/config.ts
git add sdk/src/react/queries/marketplace/filters.ts
git commit -m "update marketplace queries"
```

#### 26. Update inventory queries
```bash
git add sdk/src/react/queries/inventory/inventory.ts
git commit -m "update inventory queries"
```

#### 27. Update token queries
```bash
git add sdk/src/react/queries/token/balances.ts
git add sdk/src/react/queries/token/metadata-search.ts
git add sdk/src/react/queries/token/metadata.ts
git add sdk/src/react/queries/token/ranges.ts
git add sdk/src/react/queries/token/supplies.ts
git commit -m "update token queries"
```

#### 28. Update checkout queries
```bash
git add sdk/src/react/queries/checkout/market-checkout-options.ts
git add sdk/src/react/queries/checkout/primary-sale-checkout-options.ts
git commit -m "update checkout queries"
```

### Phase 6: Update Hook Layer

#### 29. Update collectible hooks
```bash
git add sdk/src/react/hooks/collectible/balance.test.tsx
git add sdk/src/react/hooks/collectible/market-activities.test.tsx
git add sdk/src/react/hooks/collectible/market-count.test.tsx
git add sdk/src/react/hooks/collectible/market-highest-offer.test.tsx
git commit -m "update collectible hooks and tests"
```

#### 30. Update collectible list hooks
```bash
git add sdk/src/react/hooks/collectible/market-list-paginated.test.tsx
git add sdk/src/react/hooks/collectible/market-list.test.tsx
git add sdk/src/react/hooks/collectible/market-listings-count.test.tsx
git add sdk/src/react/hooks/collectible/market-listings.test.tsx
git commit -m "update collectible list hooks and tests"
```

#### 31. Update collectible offer hooks
```bash
git add sdk/src/react/hooks/collectible/market-lowest-listing.test.tsx
git add sdk/src/react/hooks/collectible/market-offers-count.test.tsx
git add sdk/src/react/hooks/collectible/market-offers.test.tsx
git commit -m "update collectible offer hooks and tests"
```

#### 32. Update collectible metadata hooks
```bash
git add sdk/src/react/hooks/collectible/metadata.test.tsx
git add sdk/src/react/hooks/collectible/token-balances.test.tsx
git commit -m "update collectible metadata hooks and tests"
```

#### 33. Update collection hooks
```bash
git add sdk/src/react/hooks/collection/balance-details.test.tsx
git add sdk/src/react/hooks/collection/list.test.tsx
git add sdk/src/react/hooks/collection/market-activities.test.tsx
git add sdk/src/react/hooks/collection/market-floor.test.tsx
git commit -m "update collection hooks and tests"
```

#### 34. Update collection metadata hooks
```bash
git add sdk/src/react/hooks/collection/metadata-polling.test.tsx
git add sdk/src/react/hooks/collection/metadata.test.tsx
git commit -m "update collection metadata hooks and tests"
```

#### 35. Update currency hooks
```bash
git add sdk/src/react/hooks/currency/compare-prices.test.tsx
git add sdk/src/react/hooks/currency/convert-to-usd.test.tsx
git add sdk/src/react/hooks/currency/currency.test.tsx
git add sdk/src/react/hooks/currency/list.test.tsx
git commit -m "update currency hooks and tests"
```

#### 36. Update config hooks
```bash
git add sdk/src/react/hooks/config/useConnectorMetadata.tsx
git add sdk/src/react/hooks/config/useMarketplaceConfig.test.tsx
git commit -m "update config hooks and tests"
```

#### 37. Update inventory and token hooks
```bash
git add sdk/src/react/hooks/inventory/inventory.test.tsx
git add sdk/src/react/hooks/token/balances.test.tsx
git add sdk/src/react/hooks/token/metadata-search.test.tsx
git add sdk/src/react/hooks/token/metadata-search.tsx
git add sdk/src/react/hooks/token/metadata.test.tsx
git commit -m "update inventory and token hooks"
```

#### 38. Update token range hooks
```bash
git add sdk/src/react/hooks/token/ranges.test.tsx
git add sdk/src/react/hooks/token/ranges.tsx
git commit -m "update token range hooks"
```

#### 39. Update checkout hooks
```bash
git add sdk/src/react/hooks/checkout/market-checkout-options.test.tsx
git add sdk/src/react/hooks/checkout/primary-sale-checkout-options.test.tsx
git commit -m "update checkout hooks and tests"
```

### Phase 7: Update Transaction Hooks

#### 40. Update cancel transaction hooks
```bash
git add sdk/src/react/hooks/transactions/useCancelOrder.test.tsx
git add sdk/src/react/hooks/transactions/useGenerateCancelTransaction.test.tsx
git add sdk/src/react/hooks/transactions/useGenerateCancelTransaction.tsx
git commit -m "update cancel transaction hooks"
```

#### 41. Update listing transaction hooks
```bash
git add sdk/src/react/hooks/transactions/useGenerateListingTransaction.test.tsx
git add sdk/src/react/hooks/transactions/useGenerateListingTransaction.tsx
git commit -m "update listing transaction hooks"
```

#### 42. Update offer transaction hooks
```bash
git add sdk/src/react/hooks/transactions/useGenerateOfferTransaction.test.tsx
git add sdk/src/react/hooks/transactions/useGenerateOfferTransaction.tsx
git commit -m "update offer transaction hooks"
```

#### 43. Update sell transaction hooks
```bash
git add sdk/src/react/hooks/transactions/useGenerateSellTransaction.test.tsx
git add sdk/src/react/hooks/transactions/useGenerateSellTransaction.tsx
git commit -m "update sell transaction hooks"
```

#### 44. Update transfer hooks
```bash
git add sdk/src/react/hooks/transactions/useTransferTokens.test.tsx
git add sdk/src/react/hooks/transactions/useTransferTokens.tsx
git commit -m "update transfer token hooks"
```

#### 45. Update transaction processing hooks
```bash
git add sdk/src/react/hooks/transactions/useOrderSteps.tsx
git add sdk/src/react/hooks/transactions/useProcessStep.test.tsx
git add sdk/src/react/hooks/transactions/useProcessStep.ts
git commit -m "update transaction processing hooks"
```

### Phase 8: Update UI Hooks

#### 46. Update filter hooks
```bash
git add sdk/src/react/hooks/ui/useFilters.test.tsx
git add sdk/src/react/hooks/ui/useFilters.tsx
git add sdk/src/react/hooks/ui/url-state/filter-state.tsx
git commit -m "update filter hooks"
```

#### 47. Update card data hooks
```bash
git add sdk/src/react/hooks/ui/card-data/market-card-data.test.tsx
git add sdk/src/react/hooks/ui/card-data/market-card-data.tsx
git add sdk/src/react/hooks/ui/card-data/primary-sale-1155-card-data.tsx
git add sdk/src/react/hooks/ui/card-data/primary-sale-721-card-data.tsx
git commit -m "update card data hooks"
```

#### 48. Update utility hooks
```bash
git add sdk/src/react/hooks/utils/useAutoSelectFeeOption.test.tsx
git add sdk/src/react/hooks/utils/useRoyalty.tsx
git commit -m "update utility hooks"
```

### Phase 9: Update UI Components

#### 49. Update action button component
```bash
git add sdk/src/react/ui/components/_internals/action-button/ActionButton.stories.tsx
git add sdk/src/react/ui/components/_internals/action-button/ActionButton.tsx
git add sdk/src/react/ui/components/_internals/action-button/store.ts
git commit -m "update action button component"
```

#### 50. Update action button logic
```bash
git add sdk/src/react/ui/components/_internals/action-button/hooks/useActionButtonLogic.ts
git add sdk/src/react/ui/components/_internals/action-button/__tests__/useActionButtonLogic.test.tsx
git commit -m "update action button logic"
```

#### 51. Update action button subcomponents
```bash
git add sdk/src/react/ui/components/_internals/action-button/components/ActionButtonBody.tsx
git add sdk/src/react/ui/components/_internals/action-button/components/NonOwnerActions.tsx
git add sdk/src/react/ui/components/_internals/action-button/components/OwnerActions.tsx
git commit -m "update action button subcomponents"
```

#### 52. Update action button tests
```bash
git add sdk/src/react/ui/components/_internals/action-button/__tests__/ActionButtonBody.test.tsx
git add sdk/src/react/ui/components/_internals/action-button/__tests__/NonOwnerActions.test.tsx
git add sdk/src/react/ui/components/_internals/action-button/__tests__/OwnerActions.test.tsx
git commit -m "update action button tests"
```

#### 53. Update collectible card component
```bash
git add sdk/src/react/ui/components/marketplace-collectible-card/components/ActionButtonWrapper.tsx
git add sdk/src/react/ui/components/marketplace-collectible-card/types.ts
git commit -m "update collectible card component"
```

#### 54. Update collectible card footer
```bash
git add sdk/src/react/ui/components/marketplace-collectible-card/components/footer/Footer.tsx
git add sdk/src/react/ui/components/marketplace-collectible-card/components/footer/components/FooterName.tsx
git add sdk/src/react/ui/components/marketplace-collectible-card/components/footer/components/PriceDisplay.tsx
git add sdk/src/react/ui/components/marketplace-collectible-card/components/footer/components/SaleDetailsPill.tsx
git commit -m "update collectible card footer components"
```

#### 55. Update collectible card variants
```bash
git add sdk/src/react/ui/components/marketplace-collectible-card/variants/MarketCard.tsx
git add sdk/src/react/ui/components/marketplace-collectible-card/variants/ShopCard.tsx
git commit -m "update collectible card variants"
```

#### 56. Update collectible card utilities
```bash
git add sdk/src/react/ui/components/marketplace-collectible-card/utils/formatPrice.ts
git add sdk/src/react/ui/components/marketplace-collectible-card/utils/supplyStatus.ts
git commit -m "update collectible card utilities"
```

### Phase 10: Update Modals

#### 57. Update buy modal core
```bash
git add sdk/src/react/ui/modals/BuyModal/store.ts
git add sdk/src/react/ui/modals/BuyModal/components/types.ts
git commit -m "update buy modal store and types"
```

#### 58. Update buy modal components
```bash
git add sdk/src/react/ui/modals/BuyModal/components/ERC1155BuyModal.tsx
git add sdk/src/react/ui/modals/BuyModal/components/ERC1155QuantityModal.tsx
git add sdk/src/react/ui/modals/BuyModal/components/ERC1155ShopModal.tsx
git commit -m "update buy modal erc1155 components"
```

#### 59. Update buy modal erc721 components
```bash
git add sdk/src/react/ui/modals/BuyModal/components/ERC721BuyModal.tsx
git add sdk/src/react/ui/modals/BuyModal/components/ERC721ShopModal.tsx
git commit -m "update buy modal erc721 components"
```

#### 60. Update buy modal hooks
```bash
git add sdk/src/react/ui/modals/BuyModal/hooks/useCheckoutOptions.ts
git add sdk/src/react/ui/modals/BuyModal/hooks/useERC1155Checkout.ts
git add sdk/src/react/ui/modals/BuyModal/hooks/useERC721SalePaymentParams.ts
git commit -m "update buy modal checkout hooks"
```

#### 61. Update buy modal utility hooks
```bash
git add sdk/src/react/ui/modals/BuyModal/hooks/useLoadData.ts
git add sdk/src/react/ui/modals/BuyModal/hooks/useMarketPlatformFee.ts
git add sdk/src/react/ui/modals/BuyModal/hooks/usePaymentModalParams.ts
git commit -m "update buy modal utility hooks"
```

#### 62. Update buy modal tests
```bash
git add sdk/src/react/ui/modals/BuyModal/__tests__/BuyModalRouter.test.tsx
git add sdk/src/react/ui/modals/BuyModal/__tests__/ERC1155ShopModal.test.tsx
git add sdk/src/react/ui/modals/BuyModal/__tests__/ERC721ShopModal.test.tsx
git add sdk/src/react/ui/modals/BuyModal/__tests__/Modal1155.test.tsx
git add sdk/src/react/ui/modals/BuyModal/__tests__/store.test.ts
git commit -m "update buy modal tests"
```

#### 63. Update buy modal hook tests
```bash
git add sdk/src/react/ui/modals/BuyModal/hooks/__tests__/useCheckoutOptions.test.tsx
git add sdk/src/react/ui/modals/BuyModal/hooks/__tests__/useERC1155Checkout.test.tsx
git commit -m "update buy modal hook tests"
```

#### 64. Update listing modal
```bash
git add sdk/src/react/ui/modals/CreateListingModal/Modal.tsx
git add sdk/src/react/ui/modals/CreateListingModal/store.ts
git commit -m "update listing modal"
```

#### 65. Update listing modal hooks
```bash
git add sdk/src/react/ui/modals/CreateListingModal/hooks/useCreateListing.tsx
git add sdk/src/react/ui/modals/CreateListingModal/hooks/useGetTokenApproval.ts
git add sdk/src/react/ui/modals/CreateListingModal/hooks/useTransactionSteps.tsx
git commit -m "update listing modal hooks"
```

#### 66. Update listing modal tests
```bash
git add sdk/src/react/ui/modals/CreateListingModal/__tests__/Modal.test.tsx
git commit -m "update listing modal tests"
```

#### 67. Update offer modal
```bash
git add sdk/src/react/ui/modals/MakeOfferModal/Modal.tsx
git add sdk/src/react/ui/modals/MakeOfferModal/store.ts
git commit -m "update offer modal"
```

#### 68. Update offer modal hooks
```bash
git add sdk/src/react/ui/modals/MakeOfferModal/hooks/useGetTokenApproval.tsx
git add sdk/src/react/ui/modals/MakeOfferModal/hooks/useTransactionSteps.tsx
git commit -m "update offer modal hooks"
```

#### 69. Update offer modal tests
```bash
git add sdk/src/react/ui/modals/MakeOfferModal/__tests__/Modal.test.tsx
git commit -m "update offer modal tests"
```

#### 70. Update sell modal
```bash
git add sdk/src/react/ui/modals/SellModal/internal/context.ts
git add sdk/src/react/ui/modals/SellModal/internal/store.ts
git add sdk/src/react/ui/modals/SellModal/internal/sell-mutations.ts
git add sdk/src/react/ui/modals/SellModal/internal/use-generate-sell-transaction.ts
git commit -m "update sell modal internals"
```

#### 71. Update transfer modal
```bash
git add sdk/src/react/ui/modals/TransferModal/index.tsx
git add sdk/src/react/ui/modals/TransferModal/store.ts
git commit -m "update transfer modal"
```

#### 72. Update transfer modal tests
```bash
git add sdk/src/react/ui/modals/TransferModal/__tests__/store.test.ts
git add sdk/src/react/ui/modals/TransferModal/_views/enterWalletAddress/__tests__/useHandleTransfer.test.tsx
git commit -m "update transfer modal tests"
```

#### 73. Update success modal
```bash
git add sdk/src/react/ui/modals/SuccessfulPurchaseModal/index.tsx
git add sdk/src/react/ui/modals/SuccessfulPurchaseModal/store.ts
git add sdk/src/react/ui/modals/SuccessfulPurchaseModal/__tests__/Modal.test.tsx
git commit -m "update success modal"
```

### Phase 11: Update Modal Shared Components

#### 74. Update modal base components
```bash
git add sdk/src/react/ui/modals/_internal/components/baseModal/errors/ModalInitializationError.tsx
git commit -m "update modal base components"
```

#### 75. Update modal currency select
```bash
git add sdk/src/react/ui/modals/_internal/components/currencyOptionsSelect/index.tsx
git add sdk/src/react/ui/modals/_internal/components/currencyOptionsSelect/__tests__/index.test.tsx
git commit -m "update modal currency select"
```

#### 76. Update modal floor price component
```bash
git add sdk/src/react/ui/modals/_internal/components/floorPriceText/index.tsx
git add sdk/src/react/ui/modals/_internal/components/floorPriceText/__tests__/FloorPriceText.test.tsx
git commit -m "update modal floor price component"
```

#### 77. Update modal price input
```bash
git add sdk/src/react/ui/modals/_internal/components/priceInput/index.tsx
git add sdk/src/react/ui/modals/_internal/components/priceInput/__tests__/PriceInput.test.tsx
git commit -m "update modal price input"
```

#### 78. Update modal preview components
```bash
git add sdk/src/react/ui/modals/_internal/components/tokenPreview/index.tsx
git add sdk/src/react/ui/modals/_internal/components/transactionDetails/index.tsx
git add sdk/src/react/ui/modals/_internal/components/transactionPreview/index.tsx
git commit -m "update modal preview components"
```

#### 79. Update transaction status modal
```bash
git add sdk/src/react/ui/modals/_internal/components/transactionStatusModal/index.tsx
git add sdk/src/react/ui/modals/_internal/components/transactionStatusModal/store.ts
git commit -m "update transaction status modal"
```

#### 80. Update transaction status hooks
```bash
git add sdk/src/react/ui/modals/_internal/components/transactionStatusModal/hooks/useTransactionStatus.ts
git commit -m "update transaction status hooks"
```

#### 81. Update transaction status tests
```bash
git add sdk/src/react/ui/modals/_internal/components/transactionStatusModal/__tests__/TransactionStatusModal.test.tsx
git add sdk/src/react/ui/modals/_internal/components/transactionStatusModal/__tests__/utils.test.ts
git commit -m "update transaction status tests"
```

### Phase 12: Update Shared SDK Files

#### 82. Update shared types
```bash
git add sdk/src/types/index.ts
git add sdk/src/types/sdk-config.ts
git add sdk/src/types/types.ts
git commit -m "update shared type definitions"
```

#### 83. Update error utilities
```bash
git add sdk/src/utils/getErrorMessage.ts
git add sdk/src/utils/getWebRPCErrorMessage.ts
git commit -m "update error utilities"
```

#### 84. Update price utilities
```bash
git add sdk/src/utils/price.ts
git commit -m "update price utilities"
```

#### 85. Update utility exports
```bash
git add sdk/src/utils/index.ts
git commit -m "update utility exports"
```

#### 86. Update react utilities
```bash
git add sdk/src/react/utils/waitForTransactionReceipt.ts
git commit -m "update react utilities"
```

#### 87. Update styles
```bash
git add sdk/src/styles/index.css
git add sdk/src/styles/styles.ts
git commit -m "update styles"
```

### Phase 13: Update Test Infrastructure

#### 88. Update test constants
```bash
git add sdk/test/const.ts
git commit -m "update test constants"
```

#### 89. Update test handlers
```bash
git add sdk/test/handlers.ts
git commit -m "update test handlers"
```

#### 90. Update test server setup
```bash
git add sdk/test/server-setup.ts
git commit -m "update test server setup"
```

### Phase 14: Update Shared Playground Components

#### 91. Update shared filters
```bash
git add playgrounds/shared/src/components/filters/PriceFilter.tsx
git add playgrounds/shared/src/components/filters/PropertyFilters.tsx
git add playgrounds/shared/src/components/filters/badges/PriceBadge.tsx
git commit -m "update shared filter components"
```

#### 92. Update shared collectible components
```bash
git add playgrounds/shared/src/components/collectible/CollectibleDetails.tsx
git add playgrounds/shared/src/components/collectible/actions/Actions.tsx
git add playgrounds/shared/src/components/collectible/actions/MarketActions.tsx
git add playgrounds/shared/src/components/collectible/actions/ShopActions.tsx
git commit -m "update shared collectible components"
```

#### 93. Update shared orders table
```bash
git add playgrounds/shared/src/components/ordersTable/ListingsTable.tsx
git add playgrounds/shared/src/components/ordersTable/OffersTable.tsx
git add playgrounds/shared/src/components/ordersTable/OrdersTable.tsx
git commit -m "update shared orders table"
```

#### 94. Update orders table components
```bash
git add playgrounds/shared/src/components/ordersTable/_components/Action.tsx
git add playgrounds/shared/src/components/ordersTable/_components/Body.tsx
git add playgrounds/shared/src/components/ordersTable/_components/TableRow.tsx
git commit -m "update orders table components"
```

#### 95. Update shared page controllers
```bash
git add playgrounds/shared/src/components/pages/CollectiblePageController.tsx
git add playgrounds/shared/src/components/pages/CollectiblesPageController.tsx
git add playgrounds/shared/src/components/pages/InventoryPageController.tsx
git commit -m "update shared page controllers"
```

#### 96. Update shared page content
```bash
git add playgrounds/shared/src/components/pages/MarketContent.tsx
git add playgrounds/shared/src/components/pages/ShopContent.tsx
git commit -m "update shared page content"
```

#### 97. Update shared erc721 controls
```bash
git add playgrounds/shared/src/components/ERC721SaleControls.tsx
git commit -m "update shared erc721 controls"
```

#### 98. Update shared component exports
```bash
git add playgrounds/shared/src/components/index.ts
git commit -m "update shared component exports"
```

#### 99. Update shared routes and store
```bash
git add playgrounds/shared/src/routes/index.ts
git add playgrounds/shared/src/store/store.ts
git commit -m "update shared routes and store"
```

#### 100. Update shared utilities
```bash
git add playgrounds/shared/src/util.ts
git commit -m "update shared utilities"
```

### Phase 15: Update React-Vite Playground

#### 101. Update react-vite collectable components
```bash
git add playgrounds/react-vite/src/tabs/Collectable.tsx
git add playgrounds/react-vite/src/tabs/Collectables.tsx
git commit -m "update react-vite collectable components"
```

#### 102. Update react-vite content components
```bash
git add playgrounds/react-vite/src/tabs/components/MarketContent.tsx
git add playgrounds/react-vite/src/tabs/components/ShopContent.tsx
git commit -m "update react-vite content components"
```

### Phase 16: Update Alternative Wallets Playground

#### 103. Update alternative-wallets collectable components
```bash
git add playgrounds/alternative-wallets/src/tabs/Collectable.tsx
git add playgrounds/alternative-wallets/src/tabs/Collectables.tsx
git commit -m "update alternative-wallets collectable components"
```

#### 104. Update alternative-wallets content components
```bash
git add playgrounds/alternative-wallets/src/tabs/components/MarketContent.tsx
git add playgrounds/alternative-wallets/src/tabs/components/ShopContent.tsx
git commit -m "update alternative-wallets content components"
```

### Phase 17: Update Next.js Playground

#### 105. Update next collectible page
```bash
git add "playgrounds/next/src/app/[chainId]/[collectionAddress]/[collectibleId]/page.tsx"
git commit -m "update next collectible page"
```

#### 106. Update next collection page
```bash
git add "playgrounds/next/src/app/[chainId]/[collectionAddress]/page.tsx"
git commit -m "update next collection page"
```

### Phase 18: Update Without Tailwind Playground

#### 107. Update without-tailwind components
```bash
git add playgrounds/without-tailwind/src/components/MarketplaceListingsTable.tsx
git commit -m "update without-tailwind components"
```

### Phase 19: Update Package Configuration

#### 108. Update sdk package config
```bash
git add sdk/package.json
git commit -m "update sdk package dependencies"
```

#### 109. Update workspace config
```bash
git add pnpm-workspace.yaml
git commit -m "update workspace configuration"
```

#### 110. Update lockfile
```bash
git add pnpm-lock.yaml
git commit -m "update package lockfile"
```

### Phase 20: Add Documentation

#### 111. Add api improvements documentation
```bash
git add API_TYPE_IMPROVEMENTS.md
git commit -m "add api type improvements documentation"
```

#### 112. Add api analysis documentation
```bash
git add API_TYPES_ANALYSIS.md
git commit -m "add api types analysis documentation"
```

#### 113. Add api removal summary
```bash
git add API_TYPES_REMOVAL_SUMMARY.md
git commit -m "add api types removal summary"
```

### Quick Alternative: Commit by Type
If you prefer fewer commits, group by change type:

```bash
# New files
git add api/ sdk/src/react/_internal/api-mocks.ts sdk/src/react/queries/*/queryKeys.ts sdk/src/images.d.ts
git commit -m "add new api package and utilities"

# Deletions
git add sdk/src/react/_internal/api/__mocks__/ sdk/src/react/_internal/api/*.gen.ts sdk/src/types/api-types.ts sdk/src/types/new-marketplace-types.ts sdk/src/types/custom.d.ts sdk/src/utils/dnum-utils.ts sdk/src/utils/__tests__/dnum-utils.test.ts playgrounds/shared/src/components/activitiesTable/
git commit -m "remove deprecated files"

# SDK updates
git add sdk/
git commit -m "migrate sdk to new api package"

# Playground updates
git add playgrounds/
git commit -m "update playgrounds for new api"

# Config and docs
git add pnpm-lock.yaml pnpm-workspace.yaml API_*.md
git commit -m "update dependencies and add docs"
```
