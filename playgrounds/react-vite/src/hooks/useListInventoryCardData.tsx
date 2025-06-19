import type {
	CollectibleCardAction,
	CollectibleOrder,
	ContractType,
	Order,
	OrderbookKind,
	TokenMetadata,
} from '@0xsequence/marketplace-sdk';
import { useInventory, useSellModal } from '@0xsequence/marketplace-sdk/react';
import { useMemo } from 'react';
import type { Address } from 'viem';
import { useAccount } from 'wagmi';

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

	const {
		data: inventoryData,
		isLoading: inventoryIsLoading,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		error: inventoryError,
		isSuccess,
	} = useInventory({
		// biome-ignore lint/style/noNonNullAssertion: accountAddress is required for the inventory query
		accountAddress: accountAddress!,
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

	const collectibleCards = useMemo(() => {
		return allCollectibles.map((collectible: InventoryCollectible) => {
			const cardProps = {
				collectibleId: collectible.metadata.tokenId,
				chainId,
				collectionAddress,
				collectionType,
				cardLoading: inventoryIsLoading,
				marketplaceType: 'market',
				orderbookKind,
				collectible,
				onCollectibleClick,
				balance: collectible.balance,
				balanceIsLoading: false,
				onCannotPerformAction,
				prioritizeOwnerActions: true,
				assetSrcPrefixUrl,
				onOfferClick: ({
					order,
				}: {
					order?: Order;
					e: React.MouseEvent<HTMLButtonElement>;
				}) => {
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
		isSuccess,
	};
}
