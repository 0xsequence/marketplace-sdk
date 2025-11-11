import type { ListOffersForCollectibleRequest as APIListOffersForCollectibleRequest } from '@0xsequence/marketplace-api';
import { queryOptions } from '@tanstack/react-query';
import type { Address } from 'viem';
import type { SdkConfig } from '../../../types';
import type {
	ListCollectibleOffersResponse,
	ListOffersForCollectibleRequest,
	Page,
	SortBy,
	ValuesOptional,
} from '../../_internal';
import { getMarketplaceClient } from '../../_internal';
import type { StandardQueryOptions } from '../../types/query';

export interface FetchListOffersForCollectibleParams
	extends Omit<
		ListOffersForCollectibleRequest,
		'chainId' | 'contractAddress' | 'tokenId'
	> {
	chainId: number;
	collectionAddress: Address;
	collectibleId: bigint;
	config: SdkConfig;
	sort?: Array<SortBy>;
}

/**
 * Fetches offers for a specific collectible from the Marketplace API
 */
export async function fetchListOffersForCollectible(
	params: FetchListOffersForCollectibleParams,
): Promise<ListCollectibleOffersResponse> {
	const {
		collectionAddress,
		chainId,
		collectibleId,
		config,
		sort,
		page,
		...additionalApiParams
	} = params;
	const marketplaceClient = getMarketplaceClient(config);

	const finalSort = sort || (page && 'sort' in page ? page.sort : undefined);

	let finalPage: Page | undefined;
	if (page || finalSort) {
		finalPage = {
			page: page?.page ?? 1,
			pageSize: page?.pageSize ?? 20,
			...(page?.more && { more: page.more }),
			...(finalSort && { sort: finalSort }),
		} as Page;
	}

	return await marketplaceClient.listOffersForCollectible({
		contractAddress: collectionAddress,
		chainId: chainId,
		tokenId: collectibleId,
		page: finalPage,
		...additionalApiParams,
	});
}

export type ListOffersForCollectibleQueryOptions =
	ValuesOptional<FetchListOffersForCollectibleParams> & {
		query?: StandardQueryOptions;
	};

export function getListOffersForCollectibleQueryKey(
	params: ListOffersForCollectibleQueryOptions,
) {
	const apiArgs: APIListOffersForCollectibleRequest = {
		chainId: params.chainId ?? 0,
		contractAddress: params.collectionAddress ?? '',
		tokenId: params.collectibleId ?? 0n,
		filter: params.filter,
		page: params.page,
	};

	const client = getMarketplaceClient(params.config!);
	return client.queryKey.listOffersForCollectible({
		...apiArgs,
		chainId: apiArgs.chainId.toString(),
		tokenId: apiArgs.tokenId,
	});
}

export function listOffersForCollectibleQueryOptions(
	params: ListOffersForCollectibleQueryOptions,
) {
	const enabled = Boolean(
		params.collectionAddress &&
			params.chainId &&
			params.collectibleId &&
			params.config &&
			(params.query?.enabled ?? true),
	);

	return queryOptions({
		queryKey: getListOffersForCollectibleQueryKey(params),
		queryFn: () =>
			fetchListOffersForCollectible({
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
				sort: params.sort,
			}),
		...params.query,
		enabled,
	});
}
