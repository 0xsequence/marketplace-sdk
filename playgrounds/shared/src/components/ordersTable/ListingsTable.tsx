import { useState } from 'react';
import {
	useCountListingsForCollectible,
	useListListingsForCollectible,
} from '@0xsequence/marketplace-sdk/react';
import OrdersTable, { PAGE_SIZE_OPTIONS } from './OrdersTable';
import { Text } from '@0xsequence/design-system';
import type { Hex } from 'viem';

type ListingsTableProps = {
	chainId: string;
	collectionAddress: Hex;
	collectibleId: string;
};

const ListingsTable = ({
	chainId,
	collectionAddress,
	collectibleId,
}: ListingsTableProps) => {
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[5].value);

	const { data: listings, isLoading: listingsLoading } =
		useListListingsForCollectible({
			chainId: chainId,
			collectionAddress,
			collectibleId,
			page: {
				page,
				pageSize,
			},
		});

	const { data: countOfListings, isLoading: countOfListingsLoading } =
		useCountListingsForCollectible({
			collectionAddress,
			chainId,
			collectibleId,
		});

	if (!listings?.listings.length && !listingsLoading) {
		return (
			<div className="rounded-md border border-foreground/30 py-8">
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
			page={page}
			pageSize={pageSize}
			onPageChange={setPage}
			onPageSizeChange={setPageSize}
			isLoading={listingsLoading}
			chainId={chainId}
			collectionAddress={collectionAddress}
			tokenId={collectibleId}
		/>
	);
};

export default ListingsTable;
