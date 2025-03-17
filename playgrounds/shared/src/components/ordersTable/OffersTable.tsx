import { useState } from 'react';
import {
	useCountOffersForCollectible,
	useListOffersForCollectible,
} from '@0xsequence/marketplace-sdk/react';
import OrdersTable, { PAGE_SIZE_OPTIONS } from './OrdersTable';
import { Text } from '@0xsequence/design-system';
import type { Hex } from 'viem';

type OffersTableProps = {
	chainId: string;
	collectionAddress: Hex;
	collectibleId: string;
};

const OffersTable = ({
	chainId,
	collectionAddress,
	collectibleId,
}: OffersTableProps) => {
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[5].value);

	const { data: offers, isLoading: offersLoading } =
		useListOffersForCollectible({
			chainId: chainId,
			collectionAddress,
			collectibleId,
			page: {
				page,
				pageSize,
			},
		});

	const { data: countOfOffers, isLoading: countOfOffersLoading } =
		useCountOffersForCollectible({
			collectionAddress,
			chainId,
			collectibleId,
		});

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

				<div className="rounded-md border border-foreground/30 py-8">
					<Text fontSize="small" fontWeight="medium" color="text50">
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
				ordersCount={countOfOffers?.count}
				ordersCountLoading={countOfOffersLoading}
				page={page}
				pageSize={pageSize}
				onPageChange={setPage}
				onPageSizeChange={setPageSize}
				isLoading={offersLoading}
				chainId={chainId}
				collectionAddress={collectionAddress}
				tokenId={collectibleId}
			/>
		</div>
	);
};

export default OffersTable;
