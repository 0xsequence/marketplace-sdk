'use client';

import { usePlayground } from '@/lib/PlaygroundContext';
import {
	ContractType,
	type Order,
	compareAddress,
	getMarketplaceDetails,
	truncateMiddle,
} from '@0xsequence/marketplace-sdk';
import {
	useBuyModal,
	useCancelOrder,
	useCountListingsForCollectible,
	useListListingsForCollectible,
} from '@0xsequence/marketplace-sdk/react';
import { useState } from 'react';
import { useAccount } from 'wagmi';

export function ListingsTable({
	contractType,
}: {
	contractType: ContractType;
}) {
	const { collectionAddress, chainId, collectibleId } = usePlayground();
	const [page, setPage] = useState(1);
	const { address } = useAccount();
	const pageSize = 5;

	const { data: listings, isLoading: listingsLoading } =
		useListListingsForCollectible({
			collectionAddress,
			chainId,
			collectibleId,
			page: {
				page: page,
				pageSize,
			},
		});

	const { data: countOfListings } = useCountListingsForCollectible({
		collectionAddress,
		chainId,
		collectibleId,
	});

	const { cancelOrder, cancellingOrderId } = useCancelOrder({
		collectionAddress,
		chainId,
		onSuccess: () => {
			console.log('Listing cancelled successfully');
		},
		onError: (error) => {
			console.error('Error cancelling listing', error);
		},
	});

	const { show: openBuyModal } = useBuyModal({
		onSuccess: ({ hash }) => {
			console.log('Buy success', hash);
		},
		onError: (error) => {
			console.error('Error buying collectible', error);
		},
	});

	const handleAction = async (order: Order) => {
		if (compareAddress(order.createdBy, address)) {
			await cancelOrder({
				orderId: order.orderId,
				marketplace: order.marketplace,
			});
		} else {
			openBuyModal({
				collectionAddress,
				chainId,
				tokenId: collectibleId,
				order,
			});
		}
	};

	return (
		<div className="flex flex-col gap-3 p-3 bg-gray-800 rounded-lg border border-gray-700/30 shadow-md">
			<div className="flex items-center justify-between">
				<h3 className="text-base font-semibold text-white">
					{`${countOfListings?.count || 0} listings for this collectible`}
				</h3>
			</div>

			{listingsLoading ? (
				<div className="flex justify-center p-2">
					<p className="text-gray-300 text-sm">Loading listings...</p>
				</div>
			) : listings?.listings?.length ? (
				<>
					<div className="overflow-x-auto">
						<table className="w-full divide-y divide-gray-700 table-fixed">
							<thead>
								<tr>
									{contractType === ContractType.ERC1155 && (
										<th className="px-2 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-[10%]">
											Qty
										</th>
									)}
									<th className="px-2 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-[15%]">
										Price
									</th>
									<th className="px-2 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-[10%]">
										Curr
									</th>
									<th className="px-2 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-[20%]">
										Seller
									</th>
									<th className="px-2 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-[15%]">
										Exp
									</th>
									<th className="px-2 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-[15%]">
										Market
									</th>
									<th className="px-2 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-[15%]">
										Actions
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-700">
								{listings.listings.map((order) => (
									<tr key={order.orderId} className="hover:bg-gray-700/50">
										{contractType === ContractType.ERC1155 && (
											<td className="px-2 py-2 text-xs text-gray-300 truncate">
												{order.quantityAvailable}
											</td>
										)}
										<td className="px-2 py-2 text-xs text-gray-300 truncate">
											{order.priceAmountFormatted}
										</td>
										<td className="px-2 py-2 text-xs text-gray-300 truncate">
											{/* TODO: Add currency symbol */}
											---
										</td>
										<td className="px-2 py-2 text-xs text-gray-300">
											<div className="flex items-center gap-1">
												<div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
												{truncateMiddle(order.createdBy, 3, 3)}
											</div>
										</td>
										<td className="px-2 py-2 text-xs text-gray-300 truncate">
											{new Date(order.validUntil).toLocaleDateString()}
										</td>
										<td className="px-2 py-2 text-xs text-gray-300 truncate">
											{getMarketplaceDetails({
												originName: order.originName,
												kind: order.marketplace,
											})?.displayName || order.marketplace}
										</td>
										<td className="px-2 py-2 text-xs">
											<button
												type="button"
												className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
												onClick={() => handleAction(order)}
											>
												{compareAddress(order.createdBy, address)
													? cancellingOrderId === order.orderId
														? 'Cancelling...'
														: 'Cancel'
													: 'Buy'}
											</button>
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
								!listings?.page?.more
									? 'bg-gray-700 text-gray-500 cursor-not-allowed'
									: 'bg-gray-800 text-gray-300 hover:bg-gray-700'
							}`}
							onClick={() => setPage((prev) => prev + 1)}
							disabled={!listings?.page?.more}
						>
							Next
						</button>
					</div>
				</>
			) : (
				<div className="flex justify-center p-2">
					<p className="text-gray-300 text-sm">No listings available</p>
				</div>
			)}
		</div>
	);
}
