import { CollectibleCardAction } from '../../../../../types';

/**
 * Parameters for determining the appropriate card action
 */
export type DetermineCardActionParams = {
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
export function determineCardAction(
	params: DetermineCardActionParams,
): CollectibleCardAction {
	const { hasBalance, hasOffer, hasListing } = params;

	if (hasBalance) {
		// Owner actions (in priority order)
		if (hasOffer) return CollectibleCardAction.SELL;
		if (!hasListing) return CollectibleCardAction.LIST;
		return CollectibleCardAction.TRANSFER;
	}

	// Non-owner actions
	if (hasListing) return CollectibleCardAction.BUY;
	return CollectibleCardAction.OFFER;
}
