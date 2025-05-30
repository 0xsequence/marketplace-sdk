import { useQuery } from '@tanstack/react-query';
import { getUnixTime } from 'date-fns';
import type { Address } from 'viem';
import { useReadContracts } from 'wagmi';
import { ERC1155_SALES_CONTRACT_ABI } from '../..';
import { getIndexerClient } from '../_internal';
import { useConfig } from './useConfig';

interface useTokenSaleDetailsBatch {
	tokenIds: string[];
	salesContractAddress: Address;
	collectionAddress: Address;
	chainId: number;
	query?: {
		enabled?: boolean;
	};
}

export function useTokenSaleDetailsBatch({
	tokenIds,
	salesContractAddress,
	chainId,
	collectionAddress,
	query,
}: useTokenSaleDetailsBatch) {
	const config = useConfig();
	const indexerClient = getIndexerClient(chainId, config);

	const getReadContractsArgs = (tokenIds: string[]) =>
		tokenIds.map((tokenId) => ({
			address: salesContractAddress,
			abi: ERC1155_SALES_CONTRACT_ABI,
			functionName: 'tokenSaleDetails',
			args: [tokenId],
			chainId,
		}));

	const {
		data: tokenSaleDetails,
		isLoading: tokenSaleDetailsLoading,
		error: tokenSaleDetailsError,
	} = useReadContracts({
		batchSize: 500_000, // Node gateway limit has a limit of 512kB, setting it to 500kB to be safe
		contracts: getReadContractsArgs(tokenIds),
		query: {
			enabled: query?.enabled,
		},
	});

	// Query token supplies individually using the indexer client:
	/*
	This way, if token 4 isn't minted, we can still get the supply information for tokens 0-3, and just treat token 4's supply as 0 (unminted). 
	The problem is essentially that one unminted token was poisoning the entire response when querying all tokens at once.
	*/
	const {
		data: tokenSupplies,
		isLoading: tokenSuppliesLoading,
		error: tokenSuppliesError,
	} = useQuery({
		queryKey: ['token-supplies-batch', chainId, collectionAddress, tokenIds],
		queryFn: async () => {
			const supplies = await Promise.all(
				tokenIds.map(async (tokenId) => {
					try {
						const result = await indexerClient.getTokenSuppliesMap({
							tokenMap: {
								[collectionAddress]: [tokenId],
							},
							includeMetadata: false,
						});
						const supply = result.supplies?.[collectionAddress]?.find(
							(s) => s.tokenID === tokenId,
						);
						return {
							tokenId,
							supply: supply ? Number(supply.supply) : 0,
							error: null,
						};
					} catch (error) {
						return {
							tokenId,
							supply: 0,
							error,
						};
					}
				}),
			);
			return supplies;
		},
		enabled: query?.enabled,
	});

	const extendedSupplyData = (tokenSaleDetails || [])
		.map((data, index) => ({
			...data,
			tokenId: tokenIds[index],
		}))
		.filter((data) => data.status === 'success')
		.filter((data) => {
			if (typeof data.result !== 'object') return false;
			const now = BigInt(getUnixTime(new Date()));
			return data.result.endTime > now && data.result.startTime < now;
		});

	const getInitialSupply = (tokenId: string): number | undefined => {
		const found = extendedSupplyData.find((data) => data.tokenId === tokenId);
		if (!found || typeof found.result !== 'object' || found.result === null)
			return undefined;
		const supply = found.result.supplyCap;
		if (supply === undefined) return undefined;
		// https://github.com/0xsequence/contracts-library/blob/ead1baf34270c76260d01cfc130bb7cc9d57518e/src/tokens/ERC1155/utility/sale/IERC1155Sale.sol#L8
		// 0 means infinite
		if (supply === 0n) return Number.POSITIVE_INFINITY;
		return Number(supply);
	};

	const getRemainingSupply = (tokenId: string): number | undefined => {
		const initialSupply = getInitialSupply(tokenId);
		if (!initialSupply) return undefined;

		const supplyData = tokenSupplies?.find((s) => s.tokenId === tokenId);
		if (!supplyData || supplyData.error) return initialSupply; // If no supply data or error, assume nothing is minted

		return initialSupply - supplyData.supply;
	};

	return {
		extendedSupplyData,
		getInitialSupply,
		getRemainingSupply,
		loading: tokenSuppliesLoading || tokenSaleDetailsLoading,
		error: tokenSuppliesError || tokenSaleDetailsError,
	};
}
