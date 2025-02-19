import { Box, Card, NetworkImage, Text } from '@0xsequence/design-system';
import type { ContractInfo } from '@0xsequence/indexer';
import { useListCollections } from '@0xsequence/marketplace-sdk/react';
import { useNavigate } from 'react-router';
import type { Hex } from 'viem';
import { useMarketplace } from '../lib/MarketplaceContext';
import { ROUTES } from '../lib/routes';
import { getNetwork } from '@0xsequence/kit';

function NetworkPill({ chainId }: { chainId: number }) {
	const network = getNetwork(chainId);
	return (
		<Box
			position="absolute"
			top="2"
			right="2"
			background="backgroundPrimary"
			display="flex"
			alignItems="center"
			gap="1"
			borderRadius="circle"
			paddingX="2"
			paddingY="1"
		>
			<Text variant="small" color="text80" fontWeight="bold">
				{network.name}
			</Text>
			<NetworkImage chainId={chainId} size="xs" />
		</Box>
	);
}

export function Collections() {
	const navigate = useNavigate();
	const { data: collections, isLoading: collectionsLoading } =
		useListCollections();
	const { setChainId, setCollectionAddress } = useMarketplace();

	const handleCollectionClick = (collection: ContractInfo) => {
		setChainId(String(collection.chainId));
		setCollectionAddress(collection.address as Hex);
		navigate(`/${ROUTES.COLLECTIBLES.path}`);
	};

	if (collections?.length === 0 && !collectionsLoading) {
		return (
			<Box paddingTop="3" display="flex" justifyContent="center">
				<Text variant="large">No collections found</Text>
			</Box>
		);
	}

	return (
		<Box
			gap="3"
			paddingTop="3"
			style={{
				display: 'grid',
				gridTemplateColumns: 'repeat(3, 1fr)',
				gap: '16px',
			}}
		>
			{collections?.map((collection: Partial<ContractInfo>) => (
				<Card
					key={collection.address}
					gap="2"
					onClick={() => handleCollectionClick(collection as ContractInfo)}
					style={{ cursor: 'pointer' }}
					position="relative"
				>
					<NetworkPill chainId={collection.chainId as number} />
					<Box
						style={{
							backgroundImage: `url(${collection.extensions?.ogImage})`,
							backgroundSize: 'cover',
							backgroundPosition: 'center',
							minHeight: '200px',
							minWidth: '90px',
						}}
						alignItems="center"
					>
						<Card blur={true} flexDirection="column" gap="1">
							<Text variant="large">{collection.name}</Text>
							<Text variant="small">{collection.address}</Text>
						</Card>
					</Box>
				</Card>
			))}
		</Box>
	);
}
