'use client';

import { GradientAvatar, Text } from '@0xsequence/design-system';
import { truncateMiddle } from '@0xsequence/marketplace-sdk';
import type { Activity } from '@0xsequence/marketplace-sdk';
import { useListCollectibleActivities } from '@0xsequence/marketplace-sdk/react';
import { useCurrency } from '@0xsequence/marketplace-sdk/react';
import { useState } from 'react';
import { useMarketplace } from 'shared-components';
import type { Address } from 'viem';
import { type Column, Table } from './Table';

enum ActivityAction {
	listing = 'listing',
	listingCancel = 'listingCancel',
	offer = 'offer',
	offerCancel = 'offerCancel',
	mint = 'mint',
	sale = 'sale',
	transfer = 'transfer',
}

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

export function ActivitiesTable() {
	const { collectionAddress, chainId, collectibleId } = useMarketplace();
	const [page, setPage] = useState(1);
	const pageSize = 5;

	const { data: activities, isLoading: activitiesLoading } =
		useListCollectibleActivities({
			chainId,
			collectionAddress,
			tokenId: collectibleId,
			query: {
				enabled: true,
				page: page,
				pageSize,
			},
		});

	const columns: Column<Activity>[] = [
		{
			header: 'Event',
			key: 'action',
			render: (activity) => (
				<Text variant="small" color="text100">
					{getActivityTypeLabel(activity.action as ActivityAction)}
				</Text>
			),
		},
		{
			header: 'Price',
			key: 'priceAmount',
			render: (activity) => {
				const { data: currency } = useCurrency({
					currencyAddress: activity.priceCurrencyAddress as Address,
					chainId: activity.chainId,
				});
				return (
					<Text variant="small" color="text100">
						{activity.priceAmount
							? `${activity.priceAmount} ${currency?.symbol}`
							: '-'}
					</Text>
				);
			},
		},
		{
			header: 'From',
			key: 'from',
			render: (activity) => (
				<div className="flex items-center gap-1">
					<GradientAvatar address={activity.from} size="xs" />
					<Text variant="small" color="text100">
						{truncateMiddle(activity.from, 3, 3)}
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
						<div className="flex items-center gap-1">
							<GradientAvatar address={activity.to} size="xs" />
							<Text variant="small" color="text100">
								{truncateMiddle(activity.to, 3, 3)}
							</Text>
						</div>
					) : (
						'-'
					)}
				</div>
			),
		},
		{
			header: 'Date',
			key: 'activityCreatedAt',
			render: (activity) => (
				<Text variant="small" color="text100">
					{new Date(activity.activityCreatedAt).toLocaleDateString()}
				</Text>
			),
		},
	];

	return (
		<div className="flex flex-col gap-3 rounded-lg border border-white/10 bg-black/80 p-3 shadow-md">
			<div className="sticky top-0 z-10 flex w-full items-center gap-4 py-1">
				<Text variant="small" fontWeight="medium">
					Activities History
				</Text>
			</div>

			<Table<Activity>
				isLoading={activitiesLoading}
				items={activities?.activities}
				columns={columns}
				emptyMessage="No activities available"
				pagination={{
					onNextPage: () => setPage((prev) => prev + 1),
					onPrevPage: () => setPage((prev) => Math.max(1, prev - 1)),
					isPrevDisabled: page <= 1,
					isNextDisabled: !activities?.page?.more,
					currentPage: page,
				}}
			/>
		</div>
	);
}
