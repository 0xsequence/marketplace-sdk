import { useListCollectibleActivities } from '@0xsequence/marketplace-sdk/react';
import { useState } from 'react';
import { ActivityAction } from '../../../../../packages/sdk/src/react/_internal';
import { useMarketplace } from '../../store';
import { Text } from '@0xsequence/design-system';
import { Table } from '../Table';
import ActivitiesTableHeader from './Header';
import ActivitiesTableBody from './Body';
import ActivitiesTableFooter from './Footer';

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
	const [pageSize, setPageSize] = useState(10);

	const { data: activities, isLoading: activitiesLoading } =
		useListCollectibleActivities({
			chainId,
			collectionAddress,
			tokenId: collectibleId,
			query: {
				enabled: true,
				page: page,
				pageSize: pageSize,
			},
		});

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
						pageSize={pageSize}
					/>

					<ActivitiesTableFooter
						page={page}
						pageSize={pageSize}
						onPageChange={setPage}
						onPageSizeChange={setPageSize}
						activitiesCount={activities?.activities?.length}
						activitiesCountLoading={activitiesLoading}
						hasMore={activities?.page?.more ?? false}
					/>
				</Table.Root>
			</div>
		</div>
	);
};
