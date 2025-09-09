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

/**
 * Detects and retrieves the appropriate ABI for a sales contract
 *
 * This hook automatically determines whether a sales contract uses V0 or V1 ABI
 * by attempting to call contract methods. It first tries V1, and falls back to V0
 * if V1 fails. This is useful for interacting with sales contracts deployed at
 * different times with different ABI versions.
 *
 * @param params - Configuration for ABI detection
 * @param params.contractAddress - The sales contract address to check
 * @param params.contractType - The collection contract type (ERC721 or ERC1155)
 * @param params.chainId - The blockchain network ID
 * @param params.enabled - Whether to enable the detection (default: true)
 *
 * @returns Sales contract ABI information with discriminated union types
 * @returns returns.version - The detected version (V0, V1, or null if loading/error)
 * @returns returns.abi - The appropriate ABI for the detected version
 * @returns returns.contractType - The contract type (ERC721/ERC1155) when successful
 * @returns returns.isLoading - True while detecting the ABI version
 * @returns returns.error - Error if both V0 and V1 detection fail
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { abi, version, isLoading } = useSalesContractABI({
 *   contractAddress: '0x...',
 *   contractType: ContractType.ERC721,
 *   chainId: 137
 * });
 *
 * if (isLoading) return <div>Detecting contract version...</div>;
 *
 * console.log(`Using ${version} ABI`);
 * ```
 *
 * @example
 * Using with contract interactions:
 * ```typescript
 * const { abi, version, error } = useSalesContractABI({
 *   contractAddress: salesContract,
 *   contractType: ContractType.ERC1155,
 *   chainId: 1,
 *   enabled: !!salesContract
 * });
 *
 * const { data: saleDetails } = useReadContract({
 *   address: salesContract,
 *   abi: abi,
 *   functionName: 'tokenSaleDetails',
 *   args: [tokenId],
 *   enabled: !!abi && !error
 * });
 * ```
 *
 * @remarks
 * - The hook uses a discriminated union return type for type safety
 * - Detection works by calling `saleDetails` (ERC721) or `tokenSaleDetails` (ERC1155)
 * - V1 is attempted first, V0 is only tried if V1 fails
 * - Both read attempts have retry disabled for faster detection
 *
 * @see {@link SalesContractVersion} - Enum for version values
 * @see {@link ContractType} - Enum for ERC721/ERC1155 types
 */
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
