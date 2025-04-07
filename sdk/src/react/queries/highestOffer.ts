import { queryOptions } from '@tanstack/react-query';
import type { Address } from 'viem';
import type { UseQueryParameters } from 'wagmi/query';
import type { SdkConfig } from '../../types';
import {
	type GetCollectibleHighestOfferArgs,
	collectableKeys,
	getMarketplaceClient,
} from '../_internal';

export interface UseHighestOfferArgs
	extends Omit<GetCollectibleHighestOfferArgs, 'contractAddress'> {
	collectionAddress: Address;
	chainId: number;
	query?: UseQueryParameters;
}

/**
 * Fetches the highest offer for a specific collectible
 *
 * @param args - Arguments for the API call
 * @param config - SDK configuration
 * @returns The highest offer data
 */
export async function fetchHighestOffer(
	args: UseHighestOfferArgs,
	config: SdkConfig,
) {
	const marketplaceClient = getMarketplaceClient(args.chainId, config);

	const data = await marketplaceClient.getCollectibleHighestOffer({
		contractAddress: args.collectionAddress,
		...args,
	});

	// let order: Order | undefined;
	// if (data.order) {
	// 	order = {
	// 		...data.order,
	// 		priceAmount: BigInt(data.order.priceAmount),
	// 		priceAmountNet: BigInt(data.order.priceAmountNet),
	// 	};
	// }

	return data.order ?? null;
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
		queryKey: [...collectableKeys.highestOffers, args],
		queryFn: () => fetchHighestOffer(args, config),
	});
}
