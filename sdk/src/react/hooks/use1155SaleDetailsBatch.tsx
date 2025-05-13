import { getUnixTime } from 'date-fns';
import type { Address } from 'viem';
import { useReadContracts } from 'wagmi';
import { ERC1155_SALES_CONTRACT_ABI } from '../..';

import { useQuery } from '@tanstack/react-query';
import { getIndexerClient } from '../_internal';
import { useConfig } from './useConfig';

interface useTokenSaleDetailsBatch {
	tokenIds: string[];
	salesContractAddress: Address;
	collectionAddress: Address;
	chainId: number;
}

export function useTokenSaleDetailsBatch({
	tokenIds,
	salesContractAddress,
	chainId,
	collectionAddress,
}: useTokenSaleDetailsBatch) {
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
	});

	const config = useConfig();
	const indexerClient = getIndexerClient(chainId, config);
	const {
		data: indexerTokenSupplies,
		isLoading: tokenSuppliesLoading,
		error: tokenSuppliesError,
	} = useQuery({
		queryKey: ['indexer-tokenSupplies', tokenIds, collectionAddress, chainId],
		queryFn: () => {
			return indexerClient.getTokenSuppliesMap({
				tokenMap: {
					[collectionAddress]: tokenIds,
				},
				includeMetadata: false,
			});
		},
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
		if (!indexerTokenSupplies) return undefined;
		const initialSupply = getInitialSupply(tokenId);
		if (!initialSupply) return undefined;
		const supplies = indexerTokenSupplies.supplies[collectionAddress];
		const supply = supplies.find((supply) => supply.tokenID === tokenId);
		if (!supply) return undefined;
		return initialSupply - Number(supply.supply);
	};

	return {
		extendedSupplyData,
		getInitialSupply,
		getRemainingSupply,
		loading: tokenSuppliesLoading || tokenSaleDetailsLoading,
		error: tokenSuppliesError || tokenSaleDetailsError,
	};
}
