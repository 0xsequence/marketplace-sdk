import { queryOptions } from '@tanstack/react-query';
import type { Address } from 'viem';
import type { SdkConfig } from '../../types';
import {
	type GetCollectibleHighestOfferArgs,
	collectableKeys,
	getMarketplaceClient,
} from '../_internal';

export interface UseHighestOfferArgs
	extends Omit<GetCollectibleHighestOfferArgs, 'contractAddress' | 'chainId'> {
	collectionAddress: Address;
	chainId: number;
	query?: {
		enabled?: boolean;
	};
}

export async function fetchHighestOffer(
	args: UseHighestOfferArgs,
	config: SdkConfig,
) {
	const marketplaceClient = getMarketplaceClient(config);

	const { chainId, collectionAddress, tokenId } = args;
	const data = await marketplaceClient.getCollectibleHighestOffer({
		chainId: String(chainId),
		contractAddress: collectionAddress,
		tokenId,
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
		enabled: args.query?.enabled ?? true,
		queryKey: [...collectableKeys.highestOffers, args],
		queryFn: () => fetchHighestOffer(args, config),
	});
}
