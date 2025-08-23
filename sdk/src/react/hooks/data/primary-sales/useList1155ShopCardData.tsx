import type { Address } from 'viem';
import { useReadContract } from 'wagmi';
import {
	ContractType,
	type PrimarySaleItem,
	type TokenMetadata,
} from '../../../_internal';
import type { ShopCollectibleCardProps } from '../../../ui/components/marketplace-collectible-card/types';
import { useSalesContractABI } from '../../contracts/useSalesContractABI';
import { useCollection } from '../collections/useCollection';

interface UseList1155ShopCardDataProps {
	primarySaleItemsWithMetadata: Array<{
		metadata: TokenMetadata;
		primarySaleItem: PrimarySaleItem;
	}>;
	chainId: number;
	contractAddress: Address;
	salesContractAddress: Address;
	enabled?: boolean;
}

/**
 * Prepares shop card data for ERC1155 primary sale items
 *
 * This hook transforms primary sale items with metadata into props suitable
 * for shop collectible cards. It enriches the data with collection information,
 * payment token details, and formats sale data for display.
 *
 * @param params - Configuration for shop card data generation
 * @param params.primarySaleItemsWithMetadata - Array of sale items with metadata
 * @param params.chainId - The blockchain network ID
 * @param params.contractAddress - The ERC1155 collection contract address
 * @param params.salesContractAddress - The primary sales contract address
 * @param params.enabled - Whether to enable data fetching (default: true)
 *
 * @returns Shop card data and loading states
 * @returns returns.collectibleCards - Array of props for shop collectible cards
 * @returns returns.tokenMetadataError - Always null (for compatibility)
 * @returns returns.tokenSaleDetailsError - Always null (for compatibility)
 * @returns returns.isLoading - True while fetching collection or payment data
 *
 * @example
 * Basic usage with primary sale items:
 * ```typescript
 * const { collectibleCards, isLoading } = useList1155ShopCardData({
 *   primarySaleItemsWithMetadata: saleItems,
 *   chainId: 137,
 *   contractAddress: '0x...collection',
 *   salesContractAddress: '0x...sales'
 * });
 *
 * return (
 *   <div className="shop-grid">
 *     {collectibleCards.map((cardProps) => (
 *       <ShopCollectibleCard
 *         key={cardProps.collectibleId}
 *         {...cardProps}
 *       />
 *     ))}
 *   </div>
 * );
 * ```
 *
 * @example
 * With conditional rendering:
 * ```typescript
 * const { data: saleItems } = useListPrimarySaleItems({
 *   chainId,
 *   primarySaleContractAddress: salesContract
 * });
 *
 * const { collectibleCards, isLoading } = useList1155ShopCardData({
 *   primarySaleItemsWithMetadata: saleItems || [],
 *   chainId,
 *   contractAddress: collectionAddress,
 *   salesContractAddress: salesContract,
 *   enabled: !!saleItems && saleItems.length > 0
 * });
 *
 * if (isLoading) return <CardSkeletons count={4} />;
 *
 * // Display cards with sale information
 * collectibleCards.forEach(card => {
 *   console.log(`Token ${card.collectibleId}:`);
 *   console.log(`Price: ${card.salePrice.amount}`);
 *   console.log(`Supply: ${card.unlimitedSupply ? 'Unlimited' : card.quantityRemaining}`);
 * });
 * ```
 *
 * @remarks
 * - Automatically detects the sales contract ABI version
 * - Fetches payment token from contract if not specified in sale data
 * - Handles both limited and unlimited supply configurations
 * - Includes sale timing information (start/end dates)
 * - The `quantityDecimals` comes from the collection's decimals
 * - All cards have `marketplaceType: 'shop'` for proper display
 *
 * @see {@link ShopCollectibleCardProps} - The card props type generated
 * @see {@link useSalesContractABI} - For detecting contract version
 * @see {@link useCollection} - For fetching collection details
 */
export function useList1155ShopCardData({
	primarySaleItemsWithMetadata,
	chainId,
	contractAddress,
	salesContractAddress,
	enabled = true,
}: UseList1155ShopCardDataProps) {
	const { abi, isLoading: versionLoading } = useSalesContractABI({
		contractAddress: salesContractAddress,
		contractType: ContractType.ERC1155,
		chainId,
		enabled,
	});

	const { data: collection, isLoading: collectionLoading } = useCollection({
		chainId,
		collectionAddress: contractAddress,
	});

	const { data: paymentToken, isLoading: paymentTokenLoading } =
		useReadContract({
			chainId,
			address: salesContractAddress,
			abi: abi || [],
			functionName: 'paymentToken',
			query: {
				enabled: enabled && !versionLoading && !!abi,
			},
		});

	const isLoading = collectionLoading || paymentTokenLoading;

	const collectibleCards = primarySaleItemsWithMetadata.map((item) => {
		const { metadata, primarySaleItem: saleData } = item;

		const salePrice = {
			amount: saleData?.priceAmount?.toString() || '',
			currencyAddress: (saleData?.currencyAddress ||
				paymentToken ||
				'0x') as Address,
		};

		const supply = saleData?.supply?.toString();
		const unlimitedSupply = saleData?.unlimitedSupply;

		return {
			collectibleId: metadata.tokenId,
			chainId,
			collectionAddress: contractAddress,
			collectionType: ContractType.ERC1155,
			tokenMetadata: metadata,
			cardLoading: isLoading,
			salesContractAddress: salesContractAddress,
			salePrice,
			quantityInitial: supply,
			quantityDecimals: collection?.decimals || 0,
			quantityRemaining: supply,
			unlimitedSupply,
			saleStartsAt: saleData?.startDate?.toString(),
			saleEndsAt: saleData?.endDate?.toString(),
			marketplaceType: 'shop',
		} satisfies ShopCollectibleCardProps;
	});

	return {
		collectibleCards,
		tokenMetadataError: null,
		tokenSaleDetailsError: null,
		isLoading,
	};
}
