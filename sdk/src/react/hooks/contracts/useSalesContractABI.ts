import { useMemo } from 'react';
import type { Address } from 'viem';
import { useReadContract } from 'wagmi';
import {
	ERC721_SALE_ABI_V0,
	ERC721_SALE_ABI_V1,
	ERC1155_SALES_CONTRACT_ABI_V0,
	ERC1155_SALES_CONTRACT_ABI_V1,
} from '../../../utils/abi';
import { ContractType } from '../../_internal';

export enum SalesContractVersion {
	V0 = 'v0',
	V1 = 'v1',
}

interface UseSalesContractABIProps {
	contractAddress: Address;
	contractType: ContractType.ERC721 | ContractType.ERC1155;
	chainId: number;
	enabled?: boolean;
}

interface UseSalesContractABIResult {
	version: SalesContractVersion | null;
	abi:
		| typeof ERC721_SALE_ABI_V0
		| typeof ERC721_SALE_ABI_V1
		| typeof ERC1155_SALES_CONTRACT_ABI_V0
		| typeof ERC1155_SALES_CONTRACT_ABI_V1
		| null;
	isLoading: boolean;
	error: Error | null;
}

export function useSalesContractABI({
	contractAddress,
	contractType,
	chainId,
	enabled = true,
}: UseSalesContractABIProps): UseSalesContractABIResult {
	const functionName =
		contractType === ContractType.ERC721 ? 'saleDetails' : 'tokenSaleDetails';

	const {
		data: v1Data,
		isLoading: v1Loading,
		error: v1Error,
	} = useReadContract({
		address: contractAddress,
		abi:
			contractType === ContractType.ERC721
				? ERC721_SALE_ABI_V1
				: ERC1155_SALES_CONTRACT_ABI_V1,
		functionName,
		args: contractType === ContractType.ERC1155 ? [0n] : undefined,
		chainId,
		query: {
			enabled,
			retry: false,
		},
	});

	// If V1 fails, try with V0 ABI, see enabled query
	const {
		data: v0Data,
		isLoading: v0Loading,
		error: v0Error,
	} = useReadContract({
		address: contractAddress,
		abi:
			contractType === ContractType.ERC721
				? ERC721_SALE_ABI_V0
				: ERC1155_SALES_CONTRACT_ABI_V0,
		functionName,
		args: contractType === ContractType.ERC1155 ? [0n] : undefined,
		chainId,
		query: {
			enabled: enabled && !!v1Error && !v1Loading, // Only try V0 if V1 failed
			retry: false,
		},
	});

	return useMemo(() => {
		if (v1Loading || (v1Error && v0Loading)) {
			return {
				version: null,
				abi: null,
				isLoading: true,
				error: null,
			};
		}

		if (v1Data && !v1Error) {
			return {
				version: SalesContractVersion.V1,
				abi:
					contractType === ContractType.ERC721
						? ERC721_SALE_ABI_V1
						: ERC1155_SALES_CONTRACT_ABI_V1,
				isLoading: false,
				error: null,
			};
		}

		if (v0Data && !v0Error) {
			return {
				version: SalesContractVersion.V0,
				abi:
					contractType === ContractType.ERC721
						? ERC721_SALE_ABI_V0
						: ERC1155_SALES_CONTRACT_ABI_V0,
				isLoading: false,
				error: null,
			};
		}

		const error = v0Error || v1Error;
		return {
			version: null,
			abi: null,
			isLoading: false,
			error: error as Error,
		};
	}, [v1Data, v1Error, v1Loading, v0Data, v0Error, v0Loading, contractType]);
}
