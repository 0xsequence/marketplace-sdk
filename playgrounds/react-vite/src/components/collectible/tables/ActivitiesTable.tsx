import { GradientAvatar, Text } from '@0xsequence/design-system';
import type { Activity } from '@0xsequence/marketplace-sdk';
import { truncateMiddle } from '@0xsequence/marketplace-sdk';
import { useListCollectibleActivities } from '@0xsequence/marketplace-sdk/react';
import { useState } from 'react';
import { ActivityAction } from '../../../../../../packages/sdk/src/react/_internal';
import { useMarketplace } from '../../../lib/MarketplaceContext';
import {
	type Column,
	ControlledTable,
} from '../../../lib/Table/ControlledTable';
import { PriceCell } from './PriceCell';

const getActivityTypeLabel = (action: ActivityAction) => {
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

	const { data: activities, isLoading: activitiesLoading } =
		useListCollectibleActivities({
			chainId,
			collectionAddress,
			tokenId: collectibleId,
			query: {
				enabled: true,
				page: page,
				pageSize: 30,
			},
		});

	const columns: Column<Activity>[] = [
		{
			header: 'Event',
			key: 'action',
			render: (activity) => (
				<Text className="font-body" color="text100">
					{getActivityTypeLabel(activity.action)}
				</Text>
			),
		},
		{
			header: 'Price',
			key: 'price',
			render: (activity) => <PriceCell activity={activity} />,
		},
		{
			header: 'From',
			key: 'from',
			render: (activity) => (
				<div className="flex items-center gap-1">
					<GradientAvatar address={activity.from} size="xs" />

					<Text className="font-body" color="text100">
						{truncateMiddle(activity.from, 3, 4)}
					</Text>
				</div>
			),
		},
		{
			header: 'To',
			key: 'to',
			render: (activity) => (
				<div className="flex items-center gap-1">
					{activity.to ? (
						<GradientAvatar address={activity.to} size="xs" />
					) : (
						<div className="h-4 w-4 rounded-full bg-background-muted" />
					)}

					<Text className="font-body" color="text100">
						{activity.to ? truncateMiddle(activity.to, 3, 4) : '-'}
					</Text>
				</div>
			),
		},
		{
			header: 'Date',
			key: 'activityCreatedAt',
			render: (activity) => (
				<Text className="font-body" color="text100">
					{new Date(activity.activityCreatedAt).toLocaleDateString()}
				</Text>
			),
		},
	];

	return (
		<>
			<div className="sticky top-0 z-10 w-full bg-background-primary py-1">
				<Text
					className="font-body text-large"
					color="text100"
					fontWeight="bold"
				>
					Activities History
				</Text>
			</div>
			<ControlledTable<Activity>
				isLoading={activitiesLoading}
				items={activities?.activities}
				columns={columns}
				emptyMessage="No activities available"
				pagination={{
					onNextPage: () => setPage((prev) => prev + 1),
					onPrevPage: () => setPage((prev) => prev - 1),
					isPrevDisabled: page <= 1,
					isNextDisabled: !activities?.page?.more,
					currentPage: page,
				}}
			/>
		</>
	);
};
