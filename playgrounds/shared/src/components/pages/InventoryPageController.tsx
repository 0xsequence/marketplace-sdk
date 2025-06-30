import { NetworkImage, Text } from '@0xsequence/design-system';
import {
	type CollectibleCardAction,
	type CollectibleOrder,
	ContractType,
	getNetwork,
	type Order,
	OrderbookKind,
	type TokenMetadata,
} from '@0xsequence/marketplace-sdk';
import {
	CollectibleCard,
	useInventory,
	useMarketplaceConfig,
	useSellModal,
} from '@0xsequence/marketplace-sdk/react';
import { useMemo } from 'react';
import type { Address, Hex } from 'viem';
import { useAccount } from 'wagmi';
import { createRoute } from '../../routes';

interface NetworkPillProps {
	chainId: number;
}

function NetworkPill({ chainId }: NetworkPillProps) {
	const network = getNetwork(chainId);
	return (
		<div className="flex items-center gap-1">
			<Text variant="small" color="text80" fontWeight="bold">
				{network.name}
			</Text>
			<NetworkImage chainId={chainId} size="xs" />
		</div>
	);
}

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

function useListInventoryCardData({
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

interface InventoryPageControllerProps {
	onNavigate: (path: string) => void;
}

export function InventoryPageController({
	onNavigate,
}: InventoryPageControllerProps) {
	const { address: accountAddress } = useAccount();
	const { data: marketplaceConfig } = useMarketplaceConfig();

	const collections = marketplaceConfig?.market.collections || [];

	const handleCollectibleClick = (
		chainId: number,
		collectionAddress: string,
		tokenId: string,
	) => {
		const route = createRoute.collectible(chainId, collectionAddress, tokenId);

		onNavigate(route);
	};

	if (!accountAddress) {
		return (
			<div className="flex justify-center pt-3">
				<Text variant="large">
					Please connect your wallet to view your inventory
				</Text>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-6 pt-3">
			{collections.map((collection) => (
				<CollectionInventory
					key={`${collection.chainId}-${collection.itemsAddress}`}
					chainId={collection.chainId}
					collectionAddress={collection.itemsAddress as Hex}
					accountAddress={accountAddress}
					onCollectibleClick={handleCollectibleClick}
				/>
			))}
		</div>
	);
}

interface CollectionInventoryProps {
	chainId: number;
	collectionAddress: Hex;
	accountAddress: Hex;
	onCollectibleClick: (
		chainId: number,
		collectionAddress: Hex,
		tokenId: string,
	) => void;
}

function CollectionInventory({
	chainId,
	collectionAddress,
	onCollectibleClick,
}: CollectionInventoryProps) {
	const {
		collectibleCards,
		isLoading: cardsLoading,
		allCollectibles,
	} = useListInventoryCardData({
		chainId,
		collectionAddress,
		orderbookKind: OrderbookKind.sequence_marketplace_v2,
		collectionType: ContractType.ERC721,
		onCollectibleClick: (tokenId: string) =>
			onCollectibleClick(chainId, collectionAddress, tokenId),
	});

	const hasTokens = (allCollectibles?.length ?? 0) > 0;
	const isLoading = cardsLoading;

	if (isLoading) {
		return (
			<div className="flex justify-center">
				<Text variant="medium">Loading inventory...</Text>
			</div>
		);
	}

	if (!hasTokens) {
		return null;
	}

	return (
		<div className="flex flex-col gap-3">
			<div className="flex items-center gap-2">
				<NetworkPill chainId={chainId} />
				<Text variant="large">{collectionAddress}</Text>
			</div>
			<div
				className="flex gap-3"
				style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
					gap: '16px',
				}}
			>
				{collectibleCards.map((card) => (
					<div key={`${collectionAddress}-${card.collectibleId}`}>
						<CollectibleCard
							{...{
								...card,
								marketplaceType: card.marketplaceType as 'market',
								prioritizeOwnerActions: true,
							}}
						/>
					</div>
				))}
			</div>
		</div>
	);
}
