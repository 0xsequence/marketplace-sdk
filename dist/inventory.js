import { f as MetadataStatus, t as ContractType } from "./dist.js";
import { c as findMarketCollection } from "./utils.js";
import { g as getQueryClient } from "./api.js";
import { r as buildQueryOptions } from "./_internal.js";
import { r as tokenBalancesOptions } from "./token-balances.js";
import { t as fetchMarketplaceConfig } from "./config.js";
import { isAddress } from "viem";

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
	const { chainId, userAddress, collectionAddress, config } = params;
	return { collectibles: (await getQueryClient().fetchQuery(tokenBalancesOptions({
		collectionAddress,
		userAddress,
		chainId,
		includeMetadata: true,
		config
	}))).filter((balance) => isCollectibleContractType(balance.contractType)).map((balance) => collectibleFromTokenBalance(balance)) };
}
async function fetchInventory(params) {
	const { userAddress, collectionAddress, chainId, config, page = 1, pageSize = 30 } = params;
	const isTradable = !!findMarketCollection((await fetchMarketplaceConfig({ config }))?.market.collections || [], collectionAddress, chainId);
	const { collectibles } = await fetchIndexerTokens({
		chainId,
		userAddress,
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
		params.userAddress,
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
			"userAddress",
			"collectionAddress",
			"chainId",
			"config"
		],
		fetcher: fetchInventory,
		customValidation: (p) => !!p.collectionAddress && isAddress(p.collectionAddress)
	}, params);
}

//#endregion
export { getInventoryQueryKey as n, inventoryOptions as r, fetchInventory as t };
//# sourceMappingURL=inventory.js.map