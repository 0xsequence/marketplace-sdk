import type {
	IndexerContractInfo as ContractInfo,
	IndexerTokenBalance as TokenBalance,
} from '@0xsequence/marketplace-api';
import { queryOptions } from '@tanstack/react-query';
import type { Address } from 'viem';
import type { Page, SdkConfig } from '../../../types';
import { compareAddress } from '../../../utils';
import {
	type ContractType,
	getQueryClient,
	MetadataStatus,
} from '../../_internal';
import { tokenBalancesOptions } from '../collectible/token-balances';
import { fetchMarketplaceConfig } from '../marketplace/config';

export interface UseInventoryArgs {
	accountAddress: Address;
	collectionAddress: Address;
	chainId: number;
	includeNonTradable?: boolean;
	query?: {
		enabled?: boolean;
		page?: number;
		pageSize?: number;
	};
}

type GetInventoryArgs = Omit<UseInventoryArgs, 'query'>;

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
	chainId: number,
	accountAddress: Address,
	collectionAddress: Address,
	config: SdkConfig,
): Promise<{ collectibles: CollectibleWithBalance[] }> {
	const queryClient = getQueryClient();
	const balances = await queryClient.fetchQuery(
		tokenBalancesOptions(
			{
				collectionAddress,
				userAddress: accountAddress,
				chainId,
				includeMetadata: true,
			},
			config,
		),
	);

	const collectibles = balances.map((balance) =>
		collectibleFromTokenBalance(balance),
	);

	return {
		collectibles,
	};
}

export async function fetchInventory(
	args: GetInventoryArgs,
	config: SdkConfig,
	page: Page,
): Promise<CollectiblesResponse> {
	const { accountAddress, collectionAddress, chainId } = args;
	const marketplaceConfig = await fetchMarketplaceConfig({ config });

	const marketCollections = marketplaceConfig?.market.collections || [];

	const isMarketCollection = marketCollections.some((collection) =>
		compareAddress(collection.itemsAddress, collectionAddress),
	);

	// Determine if this collection is tradable (market collection vs shop collection)
	const isTradable = isMarketCollection;

	// Fetch collectibles from indexer
	const { collectibles } = await fetchIndexerTokens(
		chainId,
		accountAddress,
		collectionAddress,
		config,
	);

	return {
		collectibles,
		page: {
			page: page.page,
			pageSize: page.pageSize,
		},
		isTradable,
	};
}

export function inventoryOptions(args: UseInventoryArgs, config: SdkConfig) {
	const enabledQuery = args.query?.enabled ?? true;
	const enabled =
		enabledQuery && !!args.accountAddress && !!args.collectionAddress;

	return queryOptions({
		queryKey: [
			'inventory',
			args.accountAddress,
			args.collectionAddress,
			args.chainId,
			args.query?.page ?? 1,
			args.query?.pageSize ?? 30,
		],
		queryFn: () =>
			fetchInventory(
				{
					...args,
				},
				config,
				{
					page: args.query?.page ?? 1,
					pageSize: args.query?.pageSize ?? 30,
				},
			),
		enabled,
	});
}
