'use client';

import { Text } from '@0xsequence/design-system';
import type { ContractInfo } from '@0xsequence/metadata';
import { useListCollections } from '@0xsequence/marketplace-sdk/react';
import { useRouter } from 'next/navigation';
import { useMarketplace, CollectionGrid } from 'shared-components';
import type { Hex } from 'viem';
import { ROUTES } from '@/lib/routes';

export default function CollectionsPage() {
	const router = useRouter();
	const { data: collections, isLoading } = useListCollections();
	const { setChainId, setCollectionAddress } = useMarketplace();

	const handleCollectionClick = (collection: ContractInfo) => {
		setChainId(collection.chainId);
		setCollectionAddress(collection.address as Hex);
		router.push(`/${ROUTES.COLLECTIBLES.path}`);
	};

	if (collections?.length === 0 && !isLoading) {
		return (
			<div className="flex justify-center pt-3">
				<Text variant="large">No collections found</Text>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="flex justify-center pt-3">
				<Text variant="large">Loading collections...</Text>
			</div>
		);
	}

	return (
		<CollectionGrid
			collections={collections || []}
			onCollectionClick={handleCollectionClick}
			className="pt-2"
		/>
	);
}
