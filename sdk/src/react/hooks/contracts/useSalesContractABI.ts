import { ContractType } from '@0xsequence/api-client';
import { useMemo } from 'react';
import type { Address } from 'viem';
import { useReadContract } from 'wagmi';
import {
	ERC721_SALE_ABI_V0,
	ERC721_SALE_ABI_V1,
	ERC1155_SALES_CONTRACT_ABI_V0,
	ERC1155_SALES_CONTRACT_ABI_V1,
} from '../../../utils/abi';

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

type UseSalesContractABIResult =
	| {
			version: null;
			abi: null;
			contractType: null;
			isLoading: true;
			error: null;
	  }
	| {
			version: SalesContractVersion.V0;
			abi: typeof ERC721_SALE_ABI_V0;
			contractType: ContractType.ERC721;
			isLoading: false;
			error: null;
	  }
	| {
			version: SalesContractVersion.V0;
			abi: typeof ERC1155_SALES_CONTRACT_ABI_V0;
			contractType: ContractType.ERC1155;
			isLoading: false;
			error: null;
	  }
	| {
			version: SalesContractVersion.V1;
			abi: typeof ERC721_SALE_ABI_V1;
			contractType: ContractType.ERC721;
			isLoading: false;
			error: null;
	  }
	| {
			version: SalesContractVersion.V1;
			abi: typeof ERC1155_SALES_CONTRACT_ABI_V1;
			contractType: ContractType.ERC1155;
			isLoading: false;
			error: null;
	  }
	| {
			version: null;
			abi: null;
			contractType: null;
			isLoading: false;
			error: Error;
	  };

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
				contractType: null,
				isLoading: true,
				error: null,
			};
		}

		if (v1Data && !v1Error) {
			if (contractType === ContractType.ERC721) {
				return {
					version: SalesContractVersion.V1,
					abi: ERC721_SALE_ABI_V1,
					contractType: ContractType.ERC721,
					isLoading: false,
					error: null,
				};
			}
			return {
				version: SalesContractVersion.V1,
				abi: ERC1155_SALES_CONTRACT_ABI_V1,
				contractType: ContractType.ERC1155,
				isLoading: false,
				error: null,
			};
		}

		if (v0Data && !v0Error) {
			if (contractType === ContractType.ERC721) {
				return {
					version: SalesContractVersion.V0,
					abi: ERC721_SALE_ABI_V0,
					contractType: ContractType.ERC721,
					isLoading: false,
					error: null,
				};
			}
			return {
				version: SalesContractVersion.V0,
				abi: ERC1155_SALES_CONTRACT_ABI_V0,
				contractType: ContractType.ERC1155,
				isLoading: false,
				error: null,
			};
		}

		const error = v0Error || v1Error;
		return {
			version: null,
			abi: null,
			contractType: null,
			isLoading: false,
			error: error as Error,
		};
	}, [v1Data, v1Error, v1Loading, v0Data, v0Error, v0Loading, contractType]);
}
