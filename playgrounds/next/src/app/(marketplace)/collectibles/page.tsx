'use client';

import { ROUTES } from '@/lib/routes';
import { Text } from '@0xsequence/design-system';
import type { OrderbookKind } from '@0xsequence/marketplace-sdk';
import { useCollection } from '@0xsequence/marketplace-sdk/react';
import { useRouter } from 'next/navigation';
import { useMarketplace } from 'shared-components';
import { InfiniteScrollView } from './components/InfiniteScrollView';
import { PaginatedView } from './components/PaginatedView';

export default function CollectiblesPage() {
	const router = useRouter();
	const {
		collectionAddress,
		chainId,
		setCollectibleId,
		orderbookKind,
		paginationMode,
	} = useMarketplace();

	const { data: collection, isLoading: collectionLoading } = useCollection({
		collectionAddress,
		chainId,
	});

	const handleCollectibleClick = (tokenId: string) => {
		setCollectibleId(tokenId);
		router.push(`/${ROUTES.COLLECTIBLE.path}`);
	};

	return (
		<div className="flex flex-col gap-4 pt-3">
			<div className="flex items-center justify-between">
				<Text variant="large">Collectibles</Text>
				<Text variant="small" color="text80">
					Mode:{' '}
					{paginationMode === 'paginated' ? 'Paginated' : 'Infinite Scroll'}
				</Text>
			</div>

			{paginationMode === 'paginated' ? (
				<PaginatedView
					collectionAddress={collectionAddress}
					chainId={chainId}
					orderbookKind={orderbookKind as OrderbookKind}
					collection={collection}
					collectionLoading={collectionLoading}
					onCollectibleClick={handleCollectibleClick}
				/>
			) : (
				<InfiniteScrollView
					collectionAddress={collectionAddress}
					chainId={chainId}
					orderbookKind={orderbookKind as OrderbookKind}
					collection={collection}
					collectionLoading={collectionLoading}
					onCollectibleClick={handleCollectibleClick}
				/>
			)}
		</div>
	);
}
