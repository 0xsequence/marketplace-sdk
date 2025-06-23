import { Button, Skeleton, Text } from '@0xsequence/design-system';
import { useListCollections } from '@0xsequence/marketplace-sdk/react';
import type { ContractInfo } from '@0xsequence/metadata';
import { useNavigate } from 'react-router';
import { CollectionGrid, useMarketplace } from 'shared-components';
import type { Hex } from 'viem';
import { ROUTES } from '../lib/routes';

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
				<CollectionGrid
					collections={collections}
					onCollectionClick={handleCollectionClick}
					className="pt-4"
				/>
			)}
		</div>
	);
}
