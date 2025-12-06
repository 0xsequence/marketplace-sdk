import { useAccount } from 'wagmi';
import { compareAddress } from '../../../utils/address';
import type { Order } from '../../_internal';

export interface CollectibleCardOfferState {
	show: true;
	canAcceptOffer: boolean;
	isOfferMadeBySelf: boolean;
	userOwnsToken: boolean;
}

/**
 * Hook to determine the state of the collectible card offer notification
 *
 * @param highestOffer - The highest offer for the collectible
 * @param balance - The user's balance of the collectible
 * @returns CollectibleCardOfferState if there's an offer, null otherwise
 */
export function useCollectibleCardOfferState(
	highestOffer?: Order,
	balance?: string,
): CollectibleCardOfferState | null {
	const { address: currentUserAddress } = useAccount();

	if (!highestOffer) {
		return null;
	}

	// Check if the current user made the offer
	const isOfferMadeBySelf =
		currentUserAddress &&
		highestOffer.createdBy &&
		compareAddress(highestOffer.createdBy, currentUserAddress);

	// Check if user owns the token (has balance > 0)
	const userOwnsToken = balance !== undefined && Number(balance) > 0;

	// Can accept offer: didn't make the offer AND owns the token
	const canAcceptOffer = !isOfferMadeBySelf && userOwnsToken;

	return {
		show: true,
		canAcceptOffer,
		isOfferMadeBySelf: !!isOfferMadeBySelf,
		userOwnsToken,
	};
}
