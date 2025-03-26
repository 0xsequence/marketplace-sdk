import { getNetwork } from '@0xsequence/connect';
import { Card, NetworkImage, Text } from '@0xsequence/design-system';
import {
	useListBalances,
	useMarketplaceConfig,
} from '@0xsequence/marketplace-sdk/react';
import { useNavigate } from 'react-router';
import { useMarketplace } from 'shared-components';
import { useAccount } from 'wagmi';
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

	// Get collections from marketplace config
	const collections = marketplaceConfig?.collections || [];

	// Function to handle collectible click
	const handleCollectibleClick = (
		chainId: number,
		collectionAddress: string,
		tokenId: string,
	) => {
		setChainId(String(chainId));
		setCollectionAddress(collectionAddress as `0x${string}`);
		setCollectibleId(tokenId);
		navigate(`/${ROUTES.COLLECTIBLE.path}`);
	};

	// If not connected, show a message
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
					key={`${collection.chainId}-${collection.address}`}
					chainId={collection.chainId}
					collectionAddress={collection.address}
					accountAddress={accountAddress}
					onCollectibleClick={handleCollectibleClick}
				/>
			))}
		</div>
	);
}

interface CollectionInventoryProps {
	chainId: number;
	collectionAddress: string;
	accountAddress: string;
	onCollectibleClick: (
		chainId: number,
		collectionAddress: string,
		tokenId: string,
	) => void;
}

function CollectionInventory({
	chainId,
	collectionAddress,
	accountAddress,
	onCollectibleClick,
}: CollectionInventoryProps) {
	const { data: balances, isLoading: balancesLoading } = useListBalances({
		chainId,
		accountAddress,
		contractAddress: collectionAddress,
		includeMetadata: true,
		query: {
			enabled: !!accountAddress,
		},
	});

	const hasTokens = (balances?.pages?.[0]?.balances?.length ?? 0) > 0;

	if (balancesLoading) {
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
				{balances?.pages.map((page) =>
					page.balances.map((balance) => (
						<Card
							className="relative flex gap-2"
							key={`${balance.contractAddress}-${balance.tokenID}`}
							onClick={() =>
								balance.tokenID &&
								onCollectibleClick(chainId, collectionAddress, balance.tokenID)
							}
							style={{ cursor: 'pointer' }}
						>
							<div
								className="flex items-center"
								style={{
									backgroundImage: `url(${
										balance.contractInfo?.extensions?.ogImage ||
										balance.tokenMetadata?.image
									})`,
									backgroundSize: 'cover',
									backgroundPosition: 'center',
									minHeight: '200px',
									width: '100%',
								}}
							>
								<Card className="mt-auto flex flex-col gap-1" blur={true}>
									<Text variant="large">
										{balance.tokenMetadata?.name || `Token #${balance.tokenID}`}
									</Text>
									<Text variant="small">Owned: {balance.balance}</Text>
								</Card>
							</div>
						</Card>
					)),
				)}
			</div>
		</div>
	);
}
