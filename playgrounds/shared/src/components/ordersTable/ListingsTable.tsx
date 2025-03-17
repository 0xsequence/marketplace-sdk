import React from 'react';

import { observer, useObservable } from '@legendapp/state/react';
import type { Page } from '@0xsequence/marketplace-sdk';
import {
	useCountListingsForCollectible,
	useListListingsForCollectible,
} from '@0xsequence/marketplace-sdk/react';
import OrdersTable, { PAGE_SIZE_OPTIONS } from './OrdersTable';
import { useMarketplace } from '../../store';

const ListingsTable = observer(() => {
	const { chainId, collectionAddress, collectibleId } = useMarketplace();
	const page$ = useObservable<Page>({
		page: 1,
		pageSize: PAGE_SIZE_OPTIONS[5].value,
	});
	const { data: listings, isLoading: listingsLoading } =
		useListListingsForCollectible({
			chainId: chainId,
			collectionAddress,
			collectibleId,
			page: {
				page: page$.page.get(),
				pageSize: page$.pageSize.get(),
			},
		});

	// Update `more` value whenever listings data changes
	if (listings?.page?.more !== undefined) {
		page$.more.set(listings.page.more);
	}

	const { data: countOfListings, isLoading: countOfListingsLoading } =
		useCountListingsForCollectible({
			collectionAddress,
			chainId,
			collectibleId,
		});

	if (!listings?.listings.length && !listingsLoading) {
		return (
			<div className="border border-foreground/30 py-8 rounded-md">
				<Text fontSize="small" fontWeight="medium" color="text50">
					Your listings will appear here
				</Text>
			</div>
		);
	}

	return (
		<OrdersTable
			orders={listings?.listings}
			ordersCount={countOfListings?.count}
			ordersCountLoading={countOfListingsLoading}
			page$={page$}
			isLoading={listingsLoading}
			chainId={chainId}
			collectionAddress={collectionAddress}
			tokenId={collectibleId}
		/>
	);
});

export default ListingsTable;
