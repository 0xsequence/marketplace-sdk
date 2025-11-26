'use client';
import { Text } from '@0xsequence/design-system';
import {
	useCountListingsForCollectible,
	useListListingsForCollectible,
} from '@0xsequence/marketplace-sdk/react';
import { useState } from 'react';
import type { Address } from 'viem';
import { PAGE_SIZE_OPTIONS } from '../../consts';
import OrdersTable from './OrdersTable';

type ListingsTableProps = {
	chainId: number;
	collectionAddress: Address;
	tokenId: bigint;
};

const ListingsTable = ({
	chainId,
	collectionAddress,
	tokenId,
}: ListingsTableProps) => {
	const initialPageSize = PAGE_SIZE_OPTIONS[5]?.value;
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(initialPageSize);

	const { data: listings, isLoading: listingsLoading } =
		useListListingsForCollectible({
			chainId,
			collectionAddress,
			tokenId,
			page: {
				page,
				pageSize,
			},
		});

	const { data: countOfListings, isLoading: countOfListingsLoading } =
		useCountListingsForCollectible({
			collectionAddress,
			chainId,
			tokenId,
		});

	const totalListings =
		countOfListings !== undefined
			? Number(countOfListings)
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
				tokenId={tokenId}
			/>
		</div>
	);
};

export default ListingsTable;
