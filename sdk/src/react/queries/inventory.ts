import type { ContractInfo, TokenBalance } from '@0xsequence/indexer';
import { queryOptions } from '@tanstack/react-query';
import type { Address } from 'viem';
import type { Page, SdkConfig } from '../../types';
import { compareAddress } from '../../utils';
import { type ContractType, getQueryClient } from '../_internal';
import { fetchMarketplaceConfig } from './marketplaceConfig';
import { tokenBalancesOptions } from './tokenBalances';

export interface UseInventoryArgs {
	accountAddress: Address;
	collectionAddress: Address;
	chainId: number;
	isLaos721?: boolean;
	includeNonTradable?: boolean;
	query?: {
		enabled?: boolean;
		page?: number;
		pageSize?: number;
	};
}

interface GetInventoryArgs extends Omit<UseInventoryArgs, 'query'> {
	isLaos721: boolean;
}

interface CollectibleWithBalance {
	metadata: {
		tokenId: string;
		attributes: Array<any>;
		image?: string;
		name: string;
		description?: string;
		video?: string;
		audio?: string;
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
			tokenId: token.tokenID ?? '',
			attributes: token.tokenMetadata?.attributes ?? [],
			image: token.tokenMetadata?.image,
			name: token.tokenMetadata?.name ?? '',
			description: token.tokenMetadata?.description,
			video: token.tokenMetadata?.video,
			audio: token.tokenMetadata?.audio,
		},
		contractInfo: token.contractInfo,
		contractType: token.contractType as unknown as
			| ContractType.ERC1155
			| ContractType.ERC721,
		balance: token.balance,
	};
}

async function fetchIndexerTokens(
	chainId: number,
	accountAddress: Address,
	collectionAddress: Address,
	config: SdkConfig,
	isLaos721: boolean,
): Promise<{ collectibles: CollectibleWithBalance[] }> {
	const queryClient = getQueryClient();
	const balances = await queryClient.fetchQuery(
		tokenBalancesOptions(
			{
				collectionAddress,
				userAddress: accountAddress,
				chainId,
				isLaos721,
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
	const { accountAddress, collectionAddress, chainId, isLaos721 } = args;
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
		isLaos721,
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
					isLaos721: args.isLaos721 ?? false,
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
