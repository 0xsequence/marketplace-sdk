import { getQueryClient } from "./api-BoO0V5aJ.js";
import { MetadataStatus } from "./marketplace.gen-ksUafDqS.js";
import { compareAddress } from "./utils-BfpDVibN.js";
import { fetchMarketplaceConfig } from "./marketplaceConfig-UHQMM9fq.js";
import { tokenBalancesOptions } from "./tokenBalances-ibDerNmM.js";
import { queryOptions } from "@tanstack/react-query";

//#region src/react/queries/inventory/inventory.ts
function collectibleFromTokenBalance(token) {
	return {
		metadata: {
			tokenId: token.tokenID ?? "",
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
		balance: token.balance
	};
}
async function fetchIndexerTokens(chainId, accountAddress, collectionAddress, config, isLaos721) {
	return { collectibles: (await getQueryClient().fetchQuery(tokenBalancesOptions({
		collectionAddress,
		userAddress: accountAddress,
		chainId,
		isLaos721,
		includeMetadata: true
	}, config))).map((balance) => collectibleFromTokenBalance(balance)) };
}
async function fetchInventory(args, config, page) {
	const { accountAddress, collectionAddress, chainId, isLaos721 } = args;
	const isTradable = ((await fetchMarketplaceConfig({ config }))?.market.collections || []).some((collection) => compareAddress(collection.itemsAddress, collectionAddress));
	const { collectibles } = await fetchIndexerTokens(chainId, accountAddress, collectionAddress, config, isLaos721);
	return {
		collectibles,
		page: {
			page: page.page,
			pageSize: page.pageSize
		},
		isTradable
	};
}
function inventoryOptions(args, config) {
	const enabled = (args.query?.enabled ?? true) && !!args.accountAddress && !!args.collectionAddress;
	return queryOptions({
		queryKey: [
			"inventory",
			args.accountAddress,
			args.collectionAddress,
			args.chainId,
			args.query?.page ?? 1,
			args.query?.pageSize ?? 30
		],
		queryFn: () => fetchInventory({
			...args,
			isLaos721: args.isLaos721 ?? false
		}, config, {
			page: args.query?.page ?? 1,
			pageSize: args.query?.pageSize ?? 30
		}),
		enabled
	});
}

//#endregion
export { fetchInventory, inventoryOptions };
//# sourceMappingURL=inventory-Dd7TazvZ.js.map