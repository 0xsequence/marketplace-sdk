import { NetworkImage, Text } from '@0xsequence/design-system';
import {
	type CollectibleCardAction,
	type CollectibleOrder,
	type ContractType,
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
import { useMemo, useState } from 'react';
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
	onCollectibleClick?: (tokenId: string) => void;
	onCannotPerformAction?: (action: CollectibleCardAction) => void;
	assetSrcPrefixUrl?: string;
}

function useListInventoryCardData({
	collectionAddress,
	chainId,
	orderbookKind,
	onCollectibleClick,
	onCannotPerformAction,
	assetSrcPrefixUrl,
}: UseListInventoryCardDataProps) {
	const { address: accountAddress } = useAccount();
	const { show: showSellModal } = useSellModal();

	const {
		data: inventoryData,
		isLoading: inventoryIsLoading,
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
	const collectionType = inventoryData?.collectibles[0]
		?.contractType as ContractType;
	const isTradable = inventoryData?.isTradable;

	// Flatten all collectibles from all pages
	const allCollectibles = useMemo(() => {
		if (!inventoryData?.collectibles) return [];
		return inventoryData.collectibles;
	}, [inventoryData?.collectibles]);

	const collectibleCards = useMemo(() => {
		return allCollectibles.map((collectible: InventoryCollectible) => {
			const cardProps = {
				collectibleId: collectible.metadata.tokenId,
				chainId,
				collectionAddress,
				collectionType,
				cardLoading: inventoryIsLoading,
				cardType: 'market',
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
		isTradable,
		collectibleCards,
		isLoading: inventoryIsLoading,
		error: inventoryError,
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

	const marketCollections = marketplaceConfig?.market.collections || [];
	const allShopCollections = marketplaceConfig?.shop.collections || [];

	// Filter out collections from shopCollections that already exist in marketCollections
	const shopCollections = allShopCollections.filter(
		(shopCollection) =>
			!marketCollections.some(
				(marketCollection) =>
					marketCollection.chainId === shopCollection.chainId &&
					marketCollection.itemsAddress === shopCollection.itemsAddress,
			),
	);

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
			{/* Tradable Collections Section */}
			{marketCollections.length > 0 && (
				<>
					<div className="flex flex-col gap-3">
						<Text variant="large">Tradable Collections</Text>
					</div>
					{marketCollections.map((collection) => (
						<CollectionInventory
							key={`${collection.chainId}-${collection.itemsAddress}`}
							chainId={collection.chainId}
							collectionAddress={collection.itemsAddress as Hex}
							accountAddress={accountAddress}
							onCollectibleClick={handleCollectibleClick}
						/>
					))}
				</>
			)}

			{/* Shop Collections Section */}
			{shopCollections.length > 0 && (
				<>
					<div className="flex flex-col gap-3">
						<Text variant="large">Shop Collections</Text>
					</div>
					{shopCollections.map((collection) => (
						<CollectionInventory
							key={`${collection.chainId}-${collection.itemsAddress}`}
							chainId={collection.chainId}
							collectionAddress={collection.itemsAddress as Hex}
							accountAddress={accountAddress}
							onCollectibleClick={handleCollectibleClick}
						/>
					))}
				</>
			)}
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
		isTradable,
	} = useListInventoryCardData({
		chainId,
		collectionAddress,
		orderbookKind: OrderbookKind.sequence_marketplace_v2,
		onCollectibleClick: (tokenId: string) =>
			onCollectibleClick(chainId, collectionAddress, tokenId),
	});

	const [visibleItems, setVisibleItems] = useState(4);
	const hasTokens = (allCollectibles?.length ?? 0) > 0;
	const isLoading = cardsLoading;
	const hasMore = visibleItems < collectibleCards.length;

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
				<Text variant="small" color="text80">
					{isTradable ? '(Tradable)' : '(Shop Collection)'}
				</Text>
			</div>
			<div
				className="flex gap-3"
				style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
					gap: '16px',
				}}
			>
				{collectibleCards.slice(0, visibleItems).map((card) => {
					if (isTradable) {
						return (
							<div key={`${collectionAddress}-${card.collectibleId}`}>
								<CollectibleCard
									{...card}
									cardType="market"
									prioritizeOwnerActions={true}
								/>
							</div>
						);
					}
					return (
						<div key={`${collectionAddress}-${card.collectibleId}`}>
							<CollectibleCard
								collectibleId={card.collectibleId}
								chainId={card.chainId}
								collectionAddress={card.collectionAddress}
								collectionType={card.collectionType}
								assetSrcPrefixUrl={card.assetSrcPrefixUrl}
								cardLoading={card.cardLoading}
								cardType="inventory-non-tradable"
								balance={card.balance}
								balanceIsLoading={card.balanceIsLoading}
								collectibleMetadata={card.collectible?.metadata}
							/>
						</div>
					);
				})}
				{hasMore && (
					<button
						type="button"
						onClick={() => setVisibleItems((prev) => prev + 4)}
						className="flex h-full min-h-[300px] flex-col items-center justify-center rounded-lg border-2 border-gray-300 border-dashed bg-gray-50 transition-colors hover:bg-gray-100"
					>
						<Text variant="large" color="text80">
							Load More
						</Text>
						<Text variant="small" color="text50">
							Show {Math.min(4, collectibleCards.length - visibleItems)} more
							items
						</Text>
					</button>
				)}
			</div>
		</div>
	);
}
