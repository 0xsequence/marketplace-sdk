import { getNetwork } from '@0xsequence/connect';
import {
	Button,
	Card,
	CollectionIcon,
	NetworkImage,
	Skeleton,
	Text,
	truncateAddress,
} from '@0xsequence/design-system';
import { Media, useListCollections } from '@0xsequence/marketplace-sdk/react';
import type { ContractInfo } from '@0xsequence/metadata';
import { useNavigate } from 'react-router';
import { useMarketplace } from 'shared-components';
import type { Hex } from 'viem';
import { ROUTES } from '../lib/routes';

function NetworkPill({ chainId }: { chainId: number }) {
	const network = getNetwork(chainId);
	return (
		<div className="absolute top-3 right-3 z-10 flex items-center gap-1 rounded-full bg-background-primary px-3 py-1.5 shadow-sm">
			<Text variant="small" color="text80" fontWeight="bold">
				{network.name}
			</Text>
			<NetworkImage chainId={chainId} size="xs" />
		</div>
	);
}

function CollectionCard({
	collection,
	onClick,
}: {
	collection: ContractInfo;
	onClick: () => void;
}) {
	const truncatedAddress = truncateAddress(collection.address, 4);

	return (
		<Card
			className="group relative aspect-square overflow-hidden border border-background-secondary p-0 transition-all duration-200 hover:shadow-lg"
			key={collection.address}
			onClick={onClick}
			style={{ cursor: 'pointer' }}
		>
			<NetworkPill chainId={collection.chainId as number} />

			<Media
				assets={[collection.extensions.ogImage]}
				className="h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
				shouldListenForLoad={false}
			/>

			<div className="absolute right-0 bottom-0 left-0 flex items-center bg-background-primary bg-opacity-80 p-4 backdrop-blur-sm">
				<Media
					assets={[collection.logoURI]}
					className="mr-2 h-auto w-10 rounded-full"
					fallbackContent={<CollectionIcon className="text-text-50" />}
				/>
				<div>
					<Text variant="large" fontWeight="bold" className="mb-1 line-clamp-1">
						{collection.name || 'Unnamed Collection'}
					</Text>

					<Text variant="small" color="text50" className="flex items-center">
						{truncatedAddress}
					</Text>
				</div>
			</div>
		</Card>
	);
}

export function Collections() {
	const navigate = useNavigate();
	const marketplace = useMarketplace();
	const {
		marketplaceType,
		setChainId,
		setCollectionAddress,
		setMarketplaceType,
	} = marketplace;

	const {
		data: collections,
		isLoading: collectionsLoading,
		error: collectionsError,
	} = useListCollections({
		marketplaceType: marketplaceType === 'market' ? 'market' : 'shop',
	});

	const handleCollectionClick = (collection: ContractInfo) => {
		setChainId(collection.chainId);
		setCollectionAddress(collection.address as Hex);
		navigate(`/${ROUTES.COLLECTIBLES.path}`);
	};

	const toggleMarketplaceType = () => {
		setMarketplaceType(marketplaceType === 'market' ? 'shop' : 'market');
	};

	if (collectionsError) {
		return (
			<div className="flex flex-col items-center justify-center py-12">
				<Text variant="xlarge" color="text80" className="mb-2">
					Error loading collections
				</Text>
				<Text variant="small" color="text80" className="opacity-80">
					{collectionsError.message}
				</Text>
			</div>
		);
	}

	return (
		<div>
			<div className="mb-4 flex items-center justify-between">
				<Text variant="xlarge" color="text80">
					{marketplaceType === 'market'
						? 'Market Collections'
						: 'Shop Collections'}
				</Text>
				<Button onClick={toggleMarketplaceType} variant="base">
					Switch to {marketplaceType === 'market' ? 'Shop' : 'Market'}
				</Button>
			</div>

			{collectionsLoading ? (
				<div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2 lg:grid-cols-3">
					<Skeleton className="h-64 w-full" />
					<Skeleton className="h-64 w-full" />
					<Skeleton className="h-64 w-full" />
					<Skeleton className="h-64 w-full" />
				</div>
			) : !collections?.length ? (
				<div className="flex flex-col items-center justify-center py-12">
					<Text variant="xlarge" color="text80" className="mb-2">
						No {marketplaceType} collections found
					</Text>
					<Text variant="small" color="text80" className="opacity-80">
						Switch to {marketplaceType === 'market' ? 'shop' : 'market'}{' '}
						collections or check back later
					</Text>
				</div>
			) : (
				<div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2 lg:grid-cols-3">
					{collections.map((collection) => (
						<CollectionCard
							key={collection.address}
							collection={collection}
							onClick={() => handleCollectionClick(collection)}
						/>
					))}
				</div>
			)}
		</div>
	);
}
