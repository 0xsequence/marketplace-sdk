import { queryOptions } from '@tanstack/react-query';
import type { Order, SdkConfig } from '../../types';
import { collectableKeys, getMarketplaceClient } from '../_internal';
import type { UseQueryParameters } from 'wagmi/query';

export type UseHighestOfferArgs = {
	collectionAddress: string;
	tokenId: string;
	chainId: string;
	query?: UseQueryParameters;
};

// TODO: Take this to a more global place
export type BigIntOrder = Omit<Order, 'priceAmount' | 'priceAmountNet'> & {
	priceAmount: bigint;
	priceAmountNet: bigint;
};

/**
 * Fetches the highest offer for a specific collectible
 *
 * @param args - Arguments for the API call
 * @param config - SDK configuration
 * @returns The highest offer data with BigInt conversion
 */
export async function fetchHighestOffer(
	args: UseHighestOfferArgs,
	config: SdkConfig,
) {
	const marketplaceClient = getMarketplaceClient(args.chainId, config);

	const { order } = await marketplaceClient.getCollectibleHighestOffer({
		contractAddress: args.collectionAddress,
		tokenId: args.tokenId,
	});

	if (!order) {
		return null;
	}

	// Convert string amounts to BigInt for precise calculations
	return {
		...order,
		priceAmount: order.priceAmount ? BigInt(order.priceAmount) : 0n,
		priceAmountNet: order.priceAmountNet ? BigInt(order.priceAmountNet) : 0n,
	};
}

/**
 * Creates a tanstack query options object for the highest offer query
 *
 * @param args - The query arguments
 * @param config - SDK configuration
 * @returns Query options configuration
 */
export function highestOfferOptions(
	args: UseHighestOfferArgs,
	config: SdkConfig,
) {
	return queryOptions({
		...(args.query || {}),
		queryKey: [...collectableKeys.highestOffers, args, config],
		queryFn: () => fetchHighestOffer(args, config),
	});
}
