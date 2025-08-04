import type { TokenMetadata as SequenceTokenMetadata } from '@0xsequence/metadata';
import type { Address } from 'viem';
import { useReadContract } from 'wagmi';
import { ERC721_SALE_ABI } from '../../../../utils/abi/primary-sale/sequence-721-sales-contract';
import { ContractType } from '../../../_internal';
import type {
	Asset,
	TokenMetadata,
} from '../../../_internal/api/marketplace.gen';
import type { ShopCollectibleCardProps } from '../../../ui';
import { useFilterState } from '../../ui/useFilterState';
import { useListPrimarySaleItems } from '../primary-sales/useListPrimarySaleItems';
import { useSearchMintedTokenMetadata } from '../tokens/useSearchMintedTokenMetadata';

interface UseList721ShopCardDataProps {
	tokenIds: string[];
	chainId: number;
	contractAddress: Address;
	salesContractAddress: Address;
	enabled?: boolean;
}

export function useList721ShopCardData({
	tokenIds,
	chainId,
	contractAddress,
	salesContractAddress,
	enabled = true,
}: UseList721ShopCardDataProps) {
	const { showListedOnly } = useFilterState();

	const {
		data: primarySaleItems,
		isLoading: primarySaleItemsLoading,
		error: primarySaleItemsError,
	} = useListPrimarySaleItems({
		chainId,
		primarySaleContractAddress: salesContractAddress,
		filter: {
			includeEmpty: !showListedOnly,
		},
	});

	// Check if we have minted tokens by looking at the first available token ID
	const firstAvailableTokenId =
		primarySaleItems?.pages[0]?.primarySaleItems[0]?.primarySaleItem.tokenId?.toString();
	const hasMintedTokens: boolean =
		Boolean(firstAvailableTokenId) && Number(firstAvailableTokenId) > 0;

	// Fetch metadata for minted tokens
	const { data: mintedTokensMetadata, isLoading: mintedTokensMetadataLoading } =
		useSearchMintedTokenMetadata({
			chainId,
			collectionAddress: contractAddress,
			query: {
				enabled: enabled && hasMintedTokens,
			},
		});

	// For ERC721, we'll fetch the sale details directly from the contract
	const {
		data: saleDetails,
		isLoading: saleDetailsLoading,
		error: saleDetailsError,
	} = useReadContract({
		chainId,
		address: salesContractAddress,
		abi: ERC721_SALE_ABI,
		functionName: 'saleDetails',
		query: {
			enabled,
		},
	});

	const isLoading =
		saleDetailsLoading ||
		primarySaleItemsLoading ||
		mintedTokensMetadataLoading;

	// Create a map of token metadata from minted tokens
	const mintedTokensMetadataMap = new Map<string, SequenceTokenMetadata>();
	if (mintedTokensMetadata?.tokenMetadata) {
		for (const metadata of mintedTokensMetadata.tokenMetadata) {
			mintedTokensMetadataMap.set(metadata.tokenId, metadata);
		}
	}

	const collectibleCards = tokenIds.map((tokenId) => {
		const minted =
			hasMintedTokens && Number(tokenId) < Number(firstAvailableTokenId);

		const matchingPrimarySaleItem = primarySaleItems?.pages
			.find((item) =>
				item.primarySaleItems.find(
					(primarySaleItem) =>
						primarySaleItem.primarySaleItem.tokenId?.toString() === tokenId,
				),
			)
			?.primarySaleItems.find(
				(primarySaleItem) =>
					primarySaleItem.primarySaleItem.tokenId?.toString() === tokenId,
			);

		const saleData = matchingPrimarySaleItem?.primarySaleItem;
		let tokenMetadata = matchingPrimarySaleItem?.metadata;

		// If token is minted, prefer metadata from mintedTokensMetadata
		if (minted && mintedTokensMetadataMap.has(tokenId)) {
			const sequenceMetadata = mintedTokensMetadataMap.get(tokenId);
			// Transform sequence metadata to marketplace metadata format
			if (sequenceMetadata) {
				const transformedAssets = sequenceMetadata.assets?.reduce<Asset[]>(
					(acc, asset) => {
						// Only include assets that have required fields
						if (asset.tokenId) {
							acc.push({
								id: asset.id,
								collectionId: asset.collectionId,
								tokenId: asset.tokenId,
								url: asset.url || '',
								metadataField: asset.metadataField,
								name: asset.name || '',
								filesize: asset.filesize || 0,
								mimeType: asset.mimeType || '',
								width: asset.width || 0,
								height: asset.height || 0,
								updatedAt: asset.updatedAt || '',
							});
						}
						return acc;
					},
					[],
				);

				tokenMetadata = {
					tokenId: sequenceMetadata.tokenId,
					name: sequenceMetadata.name,
					description: sequenceMetadata.description || '',
					image: sequenceMetadata.image || '',
					video: sequenceMetadata.video || '',
					audio: sequenceMetadata.audio || '',
					properties: sequenceMetadata.properties || {},
					attributes: sequenceMetadata.attributes || [],
					image_data: sequenceMetadata.image_data || '',
					external_url: sequenceMetadata.external_url || '',
					background_color: sequenceMetadata.background_color || '',
					animation_url: sequenceMetadata.animation_url || '',
					decimals: sequenceMetadata.decimals || 0,
					updatedAt: sequenceMetadata.updatedAt || '',
					assets: transformedAssets,
				} as TokenMetadata;
			}
		}

		// Ensure we have a valid TokenMetadata
		if (!tokenMetadata) {
			tokenMetadata = {
				tokenId: tokenId,
				name: '',
				description: '',
				image: '',
				video: '',
				audio: '',
				properties: {},
				attributes: [],
				image_data: '',
				external_url: '',
				background_color: '',
				animation_url: '',
				decimals: 0,
				updatedAt: '',
				assets: [],
			};
		}

		const salePrice = saleData
			? {
					amount: saleData.priceAmount?.toString() || '',
					currencyAddress: saleData.currencyAddress as Address,
				}
			: {
					amount: saleDetails?.cost?.toString() || '',
					currencyAddress: saleDetails?.paymentToken ?? ('0x' as Address),
				};

		const quantityInitial =
			saleData?.supply?.toString() ??
			(saleDetails?.supplyCap ? saleDetails.supplyCap.toString() : undefined);

		const quantityRemaining = minted ? undefined : '1';

		const saleStartsAt =
			saleData?.startDate?.toString() ?? saleDetails?.startTime?.toString();

		const saleEndsAt =
			saleData?.endDate?.toString() ?? saleDetails?.endTime?.toString();

		return {
			collectibleId: tokenId,
			chainId,
			collectionAddress: contractAddress,
			collectionType: ContractType.ERC721,
			tokenMetadata,
			cardLoading: isLoading,
			salesContractAddress: salesContractAddress,
			salePrice,
			quantityInitial,
			quantityRemaining,
			quantityDecimals: 0,
			saleStartsAt,
			saleEndsAt,
			marketplaceType: 'shop',
		} satisfies ShopCollectibleCardProps;
	});

	return {
		salePrice: collectibleCards[0]?.salePrice,
		collectibleCards,
		saleDetailsError,
		primarySaleItemsError,
		saleDetails,
		primarySaleItems,
		isLoading,
	};
}
