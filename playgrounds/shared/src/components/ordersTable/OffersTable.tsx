'use client';
import { Text } from '@0xsequence/design-system';
import {
	useCountOffersForCollectible,
	useListOffersForCollectible,
} from '@0xsequence/marketplace-sdk/react';
import { useState } from 'react';
import type { Address } from 'viem';
import { PAGE_SIZE_OPTIONS } from '../../consts';
import OrdersTable from './OrdersTable';

type OffersTableProps = {
	chainId: number;
	collectionAddress: Address;
	tokenId: bigint;
};

const OffersTable = ({
	chainId,
	collectionAddress,
	tokenId,
}: OffersTableProps) => {
	const initialPageSize = PAGE_SIZE_OPTIONS[5]?.value;
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(initialPageSize);

	const { data: offers, isLoading: offersLoading } =
		useListOffersForCollectible({
			chainId,
			collectionAddress,
			tokenId,
			page: {
				page,
				pageSize,
			},
		});

	const { data: countOfOffers, isLoading: countOfOffersLoading } =
		useCountOffersForCollectible({
			collectionAddress,
			chainId,
			tokenId,
		});

	const totalOffers =
		countOfOffers !== undefined
			? Number(countOfOffers)
			: offers?.offers?.length || 0;

	const handlePageChange = (newPage: number) => {
		setPage(newPage);
	};

	const handlePageSizeChange = (newPageSize: number) => {
		const sizeValue = Number(newPageSize);
		setPageSize(sizeValue);
		setPage(1);
	};

	if (!offers?.offers.length && !offersLoading) {
		return (
			<>
				<div className="sticky top-0 z-10 w-full bg-background-primary py-1">
					<Text
						className="font-body text-large"
						color="text100"
						fontWeight="bold"
					>
						Offers
					</Text>
				</div>

				<div className="rounded-xl border border-border-base px-10 py-8">
					<Text className="text-center font-bold text-large text-text-50">
						No offers found
					</Text>
				</div>
			</>
		);
	}

	return (
		<div className="flex flex-col gap-4">
			<div className="sticky top-0 z-10 w-full bg-background-primary py-1">
				<Text
					className="font-body text-large"
					color="text100"
					fontWeight="bold"
				>
					Offers
				</Text>
			</div>

			<OrdersTable
				orders={offers?.offers}
				ordersCount={totalOffers}
				ordersCountLoading={countOfOffersLoading}
				page={page}
				pageSize={pageSize}
				onPageChange={handlePageChange}
				onPageSizeChange={handlePageSizeChange}
				isLoading={offersLoading}
				chainId={chainId}
				tokenId={tokenId}
			/>
		</div>
	);
};

export default OffersTable;
