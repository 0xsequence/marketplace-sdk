import { queryOptions } from '@tanstack/react-query';
import type { SdkConfig } from '../../../types';
import {
	collectableKeys,
	type GetFloorOrderArgs,
	getMarketplaceClient,
	type QueryKeyArgs,
	type ValuesOptional,
} from '../../_internal';
import type { StandardQueryOptions } from '../../types/query';

export interface FetchFloorOrderParams
	extends Omit<GetFloorOrderArgs, 'contractAddress' | 'chainId'> {
	collectionAddress: string;
	chainId: number;
	config: SdkConfig;
}

/**
 * Fetches the floor order for a collection from the marketplace API
 */
export async function fetchFloorOrder(params: FetchFloorOrderParams) {
	const { collectionAddress, chainId, config, ...additionalApiParams } = params;

	const marketplaceClient = getMarketplaceClient(config);

	const apiArgs: GetFloorOrderArgs = {
		contractAddress: collectionAddress,
		chainId: String(chainId),
		...additionalApiParams,
	};

	const result = await marketplaceClient.getFloorOrder(apiArgs);
	return result.collectible;
}

export type FloorOrderQueryOptions = ValuesOptional<FetchFloorOrderParams> & {
	query?: StandardQueryOptions;
};

export function getFloorOrderQueryKey(params: FloorOrderQueryOptions) {
	const apiArgs = {
		chainId: String(params.chainId),
		contractAddress: params.collectionAddress,
		filter: params.filter,
	} satisfies QueryKeyArgs<GetFloorOrderArgs>;

	return [...collectableKeys.floorOrders, apiArgs] as const;
}

export function floorOrderQueryOptions(params: FloorOrderQueryOptions) {
	const enabled = Boolean(
		params.collectionAddress &&
			params.chainId &&
			params.config &&
			(params.query?.enabled ?? true),
	);

	return queryOptions({
		queryKey: getFloorOrderQueryKey(params),
		queryFn: () =>
			fetchFloorOrder({
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				chainId: params.chainId!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				collectionAddress: params.collectionAddress!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				config: params.config!,
				...((params.filter && { filter: params.filter }) || {}),
			}),
		...params.query,
		enabled,
	});
}
