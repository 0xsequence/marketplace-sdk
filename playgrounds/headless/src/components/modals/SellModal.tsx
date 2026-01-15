import { useSellModalContext } from '@0xsequence/marketplace-sdk/react';
import { formatUnits } from 'viem';
import { closeModal, useActiveModal } from '../../stores/modalStore';

export function SellModal() {
	const activeModal = useActiveModal();

	if (activeModal !== 'sell') return null;

	return <SellModalContent />;
}

function SellModalContent() {
	const ctx = useSellModalContext();

	const handleClose = () => {
		ctx.close();
		closeModal();
	};

	const formattedPrice =
		ctx.offer.priceAmount && ctx.offer.currency?.decimals
			? formatUnits(BigInt(ctx.offer.priceAmount), ctx.offer.currency.decimals)
			: ctx.offer.priceAmount;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<div
				className="absolute inset-0 bg-black/60"
				onClick={handleClose}
				onKeyDown={(e) => e.key === 'Escape' && handleClose()}
			/>

			<div className="relative bg-gray-800 rounded-lg p-6 w-full max-w-md border border-gray-700">
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-lg font-semibold">Accept Offer</h2>
					<button
						onClick={handleClose}
						className="text-gray-400 hover:text-white text-xl"
						type="button"
					>
						×
					</button>
				</div>

				{ctx.loading.collectible ? (
					<div className="text-center py-8">
						<p className="text-gray-300">Loading...</p>
					</div>
				) : (
					<>
						<div className="flex gap-4 mb-4">
							{ctx.queries.collectible.data?.image ? (
								<img
									src={ctx.queries.collectible.data.image}
									alt=""
									className="w-20 h-20 rounded object-cover"
								/>
							) : (
								<div className="w-20 h-20 rounded bg-gray-700 flex items-center justify-center">
									<span className="text-gray-500 text-xs">
										#{ctx.item.tokenId}
									</span>
								</div>
							)}
							<div>
								<p className="font-medium">
									{ctx.queries.collectible.data?.name ||
										`Token #${ctx.item.tokenId}`}
								</p>
								<p className="text-sm text-gray-400">
									{ctx.collection?.name || ''}
								</p>
							</div>
						</div>

						<div className="bg-gray-700 rounded-lg p-4 mb-4">
							<p className="text-gray-400 text-sm">Offer Amount</p>
							<p className="text-xl font-semibold text-green-400">
								{formattedPrice} {ctx.offer.currency?.symbol || ''}
							</p>
						</div>

						{ctx.flow.isSuccess ? (
							<div className="text-center py-4">
								<p className="text-green-400 text-lg mb-4">Sale completed!</p>
								{ctx.transactions.sell && (
									<p className="text-sm text-gray-400 font-mono break-all mb-4">
										Tx: {ctx.transactions.sell}
									</p>
								)}
								<button
									onClick={handleClose}
									className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded"
									type="button"
								>
									Close
								</button>
							</div>
						) : (
							<>
								{ctx.error && (
									<div className="text-red-400 text-sm p-2 bg-red-900/20 rounded mb-4">
										{ctx.error.message}
									</div>
								)}

								<div className="space-y-2">
									{ctx.actions.approve && (
										<button
											onClick={ctx.actions.approve.onClick}
											disabled={
												ctx.actions.approve.disabled ||
												ctx.actions.approve.loading
											}
											className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded text-white font-medium disabled:opacity-50"
											type="button"
										>
											{ctx.actions.approve.loading
												? 'Approving...'
												: ctx.actions.approve.label}
										</button>
									)}

									<button
										onClick={ctx.actions.sell.onClick}
										disabled={
											ctx.actions.sell.disabled || ctx.actions.sell.loading
										}
										className="w-full py-3 bg-orange-600 hover:bg-orange-700 rounded text-white font-medium disabled:opacity-50"
										type="button"
									>
										{ctx.actions.sell.loading
											? 'Accepting...'
											: ctx.actions.sell.label}
									</button>
								</div>
							</>
						)}
					</>
				)}
			</div>
		</div>
	);
}
