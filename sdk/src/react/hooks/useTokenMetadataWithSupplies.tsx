import { queryOptions, useQuery } from '@tanstack/react-query';
import type { SdkConfig } from '../../types';
import { getIndexerClient, getMetadataClient } from '../_internal';
import { useConfig } from './useConfig';

interface FetchTokenMetadataArgs {
	chainId: number;
	contractAddress: string;
	tokenIds: number[];
	query?: {
		enabled?: boolean;
	};
}

const tokenSuppliesCache = new Map<string, Map<string, number>>();

const fetchTokenMetadataWithSupplies = async (
	{ chainId, contractAddress, tokenIds }: FetchTokenMetadataArgs,
	config: SdkConfig,
) => {
	const metadataClient = getMetadataClient(config);
	const indexerClient = getIndexerClient(chainId, config);

	const response = await metadataClient.getTokenMetadata({
		chainID: chainId.toString(),
		contractAddress: contractAddress,
		tokenIDs: tokenIds.map((id) => id.toString()),
	});

	// Check if we already have cached supplies for this contract
	const cacheKey = `${chainId}-${contractAddress}`;
	if (!tokenSuppliesCache.has(cacheKey)) {
		const contractSupplies = new Map<string, number>();

		let currentPage = {};

		while (true) {
			const suppliesResponse = await indexerClient.getTokenSupplies({
				contractAddress: contractAddress,
				page: currentPage,
			});

			const tokenSuppliesData = suppliesResponse.tokenIDs;

			if (tokenSuppliesData.length > 0) {
				for (const token of tokenSuppliesData) {
					contractSupplies.set(token.tokenID, Number.parseInt(token.supply));
				}
			}

			if (suppliesResponse.page.more === false) {
				break;
			}

			currentPage = suppliesResponse.page;
		}

		tokenSuppliesCache.set(cacheKey, contractSupplies);
	}

	return response.tokenMetadata.map((token) => {
		return {
			...token,
			supply: tokenSuppliesCache.get(cacheKey)?.get(token.tokenId),
		};
	});
};

export const tokenMetadataWithSuppliesOptions = (
	args: FetchTokenMetadataArgs,
	config: SdkConfig,
) => {
	return queryOptions({
		...args.query,
		queryKey: [
			'token-metadata-with-supplies',
			args.chainId,
			args.contractAddress,
		],
		queryFn: () => fetchTokenMetadataWithSupplies(args, config),
	});
};

export const useTokenMetadataWithSupplies = (args: FetchTokenMetadataArgs) => {
	const config = useConfig();
	const { chainId, contractAddress, tokenIds, query } = args;

	return useQuery({
		...tokenMetadataWithSuppliesOptions(
			{ chainId, contractAddress, tokenIds, query },
			config,
		),
	});
};
