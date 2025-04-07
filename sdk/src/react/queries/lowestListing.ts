import { queryOptions } from '@tanstack/react-query';
import type { Address } from 'viem';
import type { UseQueryParameters } from 'wagmi/query';
import type { SdkConfig } from '../../types';
import { collectableKeys, getMarketplaceClient } from '../_internal';

export type UseLowestListingArgs = {
	collectionAddress: Address;
	tokenId: string;
	chainId: number;
	query?: UseQueryParameters;
};

/**
 * Fetches the lowest listing for a specific collectible
 *
 * @param args - Arguments for the API call
 * @param config - SDK configuration
 * @returns The lowest listing data
 */
export async function fetchLowestListing(
	args: UseLowestListingArgs,
	config: SdkConfig,
) {
	const marketplaceClient = getMarketplaceClient(args.chainId, config);

	const data = await marketplaceClient.getCollectibleLowestListing({
		contractAddress: args.collectionAddress,
		tokenId: args.tokenId.toString(),
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
 * Creates a tanstack query options object for the lowest listing query
 *
 * @param args - The query arguments
 * @param config - SDK configuration
 * @returns Query options configuration
 */
export function lowestListingOptions(
	args: UseLowestListingArgs,
	config: SdkConfig,
) {
	return queryOptions({
		...args.query,
		queryKey: [...collectableKeys.lowestListings, args],
		queryFn: () => fetchLowestListing(args, config),
	});
}
