import type { MarketCollection } from '@0xsequence/api-client';
import { compareAddress } from './address';

/**
 * Finds a market collection matching both the collection address and chain ID.
 * Always use this instead of manually searching market.collections to avoid
 * multi-chain bugs where the same collection address exists on different chains.
 */
export const findMarketCollection = (
	collections: MarketCollection[],
	collectionAddress: string,
	chainId: string | number,
): MarketCollection | undefined => {
	return collections.find(
		(collection) =>
			compareAddress(collection.itemsAddress, collectionAddress) &&
			Number(collection.chainId) === Number(chainId),
	);
};
