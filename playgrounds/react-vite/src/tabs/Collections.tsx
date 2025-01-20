import { Box, Card, Text } from '@0xsequence/design-system';
import type { ContractInfo } from '@0xsequence/indexer';
import { useListCollections } from '@0xsequence/marketplace-sdk/react';
import { useNavigate } from 'react-router';
import type { Hex } from 'viem';
import { useMarketplace } from '../lib/MarketplaceContext';
import { ROUTES } from '../lib/routes';

export function Collections() {
	const navigate = useNavigate();
	const { data: collections } = useListCollections();
	const { setChainId, setCollectionAddress } = useMarketplace();

	const handleCollectionClick = (collection: ContractInfo) => {
		setChainId(String(collection.chainId));
		setCollectionAddress(collection.address as Hex);
		navigate(`/${ROUTES.COLLECTIBLES.path}`);
	};

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
			{collections?.map((collection: ContractInfo) => (
				<Card
					key={collection.address}
					gap="2"
					onClick={() => handleCollectionClick(collection)}
					style={{ cursor: 'pointer' }}
				>
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
