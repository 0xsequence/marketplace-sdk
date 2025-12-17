'use client';

import { Text } from '@0xsequence/design-system';
import type { ContractInfo } from '@0xsequence/marketplace-sdk';
import { useListCollections } from '@0xsequence/marketplace-sdk/react';
import { CollectionGrid } from '../collections/CollectionGrid';

export interface CollectionsPageControllerProps {
	onCollectionClick: (
		collection: ContractInfo,
		type: 'market' | 'shop',
		salesAddress?: string,
	) => void;
	collectionType?: 'market' | 'shop';
	className?: string;
}

export function CollectionsPageController({
	onCollectionClick,
	collectionType = 'market',
	className,
}: CollectionsPageControllerProps) {
	const {
		data: collections,
		isLoading: collectionsLoading,
		error: collectionsError,
	} = useListCollections({
		collectionType,
	});

	const handleCollectionClick = (collection: ContractInfo) => {
		const collectionConfig = collections?.find(
			(c: ContractInfo) =>
				c.address === collection.address && c.chainId === collection.chainId,
		);

		const type: 'market' | 'shop' = collectionType;
		const salesAddress =
			type === 'shop' ? (collectionConfig as any)?.saleAddress : undefined;

		onCollectionClick(collection, type, salesAddress);
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
					No {collectionType} collections found
				</Text>
			</div>
		);
	}

	if (collectionsLoading) {
		return (
			<div className={className}>
				<div className="flex justify-center pt-3">
					<Text variant="large">Loading collections...</Text>
				</div>
			</div>
		);
	}

	return (
		<div className={className}>
			<CollectionGrid
				collections={collections || []}
				onCollectionClick={handleCollectionClick}
				className="pt-2"
			/>
		</div>
	);
}
