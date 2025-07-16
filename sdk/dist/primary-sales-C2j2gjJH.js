import { getIndexerClient } from "./api-BiMGqWdz.js";
import { ContractType, OrderSide } from "./marketplace.gen-HpnpL5xU.js";
import { ERC1155_SALES_CONTRACT_ABI, ERC721_SALE_ABI } from "./primary-sale-CmWxSfFQ.js";
import { ERC721_ABI, SEQUENCE_1155_ITEMS_ABI } from "./token-CHSBPYVG.js";
import { useConfig } from "./useConfig-UcRv5hCZ.js";
import { useListCollectibles } from "./useListCollectibles-BhLFdV3h.js";
import { useCollection } from "./useCollection-BOzP0IuM.js";
import { countOfPrimarySaleItemsOptions, listPrimarySaleItemsQueryOptions, primarySaleItemsCountQueryOptions } from "./queries-BJK6b9SM.js";
import { useTokenSupplies } from "./useTokenSupplies-Bdy2sCPJ.js";
import { useFilterState } from "./useFilterState-DeJNZfWb.js";
import { useReadContract, useReadContracts } from "wagmi";
import { useMemo } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getUnixTime } from "date-fns";

//#region src/react/hooks/data/primary-sales/useCountOfPrimarySaleItems.tsx
function useCountOfPrimarySaleItems(args) {
	const config = useConfig();
	return useQuery(countOfPrimarySaleItemsOptions(args, config));
}

//#endregion
//#region src/react/hooks/data/primary-sales/useERC721SaleMintedTokens.tsx
function useERC721SaleMintedTokens({ chainId, contractAddress, salesContractAddress, tokenIds, enabled = true }) {
	const { data: saleDetails, isLoading: saleDetailsLoading, error: saleDetailsError } = useReadContract({
		chainId,
		address: salesContractAddress,
		abi: ERC721_SALE_ABI,
		functionName: "saleDetails",
		query: { enabled }
	});
	const { data: tokenSupplies, isLoading: tokenSuppliesLoading } = useTokenSupplies({
		chainId,
		collectionAddress: contractAddress
	});
	const isLoading = saleDetailsLoading || tokenSuppliesLoading;
	const ownedCount = tokenIds.reduce((count, tokenId) => {
		let supply;
		if (tokenSupplies) supply = tokenSupplies.tokenIDs.find((s) => s.tokenID === tokenId);
		const hasOwner = supply ? BigInt(supply.supply) > 0n : false;
		return count + (hasOwner ? 1 : 0);
	}, 0);
	const totalSupplyCap = saleDetails?.supplyCap ? Number(saleDetails.supplyCap) : 0;
	const remainingCount = Math.max(0, totalSupplyCap - ownedCount);
	return {
		ownedCount,
		totalSupplyCap,
		remainingCount,
		isLoading,
		error: saleDetailsError,
		saleDetails
	};
}

//#endregion
//#region src/react/hooks/data/primary-sales/useGetCountOfPrimarySaleItems.tsx
/**
* Hook to get the total count of primary sale items
*
* Retrieves the total count of primary sale items for a specific contract address
* from the marketplace.
*
* @param params - Configuration parameters
* @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
* @param params.primarySaleContractAddress - The primary sale contract address
* @param params.filter - Optional filter parameters for the query
* @param params.query - Optional React Query configuration
*
* @returns Query result containing the count of primary sale items
*
* @example
* ```typescript
* const { data: count, isLoading } = useGetCountOfPrimarySaleItems({
*   chainId: 137,
*   primarySaleContractAddress: '0x...',
* })
* ```
*/
function useGetCountOfPrimarySaleItems(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig,...rest } = params;
	const queryOptions$1 = primarySaleItemsCountQueryOptions({
		config,
		...rest
	});
	return useQuery(queryOptions$1);
}

//#endregion
//#region src/react/hooks/data/primary-sales/useListPrimarySaleItems.tsx
/**
* Hook to fetch primary sale items with pagination support
*
* Retrieves a paginated list of primary sale items for a specific contract address
* from the marketplace.
*
* @param params - Configuration parameters
* @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
* @param params.primarySaleContractAddress - The primary sale contract address
* @param params.filter - Optional filter parameters for the query
* @param params.page - Optional pagination parameters
* @param params.query - Optional React Query configuration
*
* @returns Infinite query result containing the primary sale items data
*
* @example
* Basic usage:
* ```typescript
* const { data, isLoading } = useListPrimarySaleItems({
*   chainId: 137,
*   primarySaleContractAddress: '0x...',
* })
* ```
*
* @example
* With filters and pagination:
* ```typescript
* const { data, isLoading } = useListPrimarySaleItems({
*   chainId: 1,
*   primarySaleContractAddress: '0x...',
*   filter: { status: 'active' },
*   page: { page: 1, pageSize: 20 },
*   query: {
*     enabled: isReady
*   }
* })
* ```
*/
function useListPrimarySaleItems(params) {
	const defaultConfig = useConfig();
	const { config = defaultConfig,...rest } = params;
	const queryOptions$1 = listPrimarySaleItemsQueryOptions({
		config,
		...rest
	});
	return useInfiniteQuery(queryOptions$1);
}

//#endregion
//#region src/react/hooks/data/primary-sales/useList721ShopCardData.tsx
function useList721ShopCardData({ tokenIds, chainId, contractAddress, salesContractAddress, enabled = true }) {
	const { showListedOnly } = useFilterState();
	const { data: primarySaleItems, isLoading: primarySaleItemsLoading, error: primarySaleItemsError } = useListPrimarySaleItems({
		chainId,
		primarySaleContractAddress: salesContractAddress,
		filter: { includeEmpty: !showListedOnly }
	});
	const firstAvailableTokenId = primarySaleItems?.pages[0]?.primarySaleItems[0]?.primarySaleItem.tokenId?.toString();
	const hasMintedTokens = Boolean(firstAvailableTokenId) && Number(firstAvailableTokenId) > 0;
	const { data: mintedTokensMetadata, isLoading: mintedTokensMetadataLoading } = useListCollectibles({
		chainId,
		collectionAddress: contractAddress,
		side: OrderSide.listing,
		filter: { includeEmpty: true },
		query: { enabled: enabled && hasMintedTokens }
	});
	const { data: saleDetails, isLoading: saleDetailsLoading, error: saleDetailsError } = useReadContract({
		chainId,
		address: salesContractAddress,
		abi: ERC721_SALE_ABI,
		functionName: "saleDetails",
		query: { enabled }
	});
	const isLoading = saleDetailsLoading || primarySaleItemsLoading || mintedTokensMetadataLoading;
	const mintedTokensMetadataMap = /* @__PURE__ */ new Map();
	for (const page of mintedTokensMetadata?.pages ?? []) for (const collectible of page.collectibles) mintedTokensMetadataMap.set(collectible.metadata.tokenId, collectible.metadata);
	const collectibleCards = tokenIds.map((tokenId) => {
		const minted = hasMintedTokens && Number(tokenId) < Number(firstAvailableTokenId);
		const matchingPrimarySaleItem = primarySaleItems?.pages.find((item) => item.primarySaleItems.find((primarySaleItem) => primarySaleItem.primarySaleItem.tokenId?.toString() === tokenId))?.primarySaleItems.find((primarySaleItem) => primarySaleItem.primarySaleItem.tokenId?.toString() === tokenId);
		const saleData = matchingPrimarySaleItem?.primarySaleItem;
		let tokenMetadata = matchingPrimarySaleItem?.metadata;
		if (minted && mintedTokensMetadataMap.has(tokenId)) tokenMetadata = mintedTokensMetadataMap.get(tokenId);
		tokenMetadata = tokenMetadata || {};
		const salePrice = saleData ? {
			amount: saleData.priceAmount?.toString() || "",
			currencyAddress: saleData.currencyAddress
		} : {
			amount: saleDetails?.cost?.toString() || "",
			currencyAddress: saleDetails?.paymentToken ?? "0x"
		};
		const quantityInitial = saleData?.supply?.toString() ?? (saleDetails?.supplyCap ? saleDetails.supplyCap.toString() : void 0);
		const quantityRemaining = minted ? void 0 : "1";
		const saleStartsAt = saleData?.startDate?.toString() ?? saleDetails?.startTime?.toString();
		const saleEndsAt = saleData?.endDate?.toString() ?? saleDetails?.endTime?.toString();
		return {
			collectibleId: tokenId,
			chainId,
			collectionAddress: contractAddress,
			collectionType: ContractType.ERC721,
			tokenMetadata,
			cardLoading: isLoading,
			salesContractAddress,
			salePrice,
			quantityInitial,
			quantityRemaining,
			quantityDecimals: 0,
			saleStartsAt,
			saleEndsAt,
			marketplaceType: "shop"
		};
	});
	return {
		salePrice: collectibleCards[0]?.salePrice,
		collectibleCards,
		saleDetailsError,
		primarySaleItemsError,
		saleDetails,
		primarySaleItems,
		isLoading
	};
}

//#endregion
//#region src/react/hooks/data/primary-sales/useList1155SaleSupplies.tsx
function useList1155SaleSupplies({ tokenIds, salesContractAddress }) {
	const getReadContractsArgs = (tokenIds$1) => tokenIds$1.map((tokenId) => ({
		address: salesContractAddress,
		abi: ERC1155_SALES_CONTRACT_ABI,
		functionName: "tokenSaleDetails",
		args: [tokenId]
	}));
	const { data: supplyData, isLoading: supplyDataLoading, error: supplyDataError } = useReadContracts({
		batchSize: 5e5,
		contracts: getReadContractsArgs(tokenIds)
	});
	const extendedSupplyData = (supplyData || []).map((data, index) => ({
		...data,
		tokenId: tokenIds[index]
	})).filter((data) => data.status === "success").filter((data) => {
		if (typeof data.result !== "object") return false;
		const now = BigInt(getUnixTime(/* @__PURE__ */ new Date()));
		return data.result.endTime > now && data.result.startTime < now;
	});
	const getSupply = (tokenId) => {
		const found = extendedSupplyData.find((data) => data.tokenId === tokenId);
		if (!found || typeof found.result !== "object" || found.result === null) return void 0;
		const supply = found.result.supplyCap;
		if (supply === void 0) return void 0;
		if (supply === 0n) return Number.POSITIVE_INFINITY;
		return Number(supply);
	};
	return {
		extendedSupplyData,
		getSupply,
		supplyDataLoading,
		supplyDataError
	};
}

//#endregion
//#region src/react/hooks/data/primary-sales/useList1155ShopCardData.tsx
function useList1155ShopCardData({ tokenIds, chainId, contractAddress, salesContractAddress, enabled = true }) {
	const { showListedOnly } = useFilterState();
	const { data: primarySaleItems, isLoading: primarySaleItemsLoading, error: primarySaleItemsError } = useListPrimarySaleItems({
		chainId,
		primarySaleContractAddress: salesContractAddress,
		filter: { includeEmpty: !showListedOnly }
	});
	const { data: collection, isLoading: collectionLoading } = useCollection({
		chainId,
		collectionAddress: contractAddress
	});
	const { data: paymentToken, isLoading: paymentTokenLoading } = useReadContract({
		chainId,
		address: salesContractAddress,
		abi: ERC1155_SALES_CONTRACT_ABI,
		functionName: "paymentToken",
		query: { enabled }
	});
	const isLoading = primarySaleItemsLoading || collectionLoading || paymentTokenLoading;
	const allPrimarySaleItems = primarySaleItems?.pages.flatMap((page) => page.primarySaleItems) ?? [];
	const collectibleCards = tokenIds.map((tokenId) => {
		const matchingPrimarySaleItem = allPrimarySaleItems.find((item) => item.primarySaleItem.tokenId?.toString() === tokenId);
		const saleData = matchingPrimarySaleItem?.primarySaleItem;
		const tokenMetadata = matchingPrimarySaleItem?.metadata || {};
		const salePrice = {
			amount: saleData?.priceAmount?.toString() || "",
			currencyAddress: saleData?.currencyAddress || paymentToken || "0x"
		};
		const supply = saleData?.supply?.toString();
		const unlimitedSupply = saleData?.unlimitedSupply;
		return {
			collectibleId: tokenId,
			chainId,
			collectionAddress: contractAddress,
			collectionType: ContractType.ERC1155,
			tokenMetadata,
			cardLoading: isLoading,
			salesContractAddress,
			salePrice,
			quantityInitial: supply,
			quantityDecimals: collection?.decimals || 0,
			quantityRemaining: supply,
			unlimitedSupply,
			saleStartsAt: saleData?.startDate?.toString(),
			saleEndsAt: saleData?.endDate?.toString(),
			marketplaceType: "shop"
		};
	});
	return {
		collectibleCards,
		tokenMetadataError: primarySaleItemsError,
		tokenSaleDetailsError: null,
		isLoading
	};
}

//#endregion
//#region src/react/hooks/data/primary-sales/useListShopCardData.tsx
function useListShopCardData({ tokenIds, chainId, contractAddress, salesContractAddress, contractType, enabled = true }) {
	const shouldUse721 = contractType === ContractType.ERC721;
	const shouldUse1155 = contractType === ContractType.ERC1155;
	const erc721Data = useList721ShopCardData({
		tokenIds,
		chainId,
		contractAddress,
		salesContractAddress,
		enabled: enabled && shouldUse721
	});
	const erc1155Data = useList1155ShopCardData({
		tokenIds,
		chainId,
		contractAddress,
		salesContractAddress,
		enabled: enabled && shouldUse1155
	});
	if (shouldUse721) return erc721Data;
	if (shouldUse1155) return {
		collectibleCards: erc1155Data.collectibleCards,
		isLoading: erc1155Data.isLoading,
		saleDetailsError: erc1155Data.tokenSaleDetailsError,
		primarySaleItemsError: erc1155Data.tokenMetadataError,
		saleDetails: void 0,
		primarySaleItems: void 0,
		salePrice: erc1155Data.collectibleCards[0]?.salePrice
	};
	return {
		collectibleCards: [],
		isLoading: !contractType,
		collectionDetailsError: null,
		saleDetailsError: null,
		primarySaleItemsError: null,
		saleDetails: void 0,
		primarySaleItems: void 0,
		salePrice: void 0
	};
}

//#endregion
//#region src/react/hooks/data/primary-sales/useShopCollectibleSaleData.tsx
function useShopCollectibleSaleData({ chainId, salesContractAddress, itemsContractAddress, tokenId, collectionType, enabled = true }) {
	const { data: erc721SaleDetails, isLoading: erc721SaleLoading, error: erc721SaleError } = useReadContract({
		chainId,
		address: salesContractAddress,
		abi: ERC721_SALE_ABI,
		functionName: "saleDetails",
		query: { enabled: enabled && collectionType === ContractType.ERC721 }
	});
	const { data: erc721TotalSupply, isLoading: erc721SupplyLoading, error: erc721SupplyError } = useReadContract({
		chainId,
		address: itemsContractAddress,
		abi: ERC721_ABI,
		functionName: "totalSupply",
		query: { enabled: enabled && collectionType === ContractType.ERC721 }
	});
	const { data: erc1155TokenSaleDetails, isLoading: erc1155TokenSaleLoading, error: erc1155TokenSaleError } = useReadContract({
		chainId,
		address: salesContractAddress,
		abi: ERC1155_SALES_CONTRACT_ABI,
		functionName: "tokenSaleDetails",
		args: collectionType === ContractType.ERC1155 ? [BigInt(tokenId)] : void 0,
		query: { enabled: enabled && collectionType === ContractType.ERC1155 }
	});
	const { data: erc1155GlobalSaleDetails, isLoading: erc1155GlobalSaleLoading, error: erc1155GlobalSaleError } = useReadContract({
		chainId,
		address: salesContractAddress,
		abi: ERC1155_SALES_CONTRACT_ABI,
		functionName: "globalSaleDetails",
		query: { enabled: enabled && collectionType === ContractType.ERC1155 }
	});
	const { data: erc1155PaymentToken, isLoading: erc1155PaymentTokenLoading, error: erc1155PaymentTokenError } = useReadContract({
		chainId,
		address: salesContractAddress,
		abi: ERC1155_SALES_CONTRACT_ABI,
		functionName: "paymentToken",
		query: { enabled: enabled && collectionType === ContractType.ERC1155 }
	});
	const { data: erc1155TotalSupply, isLoading: erc1155SupplyLoading, error: erc1155SupplyError } = useReadContract({
		chainId,
		address: itemsContractAddress,
		abi: SEQUENCE_1155_ITEMS_ABI,
		functionName: "totalSupply",
		query: { enabled: enabled && collectionType === ContractType.ERC1155 }
	});
	return useMemo(() => {
		const isLoading = collectionType === ContractType.ERC721 ? erc721SaleLoading || erc721SupplyLoading : erc1155TokenSaleLoading || erc1155GlobalSaleLoading || erc1155PaymentTokenLoading || erc1155SupplyLoading;
		const error = collectionType === ContractType.ERC721 ? erc721SaleError || erc721SupplyError : erc1155TokenSaleError || erc1155GlobalSaleError || erc1155PaymentTokenError || erc1155SupplyError;
		if (isLoading) return {
			salePrice: null,
			paymentToken: null,
			supplyCap: "0",
			totalMinted: "0",
			quantityRemaining: "0",
			startTime: null,
			endTime: null,
			isActive: false,
			isLoading: true,
			error: null,
			isAvailable: false
		};
		if (error) return {
			salePrice: null,
			paymentToken: null,
			supplyCap: "0",
			totalMinted: "0",
			quantityRemaining: "0",
			startTime: null,
			endTime: null,
			isActive: false,
			isLoading: false,
			error,
			isAvailable: false
		};
		if (collectionType === ContractType.ERC721 && erc721SaleDetails && erc721TotalSupply !== void 0) {
			const saleDetails = erc721SaleDetails;
			const supplyCap = saleDetails.supplyCap.toString();
			const totalMinted = erc721TotalSupply.toString();
			const quantityRemaining = (saleDetails.supplyCap - erc721TotalSupply).toString();
			const now = Math.floor(Date.now() / 1e3);
			const startTime = Number(saleDetails.startTime);
			const endTime = Number(saleDetails.endTime);
			const isActive = now >= startTime && now <= endTime;
			return {
				salePrice: {
					amount: saleDetails.cost.toString(),
					currencyAddress: saleDetails.paymentToken
				},
				paymentToken: saleDetails.paymentToken,
				supplyCap,
				totalMinted,
				quantityRemaining,
				startTime,
				endTime,
				isActive,
				isLoading: false,
				error: null,
				isAvailable: BigInt(quantityRemaining) > 0 && isActive
			};
		}
		if (collectionType === ContractType.ERC1155 && erc1155PaymentToken && erc1155TotalSupply !== void 0 && (erc1155TokenSaleDetails || erc1155GlobalSaleDetails)) {
			const tokenSaleDetails = erc1155TokenSaleDetails;
			const globalSaleDetails = erc1155GlobalSaleDetails;
			const useGlobal = tokenSaleDetails && tokenSaleDetails.supplyCap === 0n;
			const finalSaleDetails = useGlobal ? globalSaleDetails : tokenSaleDetails || globalSaleDetails;
			if (!finalSaleDetails) return {
				salePrice: null,
				paymentToken: null,
				supplyCap: "0",
				totalMinted: "0",
				quantityRemaining: "0",
				startTime: null,
				endTime: null,
				isActive: false,
				isLoading: false,
				error: null,
				isAvailable: false
			};
			const supplyCap = finalSaleDetails.supplyCap.toString();
			const totalMintedBigInt = erc1155TotalSupply ? BigInt(erc1155TotalSupply) : 0n;
			const totalMinted = totalMintedBigInt.toString();
			const quantityRemaining = (finalSaleDetails.supplyCap - totalMintedBigInt).toString();
			const now = Math.floor(Date.now() / 1e3);
			const startTime = Number(finalSaleDetails.startTime);
			const endTime = Number(finalSaleDetails.endTime);
			const isActive = now >= startTime && now <= endTime;
			return {
				salePrice: {
					amount: finalSaleDetails.cost.toString(),
					currencyAddress: erc1155PaymentToken
				},
				paymentToken: erc1155PaymentToken,
				supplyCap,
				totalMinted,
				quantityRemaining,
				startTime,
				endTime,
				isActive,
				isLoading: false,
				error: null,
				isAvailable: BigInt(quantityRemaining) > 0 && isActive
			};
		}
		return {
			salePrice: null,
			paymentToken: null,
			supplyCap: "0",
			totalMinted: "0",
			quantityRemaining: "0",
			startTime: null,
			endTime: null,
			isActive: false,
			isLoading: false,
			error: null,
			isAvailable: false
		};
	}, [
		collectionType,
		erc721SaleDetails,
		erc721TotalSupply,
		erc721SaleLoading,
		erc721SupplyLoading,
		erc721SaleError,
		erc721SupplyError,
		erc1155TokenSaleDetails,
		erc1155GlobalSaleDetails,
		erc1155PaymentToken,
		erc1155TotalSupply,
		erc1155TokenSaleLoading,
		erc1155GlobalSaleLoading,
		erc1155PaymentTokenLoading,
		erc1155SupplyLoading,
		erc1155TokenSaleError,
		erc1155GlobalSaleError,
		erc1155PaymentTokenError,
		erc1155SupplyError
	]);
}

//#endregion
//#region src/react/hooks/data/primary-sales/useTokenSaleDetailsBatch.tsx
function useTokenSaleDetailsBatch({ tokenIds, salesContractAddress, chainId, collectionAddress, query }) {
	const config = useConfig();
	const indexerClient = getIndexerClient(chainId, config);
	const getReadContractsArgs = (tokenIds$1) => tokenIds$1.map((tokenId) => ({
		address: salesContractAddress,
		abi: ERC1155_SALES_CONTRACT_ABI,
		functionName: "tokenSaleDetails",
		args: [tokenId],
		chainId
	}));
	const { data: tokenSaleDetails, isLoading: tokenSaleDetailsLoading, error: tokenSaleDetailsError } = useReadContracts({
		batchSize: 5e5,
		contracts: getReadContractsArgs(tokenIds),
		query: { enabled: query?.enabled }
	});
	const { data: tokenSupplies, isLoading: tokenSuppliesLoading, error: tokenSuppliesError } = useQuery({
		queryKey: [
			"token-supplies-batch",
			chainId,
			collectionAddress,
			tokenIds
		],
		queryFn: async () => {
			const supplies = await Promise.all(tokenIds.map(async (tokenId) => {
				try {
					const result = await indexerClient.getTokenSupplies({
						contractAddress: collectionAddress,
						includeMetadata: false
					});
					const supply = result.tokenIDs?.find((s) => s.tokenID === tokenId);
					return {
						tokenId,
						supply: supply ? Number(supply.supply) : 0,
						error: null
					};
				} catch (error) {
					return {
						tokenId,
						supply: 0,
						error
					};
				}
			}));
			return supplies;
		},
		enabled: query?.enabled
	});
	const extendedSupplyData = (tokenSaleDetails || []).map((data, index) => ({
		...data,
		tokenId: tokenIds[index]
	})).filter((data) => data.status === "success").filter((data) => {
		if (typeof data.result !== "object") return false;
		const now = BigInt(getUnixTime(/* @__PURE__ */ new Date()));
		return data.result.endTime > now && data.result.startTime < now;
	});
	const getInitialSupply = (tokenId) => {
		const found = extendedSupplyData.find((data) => data.tokenId === tokenId);
		if (!found || typeof found.result !== "object" || found.result === null) return void 0;
		const supply = found.result.supplyCap;
		if (supply === void 0) return void 0;
		if (supply === 0n) return Number.POSITIVE_INFINITY;
		return Number(supply);
	};
	const getRemainingSupply = (tokenId) => {
		const initialSupply = getInitialSupply(tokenId);
		if (!initialSupply) return void 0;
		const supplyData = tokenSupplies?.find((s) => s.tokenId === tokenId);
		if (!supplyData || supplyData.error) return initialSupply;
		return initialSupply - supplyData.supply;
	};
	return {
		extendedSupplyData,
		getInitialSupply,
		getRemainingSupply,
		loading: tokenSuppliesLoading || tokenSaleDetailsLoading,
		error: tokenSuppliesError || tokenSaleDetailsError
	};
}

//#endregion
export { useCountOfPrimarySaleItems, useERC721SaleMintedTokens, useGetCountOfPrimarySaleItems, useList1155SaleSupplies, useList1155ShopCardData, useList721ShopCardData, useListPrimarySaleItems, useListShopCardData, useShopCollectibleSaleData, useTokenSaleDetailsBatch };
//# sourceMappingURL=primary-sales-C2j2gjJH.js.map