import type {
	IndexerContractInfo as ContractInfo,
	IndexerTokenBalance as TokenBalance,
} from '@0xsequence/api-client';
import { ContractType } from '@0xsequence/api-client';
import type { Address } from 'viem';
import { isAddress } from 'viem';
import type { Page } from '../../../types';
import { compareAddress } from '../../../utils';
import {
	buildQueryOptions,
	getQueryClient,
	MetadataStatus,
	type SdkQueryParams,
	type WithOptionalParams,
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

/**
 * Validates if a contract type is a valid collectible type (ERC721 or ERC1155)
 */
function isCollectibleContractType(
	contractType: string,
): contractType is ContractType.ERC721 | ContractType.ERC1155 {
	return (
		contractType === ContractType.ERC721 ||
		contractType === ContractType.ERC1155
	);
}

/**
 * Transforms an Indexer token balance into a collectible with metadata
 * @throws Error if token is not a valid collectible type (ERC721/ERC1155)
 */
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
		contractType: token.contractType as
			| ContractType.ERC721
			| ContractType.ERC1155,
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

	const collectibles = balances
		.filter((balance) => isCollectibleContractType(balance.contractType))
		.map((balance) => collectibleFromTokenBalance(balance));

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
export type UseInventoryArgs = Omit<InventoryQueryOptions, 'config'> & {
	config?: InventoryQueryOptions['config'];
};

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

export function getInventoryQueryKey(params: InventoryQueryOptions) {
	return [
		'inventory',
		params.accountAddress,
		params.collectionAddress,
		params.chainId,
		params.page ?? 1,
		params.pageSize ?? 30,
	] as const;
}

export function inventoryOptions(
	params: WithOptionalParams<
		WithRequired<
			InventoryQueryOptions,
			'accountAddress' | 'collectionAddress' | 'chainId' | 'config'
		>
	>,
) {
	return buildQueryOptions(
		{
			getQueryKey: getInventoryQueryKey,
			requiredParams: [
				'accountAddress',
				'collectionAddress',
				'chainId',
				'config',
			] as const,
			fetcher: fetchInventory,
			customValidation: (p) =>
				!!p.collectionAddress && isAddress(p.collectionAddress),
		},
		params,
	);
}
