import { useMemo } from 'react';

import type { Address } from 'viem';
import { useReadContract } from 'wagmi';
import {
	ERC721_ABI,
	ERC721_SALE_ABI,
	ERC1155_ITEMS_ABI,
	ERC1155_SALES_CONTRACT_ABI,
} from '../../utils';
import { ContractType } from '../_internal';

interface ShopCollectibleSaleData {
	salePrice: { amount: string; currencyAddress: Address } | null;
	paymentToken: Address | null;
	supplyCap: string;
	totalMinted: string;
	quantityRemaining: string;
	startTime: number | null;
	endTime: number | null;
	isActive: boolean;
	isLoading: boolean;
	error: Error | null;
	isAvailable: boolean;
}

interface BaseShopCollectibleSaleDataProps {
	chainId: number;
	salesContractAddress: Address;
	itemsContractAddress: Address;
	enabled?: boolean;
}

interface ERC721ShopCollectibleSaleDataProps
	extends BaseShopCollectibleSaleDataProps {
	collectionType: ContractType.ERC721;
	tokenId?: string;
}

interface ERC1155ShopCollectibleSaleDataProps
	extends BaseShopCollectibleSaleDataProps {
	collectionType: ContractType.ERC1155;
	tokenId: string;
}

type UseShopCollectibleSaleDataProps =
	| ERC721ShopCollectibleSaleDataProps
	| ERC1155ShopCollectibleSaleDataProps;

export function useShopCollectibleSaleData({
	chainId,
	salesContractAddress,
	itemsContractAddress,
	tokenId,
	collectionType,
	enabled = true,
}: UseShopCollectibleSaleDataProps): ShopCollectibleSaleData {
	// ERC721 Sales Contract Calls
	const {
		data: erc721SaleDetails,
		isLoading: erc721SaleLoading,
		error: erc721SaleError,
	} = useReadContract({
		chainId,
		address: salesContractAddress,
		abi: ERC721_SALE_ABI,
		functionName: 'saleDetails',
		query: {
			enabled: enabled && collectionType === ContractType.ERC721,
		},
	});

	const {
		data: erc721TotalSupply,
		isLoading: erc721SupplyLoading,
		error: erc721SupplyError,
	} = useReadContract({
		chainId,
		address: itemsContractAddress,
		abi: ERC721_ABI,
		functionName: 'totalSupply',
		query: {
			enabled: enabled && collectionType === ContractType.ERC721,
		},
	});

	// ERC1155 Sales Contract Calls
	const {
		data: erc1155TokenSaleDetails,
		isLoading: erc1155TokenSaleLoading,
		error: erc1155TokenSaleError,
	} = useReadContract({
		chainId,
		address: salesContractAddress,
		abi: ERC1155_SALES_CONTRACT_ABI,
		functionName: 'tokenSaleDetails',
		args:
			collectionType === ContractType.ERC1155 ? [BigInt(tokenId)] : undefined,
		query: {
			enabled: enabled && collectionType === ContractType.ERC1155,
		},
	});

	const {
		data: erc1155GlobalSaleDetails,
		isLoading: erc1155GlobalSaleLoading,
		error: erc1155GlobalSaleError,
	} = useReadContract({
		chainId,
		address: salesContractAddress,
		abi: ERC1155_SALES_CONTRACT_ABI,
		functionName: 'globalSaleDetails',
		query: {
			enabled: enabled && collectionType === ContractType.ERC1155,
		},
	});

	const {
		data: erc1155PaymentToken,
		isLoading: erc1155PaymentTokenLoading,
		error: erc1155PaymentTokenError,
	} = useReadContract({
		chainId,
		address: salesContractAddress,
		abi: ERC1155_SALES_CONTRACT_ABI,
		functionName: 'paymentToken',
		query: {
			enabled: enabled && collectionType === ContractType.ERC1155,
		},
	});

	const {
		data: erc1155TotalSupply,
		isLoading: erc1155SupplyLoading,
		error: erc1155SupplyError,
	} = useReadContract({
		chainId,
		address: itemsContractAddress,
		abi: ERC1155_ITEMS_ABI,
		functionName: 'totalSupply',
		query: {
			enabled: enabled && collectionType === ContractType.ERC1155,
		},
	});

	return useMemo(() => {
		const isLoading =
			collectionType === ContractType.ERC721
				? erc721SaleLoading || erc721SupplyLoading
				: erc1155TokenSaleLoading ||
					erc1155GlobalSaleLoading ||
					erc1155PaymentTokenLoading ||
					erc1155SupplyLoading;

		const error =
			collectionType === ContractType.ERC721
				? erc721SaleError || erc721SupplyError
				: erc1155TokenSaleError ||
					erc1155GlobalSaleError ||
					erc1155PaymentTokenError ||
					erc1155SupplyError;

		if (isLoading) {
			return {
				salePrice: null,
				paymentToken: null,
				supplyCap: '0',
				totalMinted: '0',
				quantityRemaining: '0',
				startTime: null,
				endTime: null,
				isActive: false,
				isLoading: true,
				error: null,
				isAvailable: false,
			};
		}

		if (error) {
			return {
				salePrice: null,
				paymentToken: null,
				supplyCap: '0',
				totalMinted: '0',
				quantityRemaining: '0',
				startTime: null,
				endTime: null,
				isActive: false,
				isLoading: false,
				error: error as Error,
				isAvailable: false,
			};
		}

		if (
			collectionType === ContractType.ERC721 &&
			erc721SaleDetails &&
			erc721TotalSupply !== undefined
		) {
			const saleDetails = erc721SaleDetails as {
				supplyCap: bigint;
				cost: bigint;
				paymentToken: Address;
				startTime: bigint;
				endTime: bigint;
				merkleRoot: string;
			};

			const supplyCap = saleDetails.supplyCap.toString();
			const totalMinted = erc721TotalSupply.toString();
			const quantityRemaining = (
				saleDetails.supplyCap - erc721TotalSupply
			).toString();

			const now = Math.floor(Date.now() / 1000);
			const startTime = Number(saleDetails.startTime);
			const endTime = Number(saleDetails.endTime);
			const isActive = now >= startTime && now <= endTime;

			return {
				salePrice: {
					amount: saleDetails.cost.toString(),
					currencyAddress: saleDetails.paymentToken,
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
				isAvailable: BigInt(quantityRemaining) > 0 && isActive,
			};
		}

		if (
			collectionType === ContractType.ERC1155 &&
			erc1155PaymentToken &&
			erc1155TotalSupply !== undefined &&
			(erc1155TokenSaleDetails || erc1155GlobalSaleDetails)
		) {
			// Type the sale details structures
			type SaleDetails = {
				cost: bigint;
				supplyCap: bigint;
				startTime: bigint;
				endTime: bigint;
				merkleRoot: string;
			};

			const tokenSaleDetails = erc1155TokenSaleDetails as
				| SaleDetails
				| undefined;
			const globalSaleDetails = erc1155GlobalSaleDetails as
				| SaleDetails
				| undefined;

			// If token-specific details have zero values, use global as fallback
			const useGlobal = tokenSaleDetails && tokenSaleDetails.supplyCap === 0n;
			const finalSaleDetails = useGlobal
				? globalSaleDetails
				: tokenSaleDetails || globalSaleDetails;

			if (!finalSaleDetails) {
				return {
					salePrice: null,
					paymentToken: null,
					supplyCap: '0',
					totalMinted: '0',
					quantityRemaining: '0',
					startTime: null,
					endTime: null,
					isActive: false,
					isLoading: false,
					error: null,
					isAvailable: false,
				};
			}

			const supplyCap = finalSaleDetails.supplyCap.toString();
			const totalMintedBigInt = erc1155TotalSupply
				? BigInt(erc1155TotalSupply as bigint)
				: 0n;
			const totalMinted = totalMintedBigInt.toString();
			const quantityRemaining = (
				finalSaleDetails.supplyCap - totalMintedBigInt
			).toString();

			const now = Math.floor(Date.now() / 1000);
			const startTime = Number(finalSaleDetails.startTime);
			const endTime = Number(finalSaleDetails.endTime);
			const isActive = now >= startTime && now <= endTime;

			return {
				salePrice: {
					amount: finalSaleDetails.cost.toString(),
					currencyAddress: erc1155PaymentToken,
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
				isAvailable: BigInt(quantityRemaining) > 0 && isActive,
			};
		}

		// No valid data found
		return {
			salePrice: null,
			paymentToken: null,
			supplyCap: '0',
			totalMinted: '0',
			quantityRemaining: '0',
			startTime: null,
			endTime: null,
			isActive: false,
			isLoading: false,
			error: null,
			isAvailable: false,
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
		erc1155SupplyError,
	]);
}
