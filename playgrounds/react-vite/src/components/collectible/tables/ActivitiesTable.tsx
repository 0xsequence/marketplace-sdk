import { Box, GradientAvatar, Text } from '@0xsequence/design-system';
import type { Activity } from '@0xsequence/marketplace-sdk';
import { SortOrder, truncateMiddle } from '@0xsequence/marketplace-sdk';
import { useListCollectibleActivities } from '@0xsequence/marketplace-sdk/react';
import { useState } from 'react';
import { useMarketplace } from '../../../lib/MarketplaceContext';
import {
	ControlledTable,
	type Column,
} from '../../../lib/Table/ControlledTable';
import { ActivityAction } from '../../../../../../packages/sdk/src/react/_internal';
import { PriceCell } from './PriceCell';

const getActivityTypeLabel = (action: ActivityAction) => {
	switch (action) {
		case ActivityAction.ask:
			return 'Listed';
		case ActivityAction.askCancel:
			return 'Listing Cancelled';
		case ActivityAction.bid:
			return 'Offer Made';
		case ActivityAction.bidCancel:
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
				sort: [{ column: 'activityCreatedAt', order: SortOrder.DESC }],
			},
		});

	const columns: Column<Activity>[] = [
		{
			header: 'Event',
			key: 'action',
			render: (activity) => (
				<Text fontFamily="body" color="text100">
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
				<Box display="flex" alignItems="center" gap="1">
					<GradientAvatar address={activity.from} size="xs" />

					<Text fontFamily="body" color="text100">
						{truncateMiddle(activity.from, 3, 4)}
					</Text>
				</Box>
			),
		},
		{
			header: 'To',
			key: 'to',
			render: (activity) => (
				<Box display="flex" alignItems="center" gap="1">
					{activity.to ? (
						<GradientAvatar address={activity.to} size="xs" />
					) : (
						<Box
							width="4"
							height="4"
							background="backgroundMuted"
							borderRadius="circle"
						/>
					)}

					<Text fontFamily="body" color="text100">
						{activity.to ? truncateMiddle(activity.to, 3, 4) : '-'}
					</Text>
				</Box>
			),
		},
		{
			header: 'Date',
			key: 'activityCreatedAt',
			render: (activity) => (
				<Text fontFamily="body" color="text100">
					{new Date(activity.activityCreatedAt).toLocaleDateString()}
				</Text>
			),
		},
	];

	return (
		<>
			<Box
				width="full"
				position="sticky"
				top="0"
				background="backgroundPrimary"
				paddingY="1"
				zIndex="10"
			>
				<Text
					fontFamily="body"
					color="text100"
					fontSize="medium"
					fontWeight="bold"
				>
					Activities History
				</Text>
			</Box>

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
