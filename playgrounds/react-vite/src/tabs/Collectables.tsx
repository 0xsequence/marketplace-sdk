import { Text } from '@0xsequence/design-system';
import { useCollection } from '@0xsequence/marketplace-sdk/react';
import type { ContractInfo } from '@0xsequence/metadata';
import { useNavigate } from 'react-router';
import type { OrderbookKind } from '../../../../sdk/src';

import { FilterBadges, useMarketplace } from 'shared-components';
import { ROUTES } from '../lib/routes';
import { InfiniteScrollView } from './components/InfiniteScrollView';
import { PaginatedView } from './components/PaginatedView';

export function Collectibles() {
	const navigate = useNavigate();
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
		navigate(`/${ROUTES.COLLECTIBLE.path}`);
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

			<FilterBadges />

			{paginationMode === 'paginated' ? (
				<PaginatedView
					collectionAddress={collectionAddress}
					chainId={chainId}
					orderbookKind={orderbookKind as OrderbookKind}
					collection={collection as unknown as ContractInfo}
					collectionLoading={collectionLoading}
					onCollectibleClick={handleCollectibleClick}
				/>
			) : (
				<InfiniteScrollView
					collectionAddress={collectionAddress}
					chainId={chainId}
					orderbookKind={orderbookKind as OrderbookKind}
					collection={collection as ContractInfo}
					collectionLoading={collectionLoading}
					onCollectibleClick={handleCollectibleClick}
				/>
			)}
		</div>
	);
}
