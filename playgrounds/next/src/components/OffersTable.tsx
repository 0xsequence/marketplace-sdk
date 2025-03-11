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
	useBalanceOfCollectible,
	useCancelOrder,
	useCountOffersForCollectible,
	useListOffersForCollectible,
	useSellModal,
} from '@0xsequence/marketplace-sdk/react';
import { useState } from 'react';
import { useAccount } from 'wagmi';

export function OffersTable({ contractType }: { contractType: ContractType }) {
	const { collectionAddress, chainId, collectibleId } = usePlayground();
	const [page, setPage] = useState(1);
	const { address } = useAccount();
	const pageSize = 5;

	const { data: balance } = useBalanceOfCollectible({
		collectionAddress,
		chainId,
		collectableId: collectibleId,
		userAddress: address,
	});

	const { data: offers, isLoading } = useListOffersForCollectible({
		collectionAddress,
		chainId,
		collectibleId,
		page: {
			page: page,
			pageSize,
		},
	});

	const { data: countOfOffers } = useCountOffersForCollectible({
		collectionAddress,
		chainId,
		collectibleId,
	});

	const { cancelOrder, cancellingOrderId } = useCancelOrder({
		collectionAddress,
		chainId,
		onSuccess: () => {
			console.log('Offer cancelled successfully');
		},
		onError: (error) => {
			console.error('Error cancelling offer', error);
		},
	});

	const { show: openSellModal } = useSellModal({
		onSuccess: ({ hash }) => {
			console.log('Collectible sold successfully', hash);
		},
		onError: (error) => {
			console.error('Error selling collectible', error);
		},
	});

	const owned = balance?.balance || 0;

	const handleAction = async (order: Order) => {
		if (compareAddress(order.createdBy, address)) {
			await cancelOrder({
				orderId: order.orderId,
				marketplace: order.marketplace,
			});
		} else if (owned) {
			openSellModal({
				collectionAddress,
				chainId,
				tokenId: collectibleId,
				order,
			});
		}
	};

	const getActionLabel = (order: Order) => {
		if (compareAddress(order.createdBy, address)) {
			return cancellingOrderId === order.orderId ? 'Cancelling...' : 'Cancel';
		}
		if (owned) {
			return 'Sell';
		}
		return null;
	};

	return (
		<div className="flex flex-col gap-3 rounded-lg border border-gray-700/30 bg-gray-800 p-3 shadow-md">
			<div className="flex items-center justify-between">
				<h3 className="font-semibold text-base text-white">
					{`${countOfOffers?.count || 0} offers for this collectible`}
				</h3>
			</div>

			{isLoading ? (
				<div className="flex justify-center p-2">
					<p className="text-gray-300 text-sm">Loading offers...</p>
				</div>
			) : offers?.offers?.length ? (
				<>
					<div className="overflow-x-auto">
						<table className="w-full table-fixed divide-y divide-gray-700">
							<thead>
								<tr>
									{contractType === ContractType.ERC1155 && (
										<th className="w-[10%] px-2 py-2 text-left font-medium text-gray-400 text-xs uppercase tracking-wider">
											Qty
										</th>
									)}
									<th className="w-[15%] px-2 py-2 text-left font-medium text-gray-400 text-xs uppercase tracking-wider">
										Price
									</th>
									<th className="w-[10%] px-2 py-2 text-left font-medium text-gray-400 text-xs uppercase tracking-wider">
										Curr
									</th>
									<th className="w-[20%] px-2 py-2 text-left font-medium text-gray-400 text-xs uppercase tracking-wider">
										Buyer
									</th>
									<th className="w-[15%] px-2 py-2 text-left font-medium text-gray-400 text-xs uppercase tracking-wider">
										Exp
									</th>
									<th className="w-[15%] px-2 py-2 text-left font-medium text-gray-400 text-xs uppercase tracking-wider">
										Market
									</th>
									<th className="w-[15%] px-2 py-2 text-left font-medium text-gray-400 text-xs uppercase tracking-wider">
										Actions
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-700">
								{offers.offers.map((order) => (
									<tr key={order.orderId} className="hover:bg-gray-700/50">
										{contractType === ContractType.ERC1155 && (
											<td className="truncate px-2 py-2 text-gray-300 text-xs">
												{order.quantityAvailable}
											</td>
										)}
										<td className="truncate px-2 py-2 text-gray-300 text-xs">
											{order.priceAmountFormatted}
										</td>
										<td className="truncate px-2 py-2 text-gray-300 text-xs">
											{order.priceCurrencySymbol}
										</td>
										<td className="px-2 py-2 text-gray-300 text-xs">
											<div className="flex items-center gap-1">
												<div className="h-4 w-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
												{truncateMiddle(order.createdBy, 3, 3)}
											</div>
										</td>
										<td className="truncate px-2 py-2 text-gray-300 text-xs">
											{new Date(order.validUntil).toLocaleDateString()}
										</td>
										<td className="truncate px-2 py-2 text-gray-300 text-xs">
											{getMarketplaceDetails({
												originName: order.originName,
												kind: order.marketplace,
											})?.displayName || order.marketplace}
										</td>
										<td className="px-2 py-2 text-xs">
											{getActionLabel(order) && (
												<button
													type="button"
													className="rounded bg-blue-600 px-2 py-1 text-white text-xs transition-colors hover:bg-blue-700"
													onClick={() => handleAction(order)}
												>
													{getActionLabel(order)}
												</button>
											)}
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
								!offers?.page?.more
									? 'cursor-not-allowed bg-gray-700 text-gray-500'
									: 'bg-gray-800 text-gray-300 hover:bg-gray-700'
							}`}
							onClick={() => setPage((prev) => prev + 1)}
							disabled={!offers?.page?.more}
						>
							Next
						</button>
					</div>
				</>
			) : (
				<div className="flex justify-center p-2">
					<p className="text-gray-300 text-sm">No offers available</p>
				</div>
			)}
		</div>
	);
}
