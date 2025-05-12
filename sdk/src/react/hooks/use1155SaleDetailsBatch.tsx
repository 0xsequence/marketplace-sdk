import { getUnixTime } from 'date-fns';
import type { Address } from 'viem';
import { useReadContracts } from 'wagmi';
import { ERC1155_SALES_CONTRACT_ABI } from '../..';

interface useTokenSaleDetailsBatch {
	tokenIds: string[];
	salesContractAddress: Address;
	chainId: number;
}

export function useTokenSaleDetailsBatch({
	tokenIds,
	salesContractAddress,
	chainId,
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
		data: supplyData,
		isLoading: supplyDataLoading,
		error: supplyDataError,
	} = useReadContracts({
		batchSize: 500_000, // Node gateway limit has a limit of 512kB, setting it to 500kB to be safe
		contracts: getReadContractsArgs(tokenIds),
	});

	console.log('supplyData', supplyData);

	const extendedSupplyData = (supplyData || [])
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

	const getSupply = (tokenId: string): number | undefined => {
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

	return {
		extendedSupplyData,
		getSupply,
		supplyDataLoading,
		supplyDataError,
	};
}
