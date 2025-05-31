import { queryOptions } from '@tanstack/react-query';
import type { Address } from 'viem';
import type { SdkConfig } from '../../types';
import {
	type GetCollectibleLowestListingArgs,
	type GetCollectibleLowestListingReturn,
	collectableKeys,
	getMarketplaceClient,
} from '../_internal';

export interface UseLowestListingArgs
	extends Omit<GetCollectibleLowestListingArgs, 'contractAddress' | 'chainId'> {
	collectionAddress: Address;
	chainId: number;
	query?: {
		enabled?: boolean;
	};
}

export async function fetchLowestListing(
	args: UseLowestListingArgs,
	config: SdkConfig,
): Promise<GetCollectibleLowestListingReturn['order'] | null> {
	const marketplaceClient = getMarketplaceClient(config);

	const { chainId, collectionAddress, tokenId } = args;
	const data = await marketplaceClient.getCollectibleLowestListing({
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

	return data.order || null;
}

export function lowestListingOptions(
	args: UseLowestListingArgs,
	config: SdkConfig,
) {
	return queryOptions({
		enabled: args.query?.enabled ?? true,
		queryKey: [...collectableKeys.lowestListings, args],
		queryFn: () => fetchLowestListing(args, config),
	});
}
