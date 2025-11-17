import type {
	IndexerContractInfo as ContractInfo,
	IndexerTokenBalance as TokenBalance,
} from '@0xsequence/marketplace-api';
import { queryOptions } from '@tanstack/react-query';
import type { Address } from 'viem';
import type { Page } from '../../../types';
import { compareAddress } from '../../../utils';
import {
	type ContractType,
	getQueryClient,
	MetadataStatus,
	type SdkQueryParams,
	type WithRequired,
} from '../../_internal';
import { tokenBalancesOptions } from '../collectible/token-balances';
import { fetchMarketplaceConfig } from '../marketplace/config';

export interface FetchInventoryParams {
	accountAddress: Address;
	collectionAddress: Address;
	chainId: number;
	includeNonTradable?: boolean;
	page?: number;
	pageSize?: number;
}

export interface CollectibleWithBalance {
	metadata: {
		tokenId: bigint;
		attributes: Array<any>;
		image?: string;
		name: string;
		description?: string;
		video?: string;
		audio?: string;
		status: MetadataStatus;
	};
	balance: string;
	contractInfo?: ContractInfo;
	contractType: ContractType.ERC1155 | ContractType.ERC721;
}

export interface CollectiblesResponse {
	collectibles: CollectibleWithBalance[];
	page: Page;
	isTradable: boolean;
}

function collectibleFromTokenBalance(
	token: TokenBalance,
): CollectibleWithBalance {
	return {
		metadata: {
			tokenId: token.tokenId ?? 0n,
			attributes: token.tokenMetadata?.attributes ?? [],
			image: token.tokenMetadata?.image,
			name: token.tokenMetadata?.name ?? '',
			description: token.tokenMetadata?.description,
			video: token.tokenMetadata?.video,
			audio: token.tokenMetadata?.audio,
			status: MetadataStatus.AVAILABLE,
		},
		contractInfo: token.contractInfo,
		contractType: token.contractType as unknown as
			| ContractType.ERC1155
			| ContractType.ERC721,
		balance: token.balance.toString(),
	};
}

async function fetchIndexerTokens(
	params: WithRequired<
		InventoryQueryOptions,
		'chainId' | 'accountAddress' | 'collectionAddress' | 'config'
	>,
): Promise<{ collectibles: CollectibleWithBalance[] }> {
	const { chainId, accountAddress, collectionAddress, config } = params;
	const queryClient = getQueryClient();
	const balances = await queryClient.fetchQuery(
		tokenBalancesOptions({
			collectionAddress,
			userAddress: accountAddress,
			chainId,
			includeMetadata: true,
			config,
		}),
	);

	const collectibles = balances.map((balance) =>
		collectibleFromTokenBalance(balance),
	);

	return {
		collectibles,
	};
}

export type InventoryQueryOptions = SdkQueryParams<
	FetchInventoryParams,
	{
		enabled?: boolean;
	}
>;

/**
 * @deprecated Use InventoryQueryOptions instead
 */
export type UseInventoryArgs = InventoryQueryOptions;

export async function fetchInventory(
	params: WithRequired<
		InventoryQueryOptions,
		'accountAddress' | 'collectionAddress' | 'chainId' | 'config'
	>,
): Promise<CollectiblesResponse> {
	const {
		accountAddress,
		collectionAddress,
		chainId,
		config,
		page = 1,
		pageSize = 30,
	} = params;
	const marketplaceConfig = await fetchMarketplaceConfig({ config });

	const marketCollections = marketplaceConfig?.market.collections || [];

	const isMarketCollection = marketCollections.some((collection) =>
		compareAddress(collection.itemsAddress, collectionAddress),
	);

	// Determine if this collection is tradable (market collection vs shop collection)
	const isTradable = isMarketCollection;

	// Fetch collectibles from indexer
	const { collectibles } = await fetchIndexerTokens({
		chainId,
		accountAddress,
		collectionAddress,
		config,
	});

	return {
		collectibles,
		page: {
			page,
			pageSize,
		},
		isTradable,
	};
}

export function inventoryOptions(params: InventoryQueryOptions) {
	const enabledQuery = params.query?.enabled ?? true;
	const enabled =
		enabledQuery &&
		!!params.accountAddress &&
		!!params.collectionAddress &&
		!!params.config;

	return queryOptions({
		queryKey: [
			'inventory',
			params.accountAddress,
			params.collectionAddress,
			params.chainId,
			params.page ?? 1,
			params.pageSize ?? 30,
		],
		queryFn: () =>
			fetchInventory({
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				accountAddress: params.accountAddress!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				collectionAddress: params.collectionAddress!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				chainId: params.chainId!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				config: params.config!,
				page: params.page,
				pageSize: params.pageSize,
				includeNonTradable: params.includeNonTradable,
			}),
		enabled,
	});
}
