import { queryOptions } from '@tanstack/react-query';
import type { Address } from 'viem';
import type { SdkConfig } from '../../../types';
import type {
	ListCollectibleListingsRequest,
	ListCollectibleListingsResponse,
	QueryKeyArgs,
	ValuesOptional,
} from '../../_internal';
import { getMarketplaceClient } from '../../_internal';
import type { StandardQueryOptions } from '../../types/query';

export interface FetchListListingsForCollectibleParams
	extends Omit<
		ListCollectibleListingsRequest,
		'chainId' | 'contractAddress' | 'tokenId'
	> {
	chainId: number;
	collectionAddress: Address;
	collectibleId: string;
	config: SdkConfig;
}

/**
 * Fetches listings for a specific collectible from the Marketplace API
 */
export async function fetchListListingsForCollectible(
	params: FetchListListingsForCollectibleParams,
): Promise<ListCollectibleListingsResponse> {
	const {
		collectionAddress,
		chainId,
		collectibleId,
		config,
		...additionalApiParams
	} = params;
	const marketplaceClient = getMarketplaceClient(config);

	const apiArgs: ListCollectibleListingsRequest = {
		contractAddress: collectionAddress,
		chainId: String(chainId),
		tokenId: collectibleId,
		...additionalApiParams,
	};

	return await marketplaceClient.listListingsForCollectible(apiArgs);
}

export type ListListingsForCollectibleQueryOptions =
	ValuesOptional<FetchListListingsForCollectibleParams> & {
		query?: StandardQueryOptions;
	};

export function getListListingsForCollectibleQueryKey(
	params: ListListingsForCollectibleQueryOptions,
) {
	const apiArgs = {
		chainId: String(params.chainId),
		contractAddress: params.collectionAddress,
		tokenId: params.collectibleId,
		filter: params.filter,
		page: params.page,
	} satisfies QueryKeyArgs<ListCollectibleListingsRequest>;

	return ['collectible', 'market-listings', apiArgs] as const;
}

export function listListingsForCollectibleQueryOptions(
	params: ListListingsForCollectibleQueryOptions,
) {
	const enabled = Boolean(
		params.collectionAddress &&
			params.chainId &&
			params.collectibleId &&
			params.config &&
			(params.query?.enabled ?? true),
	);

	return queryOptions({
		queryKey: getListListingsForCollectibleQueryKey(params),
		queryFn: () =>
			fetchListListingsForCollectible({
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				chainId: params.chainId!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				collectionAddress: params.collectionAddress!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				collectibleId: params.collectibleId!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				config: params.config!,
				filter: params.filter,
				page: params.page,
			}),
		...params.query,
		enabled,
	});
}
