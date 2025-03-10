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
		<div className="flex flex-col gap-3 p-3 bg-gray-800 rounded-lg border border-gray-700/30 shadow-md">
			<h3 className="text-base font-semibold text-white">Activities History</h3>

			{activitiesLoading ? (
				<div className="flex justify-center p-2">
					<p className="text-gray-300 text-sm">Loading activities...</p>
				</div>
			) : activities?.activities?.length ? (
				<>
					<div className="overflow-x-auto">
						<table className="w-full divide-y divide-gray-700 table-fixed">
							<thead>
								<tr>
									<th className="px-2 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-[20%]">
										Event
									</th>
									<th className="px-2 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-[20%]">
										Price
									</th>
									<th className="px-2 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-[25%]">
										From
									</th>
									<th className="px-2 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-[25%]">
										To
									</th>
									<th className="px-2 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-[10%]">
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
										<td className="px-2 py-2 text-xs text-gray-300 truncate">
											{getActivityTypeLabel(activity.action as ActivityAction)}
										</td>
										<td className="px-2 py-2 text-xs text-gray-300 truncate">
											{activity.priceAmount ? `${activity.priceAmount}` : '-'}
										</td>
										<td className="px-2 py-2 text-xs text-gray-300">
											<div className="flex items-center gap-1">
												<div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
												{truncateMiddle(activity.from, 3, 3)}
											</div>
										</td>
										<td className="px-2 py-2 text-xs text-gray-300">
											<div className="flex items-center gap-1">
												{activity.to ? (
													<>
														<div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
														{truncateMiddle(activity.to, 3, 3)}
													</>
												) : (
													'-'
												)}
											</div>
										</td>
										<td className="px-2 py-2 text-xs text-gray-300 truncate">
											{new Date(
												activity.activityCreatedAt,
											).toLocaleDateString()}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					<div className="flex justify-center mt-2 gap-2">
						<button
							type="button"
							className={`px-3 py-1 rounded text-xs transition-colors ${
								page <= 1
									? 'bg-gray-700 text-gray-500 cursor-not-allowed'
									: 'bg-gray-800 text-gray-300 hover:bg-gray-700'
							}`}
							onClick={() => setPage((prev) => Math.max(1, prev - 1))}
							disabled={page <= 1}
						>
							Prev
						</button>
						<span className="text-gray-300 text-xs font-bold flex items-center mx-1">
							Page {page}
						</span>
						<button
							type="button"
							className={`px-3 py-1 rounded text-xs transition-colors ${
								!activities?.page?.more
									? 'bg-gray-700 text-gray-500 cursor-not-allowed'
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
