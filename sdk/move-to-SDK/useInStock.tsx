// @ts-nocheck
import { useMemo } from 'react';

import type { Address } from 'viem';
import { useReadContracts } from 'wagmi';
import { SEQUENCE_1155_ITEMS_ABI } from './abi/sequence-1155-items';
import { ERC1155_SALES_CONTRACT_ABI } from './abi/sequence-1155-sales-contract';

export interface UseIsInStockProps {
	contractAddress: Address;
	tokenId: bigint;
	chainId?: number;
	enabled?: boolean;
}

interface SaleDetails {
	cost: bigint;
	supplyCap: bigint;
	startTime: bigint;
	endTime: bigint;
	merkleRoot: `0x${string}`;
}

export function useIsInStock({
	contractAddress,
	tokenId,
	chainId,
	enabled = true,
}: UseIsInStockProps) {
	const { data, isLoading, error } = useReadContracts({
		contracts: [
			{
				address: contractAddress,
				abi: ERC1155_SALES_CONTRACT_ABI,
				functionName: 'tokenSaleDetails',
				args: [tokenId],
				chainId,
			},
			{
				address: contractAddress,
				abi: ERC1155_SALES_CONTRACT_ABI,
				functionName: 'globalSaleDetails',
				chainId,
			},
			{
				address: contractAddress,
				abi: SEQUENCE_1155_ITEMS_ABI,
				functionName: 'tokenSupply',
				args: [tokenId],
				chainId,
			},
		],
		query: {
			enabled,
		},
	});

	const result = useMemo(() => {
		if (isLoading || !data) {
			return { isInStock: undefined, isLoading, error };
		}

		try {
			const [tokenSaleDetailsResponse, globalSaleDetailsResponse, tokenSupply] =
				data;
			const now = BigInt(Math.floor(Date.now() / 1000));

			let saleDetails: SaleDetails | null = null;

			if (tokenSaleDetailsResponse.supplyCap > 0n) {
				saleDetails = tokenSaleDetailsResponse;
			}
			// Fall back to global sale details
			else {
				saleDetails = globalSaleDetailsResponse;
			}

			if (!saleDetails) {
				return { isInStock: false, isLoading: false, error: null };
			}

			const isTimeActive =
				now >= saleDetails.startTime && now <= saleDetails.endTime;

			const hasSupply =
				typeof tokenSupply === 'bigint' &&
				saleDetails.supplyCap > 0n &&
				tokenSupply < saleDetails.supplyCap;

			return {
				isInStock: isTimeActive && hasSupply,
				isLoading: false,
				error: null,
				tokenSaleDetails: tokenSaleDetailsResponse,
				globalSaleDetails: globalSaleDetailsResponse,
				tokenSupply,
			};
		} catch (err) {
			return {
				isInStock: false,
				isLoading: false,
				error: err instanceof Error ? err : new Error(String(err)),
			};
		}
	}, [data, isLoading, error]);

	return result;
}
