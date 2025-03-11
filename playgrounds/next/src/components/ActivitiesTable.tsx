'use client';

import { usePlayground } from '@/lib/PlaygroundContext';
import { truncateMiddle } from '@0xsequence/marketplace-sdk';
import type { Activity } from '@0xsequence/marketplace-sdk';
import { useListCollectibleActivities } from '@0xsequence/marketplace-sdk/react';
import { useState } from 'react';

// Define the ActivityAction enum to match the SDK
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
	const { collectionAddress, chainId, collectibleId } = usePlayground();
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

	return (
		<div className="flex flex-col gap-3 rounded-lg border border-gray-700/30 bg-gray-800 p-3 shadow-md">
			<h3 className="font-semibold text-base text-white">Activities History</h3>

			{activitiesLoading ? (
				<div className="flex justify-center p-2">
					<p className="text-gray-300 text-sm">Loading activities...</p>
				</div>
			) : activities?.activities?.length ? (
				<>
					<div className="overflow-x-auto">
						<table className="w-full table-fixed divide-y divide-gray-700">
							<thead>
								<tr>
									<th className="w-[20%] px-2 py-2 text-left font-medium text-gray-400 text-xs uppercase tracking-wider">
										Event
									</th>
									<th className="w-[20%] px-2 py-2 text-left font-medium text-gray-400 text-xs uppercase tracking-wider">
										Price
									</th>
									<th className="w-[25%] px-2 py-2 text-left font-medium text-gray-400 text-xs uppercase tracking-wider">
										From
									</th>
									<th className="w-[25%] px-2 py-2 text-left font-medium text-gray-400 text-xs uppercase tracking-wider">
										To
									</th>
									<th className="w-[10%] px-2 py-2 text-left font-medium text-gray-400 text-xs uppercase tracking-wider">
										Date
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-700">
								{activities.activities.map((activity: Activity) => (
									<tr
										key={activity.activityCreatedAt}
										className="hover:bg-gray-700/50"
									>
										<td className="truncate px-2 py-2 text-gray-300 text-xs">
											{getActivityTypeLabel(activity.action as ActivityAction)}
										</td>
										<td className="truncate px-2 py-2 text-gray-300 text-xs">
											{activity.priceAmount ? `${activity.priceAmount}` : '-'}
										</td>
										<td className="px-2 py-2 text-gray-300 text-xs">
											<div className="flex items-center gap-1">
												<div className="h-4 w-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
												{truncateMiddle(activity.from, 3, 3)}
											</div>
										</td>
										<td className="px-2 py-2 text-gray-300 text-xs">
											<div className="flex items-center gap-1">
												{activity.to ? (
													<>
														<div className="h-4 w-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
														{truncateMiddle(activity.to, 3, 3)}
													</>
												) : (
													'-'
												)}
											</div>
										</td>
										<td className="truncate px-2 py-2 text-gray-300 text-xs">
											{new Date(
												activity.activityCreatedAt,
											).toLocaleDateString()}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					<div className="mt-2 flex justify-center gap-2">
						<button
							type="button"
							className={`rounded px-3 py-1 text-xs transition-colors ${
								page <= 1
									? 'cursor-not-allowed bg-gray-700 text-gray-500'
									: 'bg-gray-800 text-gray-300 hover:bg-gray-700'
							}`}
							onClick={() => setPage((prev) => Math.max(1, prev - 1))}
							disabled={page <= 1}
						>
							Prev
						</button>
						<span className="mx-1 flex items-center font-bold text-gray-300 text-xs">
							Page {page}
						</span>
						<button
							type="button"
							className={`rounded px-3 py-1 text-xs transition-colors ${
								!activities?.page?.more
									? 'cursor-not-allowed bg-gray-700 text-gray-500'
									: 'bg-gray-800 text-gray-300 hover:bg-gray-700'
							}`}
							onClick={() => setPage((prev) => prev + 1)}
							disabled={!activities?.page?.more}
						>
							Next
						</button>
					</div>
				</>
			) : (
				<div className="flex justify-center p-2">
					<p className="text-gray-300 text-sm">No activities available</p>
				</div>
			)}
		</div>
	);
}
