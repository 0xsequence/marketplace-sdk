import { queryOptions } from '@tanstack/react-query';
import type { Address } from 'viem';
import type { SdkConfig } from '../../../types';
import type {
	ListCollectibleOffersReturn,
	ListOffersForCollectibleArgs,
	Page,
	QueryKeyArgs,
	SortBy,
	ValuesOptional,
} from '../../_internal';
import { getMarketplaceClient } from '../../_internal';
import type { StandardQueryOptions } from '../../types/query';

export interface FetchListOffersForCollectibleParams
	extends Omit<
		ListOffersForCollectibleArgs,
		'chainId' | 'contractAddress' | 'tokenId'
	> {
	chainId: number;
	collectionAddress: Address;
	collectibleId: string;
	config: SdkConfig;
	sort?: Array<SortBy>;
}

/**
 * Fetches offers for a specific collectible from the Marketplace API
 */
export async function fetchListOffersForCollectible(
	params: FetchListOffersForCollectibleParams,
): Promise<ListCollectibleOffersReturn> {
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

	const apiArgs: ListOffersForCollectibleArgs = {
		contractAddress: collectionAddress,
		chainId: String(chainId),
		tokenId: collectibleId,
		page: finalPage,
		...additionalApiParams,
	};

	return await marketplaceClient.listCollectibleOffers(apiArgs);
}

export type ListOffersForCollectibleQueryOptions =
	ValuesOptional<FetchListOffersForCollectibleParams> & {
		query?: StandardQueryOptions;
	};

export function getListOffersForCollectibleQueryKey(
	params: ListOffersForCollectibleQueryOptions,
) {
	const apiArgs = {
		chainId: String(params.chainId),
		contractAddress: params.collectionAddress,
		tokenId: params.collectibleId,
		filter: params.filter,
		page: params.page,
	} satisfies QueryKeyArgs<ListOffersForCollectibleArgs>;

	return ['collectible', 'market-offers', apiArgs] as const;
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
