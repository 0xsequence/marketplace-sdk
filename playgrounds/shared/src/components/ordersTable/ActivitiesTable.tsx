import type { Activity } from '@0xsequence/marketplace-sdk';
import { truncateMiddle } from '@0xsequence/marketplace-sdk';
import {
	useCurrency,
	useListCollectibleActivities,
} from '@0xsequence/marketplace-sdk/react';
import { useState } from 'react';
import { GradientAvatar, Text, IconButton } from '@0xsequence/design-system';
import { ActivityAction } from '../../../../../packages/sdk/src/react/_internal';
import { useMarketplace } from '../../store';
import { Table } from './Table';
import { ChevronLeftIcon, ChevronRightIcon } from '@0xsequence/design-system';

const PriceCell = ({ activity }: { activity: Activity }) => {
	const { data: currency } = useCurrency({
		chainId: activity.chainId,
	});

	return (
		<Text className="font-body" color="text100">
			{activity.priceAmount} {currency?.symbol}
		</Text>
	);
};

type Column<T> = {
	header: string;
	key: string;
	render: (item: T) => React.ReactNode;
};

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
			render: (activity: Activity) => (
				<Text className="font-body" color="text100">
					{getActivityTypeLabel(activity.action)}
				</Text>
			),
		},
		{
			header: 'Price',
			key: 'price',
			render: (activity: Activity) => <PriceCell activity={activity} />,
		},
		{
			header: 'From',
			key: 'from',
			render: (activity: Activity) => (
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
			render: (activity: Activity) => (
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
			render: (activity: Activity) => (
				<Text className="font-body" color="text100">
					{new Date(activity.activityCreatedAt).toLocaleDateString()}
				</Text>
			),
		},
	];

	return (
		<div className="flex flex-col gap-4">
			<div className="sticky top-0 z-10 w-full bg-background-primary py-1">
				<Text
					className="font-body text-large"
					color="text100"
					fontWeight="bold"
				>
					Activities History
				</Text>
			</div>

			<div className="overflow-hidden rounded-md border border-foreground/20">
				<Table.Root>
					<Table.Header>
						<Table.Row>
							{columns.map((column) => (
								<Table.Head key={column.key}>
									<Text fontSize="small" color="text80">
										{column.header}
									</Text>
								</Table.Head>
							))}
						</Table.Row>
					</Table.Header>

					<Table.Body>
						{activitiesLoading ? (
							Array.from({ length: 5 }).map((_, index) => (
								<Table.Row key={`loading-${Date.now()}-${index}`}>
									{columns.map((column) => (
										<Table.Cell
											key={`loading-${Date.now()}-${column.key}-${index}`}
										>
											<div className="h-6 w-20 animate-pulse rounded-md bg-background-muted" />
										</Table.Cell>
									))}
								</Table.Row>
							))
						) : activities?.activities && activities.activities.length > 0 ? (
							activities.activities.map((activity) => (
								<Table.Row
									key={`${activity.action}-${activity.from}-${activity.activityCreatedAt}`}
								>
									{columns.map((column) => (
										<Table.Cell
											key={`${activity.action}-${activity.from}-${activity.activityCreatedAt}-${column.key}`}
										>
											{column.render(activity)}
										</Table.Cell>
									))}
								</Table.Row>
							))
						) : (
							<Table.Row>
								<Table.Cell
									colSpan={columns.length}
									className="py-8 text-center"
								>
									<Text color="text60">No activities available</Text>
								</Table.Cell>
							</Table.Row>
						)}
					</Table.Body>

					<Table.Footer>
						<Table.Row>
							<Table.Cell colSpan={columns.length}>
								<div className="flex items-center justify-end gap-2 px-4 py-2">
									<IconButton
										onClick={() => setPage((prev) => prev - 1)}
										variant="raised"
										disabled={page <= 1}
										size="xs"
										icon={ChevronLeftIcon}
									/>
									<Text color="text80" className="min-w-[3rem] text-center">
										{page}
									</Text>
									<IconButton
										onClick={() => setPage((prev) => prev + 1)}
										variant="raised"
										disabled={!activities?.page?.more}
										size="xs"
										icon={ChevronRightIcon}
									/>
								</div>
							</Table.Cell>
						</Table.Row>
					</Table.Footer>
				</Table.Root>
			</div>
		</div>
	);
};
