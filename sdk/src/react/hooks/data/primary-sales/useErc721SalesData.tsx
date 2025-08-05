import type { Address } from 'viem';
import { useReadContract } from 'wagmi';
import {
	ERC721_ABI,
	ERC721_SALE_ABI_V0,
	ERC721_SALE_ABI_V1,
} from '../../../../utils';
import { ContractType } from '../../../_internal';
import {
	SalesContractVersion,
	useSalesContractABI,
} from '../../contracts/useSalesContractABI';

interface UseErc721CollectionDataProps {
	chainId: number;
	salesContractAddress: Address;
	itemsContractAddress: Address;
	enabled: boolean;
}

export function useErc721SaleDetails({
	chainId,
	salesContractAddress,
	itemsContractAddress,
	enabled,
}: UseErc721CollectionDataProps) {
	const {
		version,
		isLoading: versionLoading,
		error: versionError,
	} = useSalesContractABI({
		contractAddress: salesContractAddress,
		contractType: ContractType.ERC721,
		chainId,
		enabled,
	});

	const {
		saleDetails: saleDetailsV0,
		quantityMinted: quantityMintedV0,
		quantityTotal: quantityTotalV0,
		quantityRemaining: quantityRemainingV0,
		isLoading: saleDetailsLoadingV0,
		error: saleDetailsErrorV0,
	} = useErc721SaleDetailsV0({
		chainId,
		salesContractAddress,
		itemsContractAddress,
		enabled: enabled && !versionLoading && version === SalesContractVersion.V0,
	});

	const {
		saleDetails: saleDetailsV1,
		quantityMinted: quantityMintedV1,
		quantityTotal: quantityTotalV1,
		quantityRemaining: quantityRemainingV1,
		isLoading: saleDetailsLoadingV1,
		error: saleDetailsErrorV1,
	} = useErc721SaleDetailsV1({
		chainId,
		salesContractAddress,
		itemsContractAddress,
		enabled: enabled && !versionLoading && version === SalesContractVersion.V1,
	});

	const saleDetails = saleDetailsV0 || saleDetailsV1;
	const quantityMinted = quantityMintedV0 || quantityMintedV1;
	const quantityTotal = quantityTotalV0 || quantityTotalV1;
	const quantityRemaining = quantityRemainingV0 || quantityRemainingV1;

	return {
		saleDetails,
		quantityMinted,
		quantityTotal,
		quantityRemaining,
		isLoading: versionLoading || saleDetailsLoadingV0 || saleDetailsLoadingV1,
		error: versionError || saleDetailsErrorV0 || saleDetailsErrorV1,
	};
}

const useErc721SaleDetailsV0 = ({
	chainId,
	salesContractAddress,
	itemsContractAddress,
	enabled,
}: UseErc721CollectionDataProps) => {
	const {
		data: saleDetails,
		isLoading: saleDetailsLoading,
		error: saleDetailsError,
	} = useReadContract({
		chainId,
		address: salesContractAddress,
		abi: ERC721_SALE_ABI_V0,
		functionName: 'saleDetails',
		query: {
			enabled,
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
			enabled,
		},
	});

	const supplyCap = saleDetails?.supplyCap;
	const totalMinted = erc721TotalSupply;
	let quantityRemaining: bigint | undefined;
	if (supplyCap && totalMinted) {
		quantityRemaining = supplyCap - totalMinted;
	}

	return {
		saleDetails,
		quantityMinted: erc721TotalSupply,
		quantityTotal: supplyCap,
		quantityRemaining,
		isLoading: saleDetailsLoading || erc721SupplyLoading,
		error: saleDetailsError || erc721SupplyError,
	};
};

const useErc721SaleDetailsV1 = ({
	chainId,
	salesContractAddress,
	itemsContractAddress,
	enabled,
}: UseErc721CollectionDataProps) => {
	const {
		data: saleDetails,
		isLoading: saleDetailsLoading,
		error: saleDetailsError,
	} = useReadContract({
		chainId,
		address: salesContractAddress,
		abi: ERC721_SALE_ABI_V1,
		functionName: 'saleDetails',
		query: {
			enabled,
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
			enabled,
		},
	});

	let quantityRemaining: bigint | undefined;
	if (saleDetails?.remainingSupply && erc721TotalSupply) {
		quantityRemaining = saleDetails.remainingSupply - erc721TotalSupply;
	}

	let quantityTotal: bigint | undefined;
	if (saleDetails?.remainingSupply && erc721TotalSupply) {
		quantityTotal = erc721TotalSupply + saleDetails.remainingSupply;
	}

	return {
		saleDetails,
		quantityMinted: erc721TotalSupply,
		quantityTotal,
		quantityRemaining,
		isLoading: saleDetailsLoading || erc721SupplyLoading,
		error: saleDetailsError || erc721SupplyError,
	};
};
