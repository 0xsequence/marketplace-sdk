'use client';

import { Button, Skeleton, Text } from '@0xsequence/design-system';
import type { ContractInfo } from '@0xsequence/marketplace-sdk';
import { useListCollections } from '@0xsequence/marketplace-sdk/react';
import { useMarketplace } from '../../store';
import { CollectionGrid } from '../collections/CollectionGrid';

export interface CollectionsPageControllerProps {
	onCollectionClick: (collection: ContractInfo) => void;
	showMarketTypeToggle?: boolean;
	className?: string;
}

export function CollectionsPageController({
	onCollectionClick,
	showMarketTypeToggle = false,
	className,
}: CollectionsPageControllerProps) {
	const marketplace = useMarketplace();
	const { cardType, setCardType } = marketplace;

	const {
		data: collections,
		isLoading: collectionsLoading,
		error: collectionsError,
	} = useListCollections({
		collectionType: showMarketTypeToggle
			? cardType === 'market'
				? 'market'
				: 'shop'
			: undefined,
	});

	const handleCollectionClick = (collection: ContractInfo) => {
		onCollectionClick(collection);
	};

	const toggleMarketplaceType = () => {
		setCardType(cardType === 'market' ? 'shop' : 'market');
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

	if (collections?.length === 0 && !collectionsLoading) {
		return (
			<div className="flex flex-col items-center justify-center py-12">
				<Text variant="xlarge" color="text80" className="mb-2">
					{showMarketTypeToggle
						? `No ${cardType} collections found`
						: 'No collections found'}
				</Text>
				{showMarketTypeToggle && (
					<Text variant="small" color="text80" className="opacity-80">
						Switch to {cardType === 'market' ? 'shop' : 'market'} collections or
						check back later
					</Text>
				)}
			</div>
		);
	}

	if (collectionsLoading) {
		return (
			<div className={className}>
				{showMarketTypeToggle && (
					<div className="mb-4">
						<Text variant="xlarge" color="text80">
							Loading collections...
						</Text>
					</div>
				)}
				{showMarketTypeToggle ? (
					<div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2 lg:grid-cols-3">
						<Skeleton className="h-64 w-full" />
						<Skeleton className="h-64 w-full" />
						<Skeleton className="h-64 w-full" />
						<Skeleton className="h-64 w-full" />
					</div>
				) : (
					<div className="flex justify-center pt-3">
						<Text variant="large">Loading collections...</Text>
					</div>
				)}
			</div>
		);
	}

	return (
		<div className={className}>
			{showMarketTypeToggle && (
				<div className="mb-4 flex items-center justify-between">
					<Text variant="xlarge" color="text80">
						{cardType === 'market' ? 'Market Collections' : 'Shop Collections'}
					</Text>
					<Button onClick={toggleMarketplaceType} variant="secondary">
						Switch to {cardType === 'market' ? 'Shop' : 'Market'}
					</Button>
				</div>
			)}

			<CollectionGrid
				collections={collections || []}
				onCollectionClick={handleCollectionClick}
				className={showMarketTypeToggle ? 'pt-4' : 'pt-2'}
			/>
		</div>
	);
}
