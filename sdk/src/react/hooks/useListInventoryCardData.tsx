import { useMemo } from 'react';

import type { Address } from 'viem';
import { useAccount } from 'wagmi';
import type {
	CollectibleCardAction,
	ContractType,
	OrderbookKind,
} from '../../types';
import type { CollectibleOrder, TokenMetadata } from '../_internal';
import type { MarketCollectibleCardProps } from '../ui/components/marketplace-collectible-card/types';
import { useSellModal } from '../ui/modals/SellModal';
import { useInventory } from './useInventory';

interface InventoryCollectible extends Omit<CollectibleOrder, 'metadata'> {
	metadata: TokenMetadata;
	balance: string;
}

interface UseListInventoryCardDataProps {
	collectionAddress: Address;
	chainId: number;
	orderbookKind: OrderbookKind;
	collectionType: ContractType;
	onCollectibleClick?: (tokenId: string) => void;
	onCannotPerformAction?: (action: CollectibleCardAction) => void;
	prioritizeOwnerActions?: boolean;
	assetSrcPrefixUrl?: string;
}

export function useListInventoryCardData({
	collectionAddress,
	chainId,
	orderbookKind,
	collectionType,
	onCollectibleClick,
	onCannotPerformAction,
	assetSrcPrefixUrl,
}: UseListInventoryCardDataProps) {
	const { address: accountAddress } = useAccount();
	const { show: showSellModal } = useSellModal();

	// Get user's owned collectibles from this collection
	const {
		data: inventoryData,
		isLoading: inventoryIsLoading,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		error: inventoryError,
	} = useInventory({
		accountAddress: accountAddress as Address,
		collectionAddress,
		chainId,
		query: {
			enabled: !!accountAddress && !!collectionAddress && !!chainId,
		},
	});

	// Flatten all collectibles from all pages
	const allCollectibles = useMemo(() => {
		if (!inventoryData?.pages) return [];
		return inventoryData.pages.flatMap((page) => page.collectibles);
	}, [inventoryData?.pages]);

	// Generate card props for each collectible
	const collectibleCards = useMemo(() => {
		return allCollectibles.map((collectible: InventoryCollectible) => {
			const cardProps: MarketCollectibleCardProps = {
				collectibleId: collectible.metadata.tokenId,
				chainId,
				collectionAddress,
				collectionType,
				cardLoading: inventoryIsLoading,
				marketplaceType: 'market',
				orderbookKind,
				collectible,
				onCollectibleClick,
				// Use the balance from the collectible
				balance: collectible.balance,
				balanceIsLoading: false,
				onCannotPerformAction,
				prioritizeOwnerActions: true,
				assetSrcPrefixUrl,
				onOfferClick: ({ order }) => {
					if (!accountAddress) return;

					if (order) {
						showSellModal({
							chainId,
							collectionAddress,
							tokenId: collectible.metadata.tokenId,
							order,
						});
					}
				},
			};

			return cardProps;
		});
	}, [
		allCollectibles,
		chainId,
		collectionAddress,
		collectionType,
		inventoryIsLoading,
		orderbookKind,
		onCollectibleClick,
		onCannotPerformAction,
		assetSrcPrefixUrl,
		accountAddress,
		showSellModal,
	]);

	return {
		collectibleCards,
		isLoading: inventoryIsLoading,
		error: inventoryError,
		hasNextPage,
		isFetchingNextPage,
		fetchNextPage,
		allCollectibles,
	};
}
