'use client';
import { Text } from '@0xsequence/design-system';
import { useListCollectibleActivities } from '@0xsequence/marketplace-sdk/react';
import { useCallback, useState } from 'react';
import { ActivityAction } from '../../../../../sdk/src/react/_internal';
import { PAGE_SIZE_OPTIONS } from '../../consts';
import { useMarketplace } from '../../store';
import { Table } from '../Table';
import ActivitiesTableBody from './Body';
import ActivitiesTableFooter from './Footer';
import ActivitiesTableHeader from './Header';

export const getActivityTypeLabel = (action: ActivityAction) => {
	switch (action) {
		case ActivityAction.listing:
			return 'Listed';
		case ActivityAction.listingCancel:
			return 'Listing Cancelled';
		case ActivityAction.offer:
			return 'Offer Made';
		case ActivityAction.offerCancel:
			return 'Offer Cancelled';
		case ActivityAction.mint:
			return 'Minted';
		case ActivityAction.sale:
			return 'Sale';
		case ActivityAction.transfer:
			return 'Transfer';
		default:
			return 'Unknown';
	}
};

export const ActivitiesTable = () => {
	const { collectionAddress, chainId, collectibleId } = useMarketplace();
	const [page, setPage] = useState(1);
	const [totalActivitiesCount, setTotalActivitiesCount] = useState(0);

	const { data: activities, isLoading: activitiesLoading } =
		useListCollectibleActivities({
			chainId,
			collectionAddress,
			tokenId: collectibleId,
			page,
			pageSize: PAGE_SIZE_OPTIONS[10].value,
			query: {
				enabled: true,
			},
		});

	if (activities?.activities && !activitiesLoading) {
		if (page === 1) {
			const newCount = activities.page?.more
				? Math.max(
						activities.activities.length,
						PAGE_SIZE_OPTIONS[10].value * 2, // Ensure at least 2 pages if more is true
					)
				: activities.activities.length;

			if (newCount !== totalActivitiesCount) {
				setTotalActivitiesCount(newCount);
			}
		} else {
			const currentCount =
				(page - 1) * PAGE_SIZE_OPTIONS[10].value + activities.activities.length;

			if (currentCount > totalActivitiesCount) {
				setTotalActivitiesCount(currentCount);
			}
		}
	}

	const handlePageChange = useCallback((newPage: number) => {
		setPage(newPage);
	}, []);

	const columns = ['Event', 'Price', 'From', 'To', 'Date'];

	if (!activities?.activities && !activitiesLoading) {
		return (
			<>
				<div className="sticky top-0 z-10 w-full bg-background-primary py-1">
					<Text
						className="font-body text-large"
						color="text100"
						fontWeight="bold"
					>
						Activities
					</Text>
				</div>

				<div className="rounded-xl border border-border-base px-10 py-8">
					<Text className="text-center font-bold text-large text-text-50">
						No activities found
					</Text>
				</div>
			</>
		);
	}

	return (
		<div className="flex flex-col gap-4">
			<Text className="font-body font-bold text-large text-text-100">
				Activities
			</Text>

			<div className="overflow-hidden rounded-xl border border-border-base">
				<Table.Root>
					<ActivitiesTableHeader
						items={columns}
						isLoading={activitiesLoading}
					/>

					<ActivitiesTableBody
						activities={activities?.activities}
						isLoading={activitiesLoading}
						pageSize={PAGE_SIZE_OPTIONS[10].value}
					/>

					<ActivitiesTableFooter
						page={page}
						pageSize={PAGE_SIZE_OPTIONS[10].value}
						onPageChange={handlePageChange}
						activitiesCount={totalActivitiesCount}
						activitiesCountLoading={activitiesLoading}
						hasMore={activities?.page?.more ?? false}
					/>
				</Table.Root>
			</div>
		</div>
	);
};
