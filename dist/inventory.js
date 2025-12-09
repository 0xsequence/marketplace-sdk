import { l as compareAddress } from "./utils.js";
import { l as getQueryClient } from "./api.js";
import { n as ContractType, o as MetadataStatus, y as buildQueryOptions } from "./_internal.js";
import { r as tokenBalancesOptions } from "./token-balances.js";
import { t as fetchMarketplaceConfig } from "./config.js";

//#region src/react/queries/inventory/inventory.ts
/**
* Validates if a contract type is a valid collectible type (ERC721 or ERC1155)
*/
function isCollectibleContractType(contractType) {
	return contractType === ContractType.ERC721 || contractType === ContractType.ERC1155;
}
/**
* Transforms an Indexer token balance into a collectible with metadata
* @throws Error if token is not a valid collectible type (ERC721/ERC1155)
*/
function collectibleFromTokenBalance(token) {
	if (!isCollectibleContractType(token.contractType)) throw new Error(`Invalid collectible type: ${token.contractType}. Only ERC721 and ERC1155 tokens are supported.`);
	return {
		metadata: {
			tokenId: token.tokenId ?? 0n,
			attributes: token.tokenMetadata?.attributes ?? [],
			image: token.tokenMetadata?.image,
			name: token.tokenMetadata?.name ?? "",
			description: token.tokenMetadata?.description,
			video: token.tokenMetadata?.video,
			audio: token.tokenMetadata?.audio,
			status: MetadataStatus.AVAILABLE
		},
		contractInfo: token.contractInfo,
		contractType: token.contractType,
		balance: token.balance.toString()
	};
}
async function fetchIndexerTokens(params) {
	const { chainId, accountAddress, collectionAddress, config } = params;
	return { collectibles: (await getQueryClient().fetchQuery(tokenBalancesOptions({
		collectionAddress,
		userAddress: accountAddress,
		chainId,
		includeMetadata: true,
		config
	}))).map((balance) => collectibleFromTokenBalance(balance)) };
}
async function fetchInventory(params) {
	const { accountAddress, collectionAddress, chainId, config, page = 1, pageSize = 30 } = params;
	const isTradable = ((await fetchMarketplaceConfig({ config }))?.market.collections || []).some((collection) => compareAddress(collection.itemsAddress, collectionAddress));
	const { collectibles } = await fetchIndexerTokens({
		chainId,
		accountAddress,
		collectionAddress,
		config
	});
	return {
		collectibles,
		page: {
			page,
			pageSize
		},
		isTradable
	};
}
function getInventoryQueryKey(params) {
	return [
		"inventory",
		params.accountAddress,
		params.collectionAddress,
		params.chainId,
		params.page ?? 1,
		params.pageSize ?? 30
	];
}
function inventoryOptions(params) {
	return buildQueryOptions({
		getQueryKey: getInventoryQueryKey,
		requiredParams: [
			"accountAddress",
			"collectionAddress",
			"chainId",
			"config"
		],
		fetcher: fetchInventory
	}, params);
}

//#endregion
export { getInventoryQueryKey as n, inventoryOptions as r, fetchInventory as t };
//# sourceMappingURL=inventory.js.map