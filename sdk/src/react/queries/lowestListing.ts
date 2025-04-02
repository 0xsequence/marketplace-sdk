import { queryOptions } from '@tanstack/react-query';
import type { UseQueryParameters } from 'wagmi/query';
import type { Order as APIOrder, SdkConfig } from '../../types';
import { collectableKeys, getMarketplaceClient } from '../_internal';

export type UseLowestListingArgs = {
	collectionAddress: Address;
	tokenId: string;
	chainId: number;
	query?: UseQueryParameters;
};

export type Order = Omit<APIOrder, 'priceAmount' | 'priceAmountNet'> & {
	priceAmount: bigint;
	priceAmountNet: bigint;
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
		tokenId: args.tokenId,
	});

	let order: Order | undefined;
	if (data.order) {
		order = {
			...data.order,
			priceAmount: BigInt(data.order.priceAmount),
			priceAmountNet: BigInt(data.order.priceAmountNet),
		};
	}

	return order ?? null;
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
		queryKey: [...collectableKeys.lowestListings, args],
		queryFn: () => fetchLowestListing(args, config),
	});
}
