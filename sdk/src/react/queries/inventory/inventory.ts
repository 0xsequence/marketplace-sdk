import type {
	ChainId,
	GetUserCollectionBalancesRequest,
	IndexerTokenMetadata,
	IndexerTokenBalance as TokenBalance,
} from '@0xsequence/api-client';
import { ContractType, MetadataStatus } from '@0xsequence/api-client';
import { isAddress } from 'viem';
import type { Page } from '../../../types';
import { findMarketCollection } from '../../../utils';
import {
	buildQueryOptions,
	getQueryClient,
	type SdkQueryParams,
	type WithOptionalParams,
	type WithRequired,
} from '../../_internal';
import { tokenBalancesOptions } from '../collectible/token-balances';
import { fetchMarketplaceConfig } from '../marketplace/config';

export type FetchInventoryParams = GetUserCollectionBalancesRequest & {
	chainId: ChainId;
	includeNonTradable?: boolean;
	page?: number;
	pageSize?: number;
};

export type CollectibleMetadata = Pick<
	IndexerTokenMetadata,
	| 'tokenId'
	| 'attributes'
	| 'image'
	| 'name'
	| 'description'
	| 'video'
	| 'audio'
> & {
	status: MetadataStatus;
};

export type CollectibleWithBalance = Pick<TokenBalance, 'contractInfo'> & {
	metadata: CollectibleMetadata;
	balance: string;
	contractType: ContractType.ERC1155 | ContractType.ERC721;
};

export type CollectiblesResponse = {
	collectibles: CollectibleWithBalance[];
	page: Page;
	isTradable: boolean;
};

/**
 * Validates if a contract type is a valid collectible type (ERC721 or ERC1155)
 */
function isCollectibleContractType(
	contractType: string,
): contractType is ContractType.ERC721 | ContractType.ERC1155 {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison -- Intentional type guard comparing string with enum
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
		'chainId' | 'userAddress' | 'collectionAddress' | 'config'
	>,
): Promise<{ collectibles: CollectibleWithBalance[] }> {
	const { chainId, userAddress, collectionAddress, config } = params;
	const queryClient = getQueryClient();
	const balances = await queryClient.fetchQuery(
		tokenBalancesOptions({
			collectionAddress,
			userAddress,
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
		'userAddress' | 'collectionAddress' | 'chainId' | 'config'
	>,
): Promise<CollectiblesResponse> {
	const {
		userAddress,
		collectionAddress,
		chainId,
		config,
		page = 1,
		pageSize = 30,
	} = params;
	const marketplaceConfig = await fetchMarketplaceConfig({ config });

	const marketCollections = marketplaceConfig?.market.collections || [];

	const isMarketCollection = !!findMarketCollection(
		marketCollections,
		collectionAddress,
		chainId,
	);

	// Determine if this collection is tradable (market collection vs shop collection)
	const isTradable = isMarketCollection;

	// Fetch collectibles from indexer
	const { collectibles } = await fetchIndexerTokens({
		chainId,
		userAddress,
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
		params.userAddress,
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
			'userAddress' | 'collectionAddress' | 'chainId' | 'config'
		>
	>,
) {
	return buildQueryOptions(
		{
			getQueryKey: getInventoryQueryKey,
			requiredParams: [
				'userAddress',
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
