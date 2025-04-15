import { getNetwork } from '@0xsequence/connect';
import { Card, NetworkImage, Text } from '@0xsequence/design-system';
import type { ContractInfo } from '@0xsequence/indexer';
import { useListCollections } from '@0xsequence/marketplace-sdk/react';
import { useNavigate } from 'react-router';
import { useMarketplace } from 'shared-components';
import type { Hex } from 'viem';
import { ROUTES } from '../lib/routes';

function NetworkPill({ chainId }: { chainId: number }) {
	const network = getNetwork(chainId);
	return (
		<div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-background-primary px-2 py-1">
			<Text variant="small" color="text80" fontWeight="bold">
				{network.name}
			</Text>
			<NetworkImage chainId={chainId} size="xs" />
		</div>
	);
}

export function Collections() {
	const navigate = useNavigate();
	const { data: collections, isLoading: collectionsLoading } =
		useListCollections();
	const { setChainId, setCollectionAddress } = useMarketplace();

	const handleCollectionClick = (collection: ContractInfo) => {
		setChainId(collection.chainId);
		setCollectionAddress(collection.address as Hex);
		navigate(`/${ROUTES.COLLECTIBLES.path}`);
	};

	if (collections?.length === 0 && !collectionsLoading) {
		return (
			<div className="flex justify-center pt-3">
				<Text variant="large">No collections found</Text>
			</div>
		);
	}

	return (
		<div
			className="flex gap-3 pt-3"
			style={{
				display: 'grid',
				gridTemplateColumns: 'repeat(3, 1fr)',
				gap: '16px',
			}}
		>
			{collections?.map((collection) => (
				<Card
					className="relative flex gap-2"
					key={collection.address}
					onClick={() => handleCollectionClick(collection as ContractInfo)}
					style={{ cursor: 'pointer' }}
				>
					<NetworkPill chainId={collection.chainId as number} />
					<div
						className="flex items-center"
						style={{
							backgroundImage: `url(${collection.extensions?.ogImage})`,
							backgroundSize: 'cover',
							backgroundPosition: 'center',
							minHeight: '200px',
							minWidth: '90px',
						}}
					>
						<Card className="flex flex-col gap-1" blur={true}>
							<Text variant="large">{collection.name}</Text>
							<Text variant="small">{collection.address}</Text>
						</Card>
					</div>
				</Card>
			))}
		</div>
	);
}
