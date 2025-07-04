import { GradientAvatar, Text } from '@0xsequence/design-system';
import type { Activity } from '@0xsequence/marketplace-sdk';
import { truncateMiddle } from '@0xsequence/marketplace-sdk';
import { useCurrency } from '@0xsequence/marketplace-sdk/react';
import type { Address } from 'viem';
import { Table } from '../Table';
import { getActivityTypeLabel } from './ActivitiesTable';

const PriceCell = ({ activity }: { activity: Activity }) => {
	const { data: currency } = useCurrency({
		chainId: activity.chainId,
		currencyAddress: activity.priceCurrencyAddress as Address,
	});

	return (
		<Text className="font-body text-text-100">
			{activity.priceAmount} {currency?.symbol}
		</Text>
	);
};

const ActivityRow = ({ activity }: { activity: Activity }) => {
	return (
		<Table.Row>
			<Table.Cell>
				<Text className="font-body text-text-100">
					{getActivityTypeLabel(activity.action)}
				</Text>
			</Table.Cell>
			<Table.Cell>
				<PriceCell activity={activity} />
			</Table.Cell>
			<Table.Cell>
				<div className="flex items-center gap-1">
					<GradientAvatar address={activity.from} size="xs" />
					<Text className="font-body text-text-100">
						{truncateMiddle(activity.from, 3, 4)}
					</Text>
				</div>
			</Table.Cell>
			<Table.Cell>
				<div className="flex items-center gap-1">
					{activity.to ? (
						<GradientAvatar address={activity.to} size="xs" />
					) : (
						<div className="h-4 w-4 rounded-full bg-background-muted" />
					)}
					<Text className="font-body text-text-100">
						{activity.to ? truncateMiddle(activity.to, 3, 4) : '-'}
					</Text>
				</div>
			</Table.Cell>
			<Table.Cell>
				<Text className="font-body text-text-100">
					{new Date(activity.activityCreatedAt).toLocaleDateString()}
				</Text>
			</Table.Cell>
		</Table.Row>
	);
};

const LoadingRow = ({ columns }: { columns: number }) => (
	<Table.Row>
		{Array.from({ length: columns }).map((_, index) => (
			<Table.Cell
				key={`loading-cell-${
					// biome-ignore lint/suspicious/noArrayIndexKey: skeleton cells are static placeholders without unique identifiers
					index
				}`}
			>
				<div className="h-6 w-20 animate-pulse rounded-md bg-background-muted" />
			</Table.Cell>
		))}
	</Table.Row>
);

const ActivitiesTableBody = ({
	activities,
	isLoading,
	pageSize,
}: {
	activities: Activity[] | undefined;
	isLoading: boolean;
	pageSize: number;
}) => {
	if (isLoading) {
		return (
			<Table.Body>
				{Array.from({ length: pageSize }).map((_, index) => (
					<LoadingRow
						key={`loading-row-${
							// biome-ignore lint/suspicious/noArrayIndexKey: skeleton rows are static placeholders without unique identifiers
							index
						}`}
						columns={5}
					/>
				))}
			</Table.Body>
		);
	}

	if (!activities || activities.length === 0) {
		return (
			<Table.Body>
				<Table.Row>
					<Table.Cell colSpan={5} className="py-8 text-center">
						<Text className="text-text-60">No activities available</Text>
					</Table.Cell>
				</Table.Row>
			</Table.Body>
		);
	}

	// Ensure we only display a maximum of pageSize activities
	const displayActivities = activities.slice(0, pageSize);

	return (
		<Table.Body>
			{displayActivities.map((activity) => (
				<ActivityRow key={activity.uniqueHash} activity={activity} />
			))}
		</Table.Body>
	);
};

export default ActivitiesTableBody;
