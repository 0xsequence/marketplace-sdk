import { getNetwork } from '@0xsequence/connect';
import { NetworkImage, Text } from '@0xsequence/design-system';
import { ContractType, OrderbookKind } from '@0xsequence/marketplace-sdk';
import {
	CollectibleCard,
	useMarketplaceConfig,
} from '@0xsequence/marketplace-sdk/react';
import { useNavigate } from 'react-router';
import { useMarketplace } from 'shared-components';
import type { Hex } from 'viem';
import { useAccount } from 'wagmi';
import { useListInventoryCardData } from '../hooks/useListInventoryCardData';
import { ROUTES } from '../lib/routes';

function NetworkPill({ chainId }: { chainId: number }) {
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

export function Inventory() {
	const navigate = useNavigate();
	const { address: accountAddress } = useAccount();
	const { data: marketplaceConfig } = useMarketplaceConfig();
	const { setChainId, setCollectionAddress, setCollectibleId } =
		useMarketplace();

	const collections = marketplaceConfig?.market.collections || [];

	const handleCollectibleClick = (
		chainId: number,
		collectionAddress: string,
		tokenId: string,
	) => {
		setChainId(chainId);
		setCollectionAddress(collectionAddress as `0x${string}`);
		setCollectibleId(tokenId);
		navigate(`/${ROUTES.COLLECTIBLE.path}`);
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
							}}
						/>
					</div>
				))}
			</div>
		</div>
	);
}
