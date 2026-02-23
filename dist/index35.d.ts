import { Ft as Address$1, l as Currency, s as ContractType } from "./index2.js";
import { u as CollectibleCardAction } from "./create-config.js";

//#region src/react/ui/components/marketplace-collectible-card/utils/determineCardAction.d.ts
/**
 * Parameters for determining the appropriate card action
 */
type DetermineCardActionParams = {
  /** Whether the user owns the collectible (balance > 0) */
  hasBalance: boolean;
  /** Whether there's a highest offer on the collectible */
  hasOffer: boolean;
  /** Whether the collectible is listed for sale */
  hasListing: boolean;
};
/**
 * Determines the appropriate action for a card based on ownership and market state.
 *
 * Priority rules:
 * - **Owner actions** (when hasBalance is true):
 *   1. SELL - if there's an offer (highest priority for owners)
 *   2. LIST - if not currently listed
 *   3. TRANSFER - default owner action
 *
 * - **Non-owner actions** (when hasBalance is false):
 *   1. BUY - if the item is listed for sale
 *   2. OFFER - default non-owner action
 *
 * @param params - Object containing ownership and market state flags
 * @returns The appropriate CollectibleCardAction for the given state
 *
 * @example
 * ```tsx
 * // Owner with offer
 * const action = determineCardAction({
 *   hasBalance: true,
 *   hasOffer: true,
 *   hasListing: false
 * }); // Returns CollectibleCardAction.SELL
 *
 * // Non-owner with listing
 * const action = determineCardAction({
 *   hasBalance: false,
 *   hasOffer: false,
 *   hasListing: true
 * }); // Returns CollectibleCardAction.BUY
 * ```
 */
declare function determineCardAction(params: DetermineCardActionParams): CollectibleCardAction;
//#endregion
//#region src/react/ui/components/marketplace-collectible-card/utils/formatPrice.d.ts
declare const OVERFLOW_PRICE = 100000000;
declare const UNDERFLOW_PRICE = 0.0001;
declare const formatPriceNumber: (amount: bigint, decimals: number) => {
  formattedNumber: string;
  isUnderflow: boolean;
  isOverflow: boolean;
};
/**
 * Formatted price data structure
 */
type FormattedPrice = {
  /** Price type determines the presentation style */
  type: 'free' | 'underflow' | 'overflow' | 'normal';
  /** Formatted display text (e.g., "0.0001", "100,000,000") */
  displayText: string;
  /** Currency symbol (e.g., "ETH", "USDC") */
  symbol: string;
};
/**
 * Formats price data into a structured object for presentation.
 * This pure data transformation function is easily testable and
 * separates business logic from UI concerns.
 *
 * @param amount - Raw amount bigint (in base units)
 * @param currency - Currency object with symbol and decimals
 * @returns FormattedPrice object for presentation layer
 *
 * @example
 * ```ts
 * const priceData = formatPriceData(1000000000000000000n, {
 *   symbol: 'ETH',
 *   decimals: 18
 * });
 * // Returns: { type: 'normal', displayText: '1', symbol: 'ETH' }
 * ```
 */
declare function formatPriceData(amount: bigint, currency: Currency): FormattedPrice;
//#endregion
//#region src/react/ui/components/marketplace-collectible-card/utils/renderSkeleton.d.ts
/**
 * Determines whether to render a skeleton loading state for a card
 * and returns the skeleton component if appropriate.
 *
 * @param params - Loading state parameters
 * @param params.cardLoading - Whether the card data is loading
 * @param params.balanceIsLoading - Whether the balance data is loading (optional)
 * @param params.collectionType - Type of collection (ERC721/ERC1155)
 * @param params.isShop - Whether this is a shop card variant
 * @returns Skeleton component if loading, null otherwise
 *
 * @example
 * ```tsx
 * const skeleton = renderSkeletonIfLoading({
 *   cardLoading,
 *   balanceIsLoading,
 *   collectionType,
 *   isShop: false
 * });
 * if (skeleton) return skeleton;
 * ```
 */
declare function renderSkeletonIfLoading(params: {
  cardLoading: boolean;
  balanceIsLoading?: boolean;
  collectionType: ContractType | undefined;
  isShop: boolean;
}): React.ReactElement | null;
//#endregion
//#region src/react/ui/components/marketplace-collectible-card/utils/shopCardState.d.ts
type ShopCardStateParams = {
  quantityRemaining?: bigint;
  quantityInitial?: bigint;
  unlimitedSupply?: boolean;
  collectionType?: ContractType;
  salesContractAddress?: Address$1;
};
type ShopCardState = {
  isOutOfStock: boolean;
  isMissingStockInfo: boolean;
  showActionButton: boolean;
  mediaClassName: string;
  titleClassName: string | undefined;
};
/**
 * Calculates the display state for a shop card based on stock availability
 *
 * @param params - Stock and collection parameters
 * @returns Computed state for visual styling and interaction
 *
 * @example
 * ```tsx
 * const shopState = getShopCardState({
 *   quantityRemaining: '5',
 *   quantityInitial: '100',
 *   unlimitedSupply: false,
 *   collectionType: ContractType.ERC1155,
 *   salesContractAddress: '0x...'
 * });
 *
 * // Use computed state
 * <Card.Media className={shopState.mediaClassName} />
 * <Card.Title className={shopState.titleClassName} />
 * <Card.Actions show={shopState.showActionButton} />
 * ```
 */
declare function getShopCardState(params: ShopCardStateParams): ShopCardState;
//#endregion
//#region src/react/ui/components/marketplace-collectible-card/utils/supplyStatus.d.ts
declare const getSupplyStatusText: ({
  quantityRemaining,
  collectionType,
  unlimitedSupply
}: {
  quantityRemaining: bigint | undefined;
  collectionType: ContractType;
  unlimitedSupply?: boolean;
}) => string;
//#endregion
export { renderSkeletonIfLoading as a, UNDERFLOW_PRICE as c, DetermineCardActionParams as d, determineCardAction as f, getShopCardState as i, formatPriceData as l, ShopCardState as n, FormattedPrice as o, ShopCardStateParams as r, OVERFLOW_PRICE as s, getSupplyStatusText as t, formatPriceNumber as u };
//# sourceMappingURL=index35.d.ts.map