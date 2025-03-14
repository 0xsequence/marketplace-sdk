'use client';

import { Text } from '@0xsequence/design-system';
import { useState } from 'react';
import { type Column, ControlledTable } from './ControlledTable';

interface Activity {
	id: string;
	type: string;
	timestamp: string;
	from: string;
	to: string;
	price?: string;
}

export function ActivitiesTable() {
	const [page, setPage] = useState(1);
	const [isLoading] = useState(false);
	const activities: Activity[] = [];

	const columns: Column<Activity>[] = [
		{
			header: 'Event',
			key: 'type',
			render: (activity) => (
				<Text variant="small" color="text100">
					{activity.type}
				</Text>
			),
		},
		{
			header: 'Price',
			key: 'price',
			render: (activity) => (
				<Text variant="small" color="text100">
					{activity.price || '-'}
				</Text>
			),
		},
		{
			header: 'From',
			key: 'from',
			render: (activity) => (
				<Text variant="small" color="text100">
					{activity.from}
				</Text>
			),
		},
		{
			header: 'To',
			key: 'to',
			render: (activity) => (
				<Text variant="small" color="text100">
					{activity.to}
				</Text>
			),
		},
		{
			header: 'Date',
			key: 'timestamp',
			render: (activity) => (
				<Text variant="small" color="text100">
					{new Date(activity.timestamp).toLocaleDateString()}
				</Text>
			),
		},
	];

	return (
		<div className="flex flex-col gap-3">
			<div className="sticky top-0 z-10 flex w-full items-center gap-4 py-1">
				<Text variant="small" fontWeight="medium">
					Activity
				</Text>
			</div>

			<ControlledTable<Activity>
				isLoading={isLoading}
				items={activities}
				columns={columns}
				emptyMessage="No activity available"
				pagination={{
					onNextPage: () => setPage((prev) => prev + 1),
					onPrevPage: () => setPage((prev) => Math.max(1, prev - 1)),
					isPrevDisabled: page <= 1,
					isNextDisabled: false,
					currentPage: page,
				}}
			/>
		</div>
	);
}
