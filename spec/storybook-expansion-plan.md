# Storybook Expansion Plan for @0xsequence/marketplace-sdk

## Overview
This document outlines a comprehensive plan to expand Storybook coverage for the marketplace SDK, focusing on components, hooks, and utilities that currently lack stories.

## Priority Levels
- 🔴 **Critical** - Core UI components and frequently used hooks
- 🟡 **High** - Supporting components and integration hooks
- 🟢 **Medium** - Utility components and edge cases
- 🔵 **Low** - Internal utilities and rarely used components

## 1. Missing Modal Stories 🔴

### MakeOfferModal
**Location**: `/react/ui/modals/MakeOfferModal/`
**Stories needed**:
- BasicOffer - Standard offer creation
- ERC721Offer - Offer on ERC721 token
- ERC1155Offer - Offer on ERC1155 with quantity
- MultiChainOffer - Cross-chain offer scenarios
- LowBalanceOffer - Insufficient funds handling
- ExpirySelection - Custom expiry dates
- PriceValidation - Input validation
- MobileViewport - Mobile responsive
- TabletViewport - Tablet responsive
- WithCallbacks - Success/error callbacks
- LoadingState - Loading states
- ErrorState - Error handling

### SuccessfulPurchaseModal
**Location**: `/react/ui/modals/SuccessfulPurchaseModal/`
**Stories needed**:
- BasicSuccess - Standard purchase success
- ERC721Success - ERC721 purchase confirmation
- ERC1155Success - ERC1155 with quantity
- MultipleItemsSuccess - Batch purchase success
- WithShareOptions - Social sharing features
- WithTransactionDetails - Detailed tx info
- MobileViewport - Mobile responsive
- CustomActions - Custom post-purchase actions

## 2. Core UI Components 🔴

### MarketplaceCollectibleCard
**Location**: `/react/ui/components/marketplace-collectible-card/`
**Stories needed**:
- MarketCard - Marketplace variant
  - Listed - With active listing
  - NotListed - Without listing
  - MultipleListings - Multiple active listings
  - WithOffer - Has active offers
  - Sold - Recently sold
  - Loading - Loading state
  - Error - Error state
- ShopCard - Shop variant
  - InStock - Available for purchase
  - LowStock - Low inventory warning
  - OutOfStock - Sold out
  - ComingSoon - Pre-launch
  - OnSale - Discounted price
  - Bundle - Multiple items
- Responsive - Different viewports
- Interactive - Hover/click states
- Skeleton - Loading skeleton

### Media Component
**Location**: `/react/ui/components/media/`
**Stories needed**:
- ImageMedia - Various image formats
  - PNG/JPG - Standard images
  - GIF - Animated images
  - SVG - Vector graphics
  - WebP - Modern format
  - LoadingState - While loading
  - ErrorState - Failed to load
  - Placeholder - Before load
- VideoMedia - Video content
  - MP4 - Standard video
  - WebM - Alternative format
  - Autoplay - Auto-playing video
  - Controls - With controls
  - Muted - Muted by default
- AudioMedia - Audio files
  - MP3 - Standard audio
  - WAV - High quality
  - WithVisualizer - Audio visualization
- ModelViewer - 3D models
  - GLB - 3D model files
  - GLTF - Alternative 3D format
  - Interactive - User can rotate
  - AutoRotate - Automatic rotation

### ActionButton Component
**Location**: `/react/ui/components/_internals/action-button/`
**Stories needed**:
- OwnerActions
  - Sell - List for sale
  - Transfer - Transfer ownership
  - CreateListing - Create new listing
  - CancelListing - Cancel active listing
  - AcceptOffer - Accept an offer
- NonOwnerActions
  - Buy - Purchase item
  - MakeOffer - Create offer
  - AddToCart - Add to shopping cart
- States
  - Loading - Processing state
  - Disabled - Unavailable action
  - Success - Action completed
  - Error - Action failed
- Responsive - Mobile/tablet views

## 3. Essential Hooks 🟡

### useCollectible
**Stories needed**:
- BasicUsage - Fetch single collectible
- WithMetadata - Include metadata
- ErrorHandling - Network errors
- LoadingStates - Loading progression
- CacheManagement - Cache behavior

### useCollection
**Stories needed**:
- BasicCollection - Fetch collection data
- WithFilters - Apply filters
- Pagination - Handle large collections
- RealTimeUpdates - Live updates
- ErrorRecovery - Error handling

### useListCollectibles
**Stories needed**:
- BasicList - Standard listing
- WithFilters - Filter options
- Sorting - Sort options
- Pagination - Page navigation
- InfiniteScroll - Infinite loading
- EmptyState - No results
- ErrorState - Failed to load

### useCurrencyBalance
**Stories needed**:
- SingleCurrency - One currency balance
- MultipleCurrencies - Multiple balances
- RealTimeUpdates - Live balance updates
- LowBalance - Insufficient funds
- ZeroBalance - No funds
- LoadingState - Fetching balance

### useCheckoutOptions
**Stories needed**:
- CreditCard - Card payment options
- Crypto - Cryptocurrency options
- Mixed - Multiple payment methods
- Discounts - Applied discounts
- Fees - Transaction fees
- TaxCalculation - Tax handling

## 4. Internal Components 🟢

### PriceInput
**Location**: `/react/ui/modals/_internal/components/priceInput/`
**Stories needed**:
- BasicInput - Standard price input
- WithCurrency - Currency selection
- Validation - Input validation
- MinMax - Min/max constraints
- Decimals - Decimal handling
- Formatting - Number formatting
- ErrorStates - Validation errors

### QuantityInput
**Location**: `/react/ui/modals/_internal/components/quantityInput/`
**Stories needed**:
- BasicQuantity - Standard input
- WithMax - Maximum limit
- StepControls - +/- buttons
- Validation - Input validation
- Disabled - Disabled state
- CustomStep - Custom increments

### CurrencyOptionsSelect
**Location**: `/react/ui/modals/_internal/components/currencyOptionsSelect/`
**Stories needed**:
- SingleCurrency - One option
- MultipleCurrencies - Multiple options
- WithIcons - Currency icons
- WithBalances - Show balances
- Grouped - Grouped by type
- Search - Searchable dropdown

### ExpirationDateSelect
**Location**: `/react/ui/modals/_internal/components/expirationDateSelect/`
**Stories needed**:
- PresetOptions - Common durations
- CustomDate - Date picker
- MinMax - Date constraints
- Validation - Date validation
- TimeZones - TZ handling
- Formatting - Date formatting

### TransactionPreview
**Location**: `/react/ui/modals/_internal/components/transactionPreview/`
**Stories needed**:
- BuyPreview - Purchase preview
- SellPreview - Listing preview
- TransferPreview - Transfer preview
- OfferPreview - Offer preview
- WithFees - Fee breakdown
- WithDiscount - Discounts applied
- ErrorState - Preview errors

## 5. Utility Hooks 🟢

### useMarketplaceConfig
**Stories needed**:
- DefaultConfig - Standard setup
- CustomConfig - Custom settings
- MultiChain - Multiple chains
- FeatureFlags - Toggle features
- ThemeConfig - Theme settings

### useFilterState
**Stories needed**:
- BasicFilters - Standard filters
- ComplexFilters - Advanced filtering
- SavedFilters - Persistent filters
- ResetFilters - Clear all
- URLSync - URL parameters

### useComparePrices
**Stories needed**:
- TwoPrices - Basic comparison
- MultiplePrices - Compare many
- DifferentCurrencies - Cross-currency
- WithConversion - USD conversion
- PriceHistory - Historical data

## 6. Integration Stories 🔵

### Multi-Modal Flows
**Stories needed**:
- BuyToSuccess - Complete purchase flow
- ListToSell - List then sell flow
- OfferToAccept - Offer acceptance flow
- TransferChain - Sequential transfers

### Error Recovery
**Stories needed**:
- NetworkErrors - Connection issues
- TransactionFailures - Failed txs
- ValidationErrors - Input errors
- RetryMechanisms - Retry logic

### Performance Stories
**Stories needed**:
- LargeCollections - 1000+ items
- RapidUpdates - High-frequency updates
- HeavyMedia - Large files
- ConcurrentRequests - Multiple parallel

## Implementation Strategy

### Phase 1 (Week 1-2) 🔴
1. MakeOfferModal stories
2. SuccessfulPurchaseModal stories
3. MarketplaceCollectibleCard stories
4. Media component stories
5. ActionButton stories

### Phase 2 (Week 3-4) 🟡
1. Essential hooks stories
2. Internal modal components
3. Transaction preview components
4. Currency and price components

### Phase 3 (Week 5-6) 🟢
1. Utility hooks stories
2. Filter and search components
3. Loading and error states
4. Responsive design stories

### Phase 4 (Week 7-8) 🔵
1. Integration flow stories
2. Performance testing stories
3. Edge case scenarios
4. Documentation stories

## Testing Considerations

### Accessibility
- Keyboard navigation tests
- Screen reader compatibility
- Color contrast validation
- Focus management

### Performance
- Render performance metrics
- Bundle size impact
- Memory usage patterns
- Network request optimization

### Cross-browser
- Chrome/Edge (Chromium)
- Firefox
- Safari
- Mobile browsers

### Internationalization
- RTL language support
- Currency formatting
- Date/time localization
- Translation key coverage

## Success Metrics

1. **Coverage Goals**
   - 90%+ component coverage
   - 80%+ hook coverage
   - 100% modal coverage
   - 95%+ critical path coverage

2. **Quality Metrics**
   - All stories have play functions
   - Accessibility tests pass
   - Performance benchmarks met
   - No console errors/warnings

3. **Documentation**
   - Every story has description
   - Complex components have docs
   - Integration examples provided
   - Best practices documented

## Maintenance Plan

1. **Regular Reviews**
   - Weekly story audits
   - Monthly coverage reports
   - Quarterly refactoring
   - Annual architecture review

2. **Automation**
   - Pre-commit story checks
   - CI/CD story testing
   - Automated screenshots
   - Visual regression tests

3. **Team Guidelines**
   - Story writing standards
   - Review checklist
   - Naming conventions
   - Documentation requirements