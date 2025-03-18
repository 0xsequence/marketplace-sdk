'use client';
import { useState } from 'react';
import {
	useCountListingsForCollectible,
	useListListingsForCollectible,
} from '@0xsequence/marketplace-sdk/react';
import OrdersTable from './OrdersTable';
import { Text } from '@0xsequence/design-system';
import type { Hex } from 'viem';
import { PAGE_SIZE_OPTIONS } from '../../consts';

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
	const initialPageSize = PAGE_SIZE_OPTIONS[5]?.value;
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(initialPageSize);

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

	const totalListings =
		countOfListings?.count !== undefined
			? Number(countOfListings.count)
			: listings?.listings?.length || 0;

	const handlePageChange = (newPage: number) => {
		setPage(newPage);
	};

	const handlePageSizeChange = (newPageSize: number) => {
		const sizeValue = Number(newPageSize);
		setPageSize(sizeValue);
		setPage(1);
	};

	if (!listings?.listings.length && !listingsLoading) {
		return (
			<>
				<div className="sticky top-0 z-10 w-full bg-background-primary py-1">
					<Text className="font-body text-large text-text-80">Listings</Text>
				</div>
				<div className="rounded-xl border border-border-base px-10 py-8">
					<Text className="text-center font-bold text-large text-text-50">
						No listings found
					</Text>
				</div>
			</>
		);
	}

	return (
		<div className="flex flex-col gap-4">
			<div className="sticky top-0 z-10 w-full py-1">
				<Text
					className="font-body text-large"
					color="text100"
					fontWeight="bold"
				>
					Listings
				</Text>
			</div>
			<OrdersTable
				orders={listings?.listings}
				ordersCount={totalListings}
				ordersCountLoading={countOfListingsLoading}
				page={page}
				pageSize={pageSize}
				onPageChange={handlePageChange}
				onPageSizeChange={handlePageSizeChange}
				isLoading={listingsLoading}
				chainId={chainId}
				collectionAddress={collectionAddress}
				tokenId={collectibleId}
			/>
		</div>
	);
};

export default ListingsTable;
