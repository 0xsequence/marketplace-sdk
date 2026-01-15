import { useTransferModalContext } from '@0xsequence/marketplace-sdk/react';
import { closeModal, useActiveModal } from '../../stores/modalStore';

export function TransferModal() {
	const activeModal = useActiveModal();

	if (activeModal !== 'transfer') return null;

	return <TransferModalContent />;
}

function TransferModalContent() {
	const ctx = useTransferModalContext();

	const handleClose = () => {
		ctx.close();
		closeModal();
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<div
				className="absolute inset-0 bg-black/60"
				onClick={handleClose}
				onKeyDown={(e) => e.key === 'Escape' && handleClose()}
			/>

			<div className="relative bg-gray-800 rounded-lg p-6 w-full max-w-md border border-gray-700">
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-lg font-semibold">Transfer NFT</h2>
					<button
						onClick={handleClose}
						className="text-gray-400 hover:text-white text-xl"
						type="button"
					>
						×
					</button>
				</div>

				{ctx.loading.collection ? (
					<div className="text-center py-8">
						<p className="text-gray-300">Loading...</p>
					</div>
				) : (
					<>
						<div className="flex gap-4 mb-4">
							<div className="w-20 h-20 rounded bg-gray-700 flex items-center justify-center">
								<span className="text-gray-500 text-xs">
									#{ctx.item.tokenId.toString()}
								</span>
							</div>
							<div>
								<p className="font-medium">
									Token #{ctx.item.tokenId.toString()}
								</p>
								<p className="text-sm text-gray-400 font-mono">
									{ctx.item.collectionAddress.slice(0, 6)}...
									{ctx.item.collectionAddress.slice(-4)}
								</p>
							</div>
						</div>

						{ctx.flow.isSuccess ? (
							<div className="text-center py-4">
								<p className="text-green-400 text-lg mb-4">
									Transfer successful!
								</p>
								{ctx.transactions.transfer && (
									<p className="text-sm text-gray-400 font-mono break-all mb-4">
										Tx: {ctx.transactions.transfer}
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
							<div className="space-y-4">
								<div>
									<label className="block text-sm text-gray-400 mb-1">
										Recipient Address
									</label>
									<input
										type="text"
										value={ctx.form.receiver.input}
										onChange={(e) => ctx.form.receiver.update(e.target.value)}
										onBlur={() => ctx.form.receiver.touch()}
										placeholder="0x..."
										disabled={ctx.flow.isPending}
										className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:border-blue-500 outline-none font-mono text-sm disabled:opacity-50"
									/>
									{ctx.form.errors.receiver && (
										<p className="text-red-400 text-sm mt-1">
											{ctx.form.errors.receiver}
										</p>
									)}
								</div>

								{ctx.queries.collection.data?.type === 'ERC1155' && (
									<div>
										<label className="block text-sm text-gray-400 mb-1">
											Quantity
										</label>
										<input
											type="number"
											value={ctx.form.quantity.input.toString()}
											onChange={(e) =>
												ctx.form.quantity.update(BigInt(e.target.value || '1'))
											}
											onBlur={() => ctx.form.quantity.touch()}
											min={1}
											disabled={ctx.flow.isPending}
											className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded disabled:opacity-50"
										/>
										{ctx.form.errors.quantity && (
											<p className="text-red-400 text-sm mt-1">
												{ctx.form.errors.quantity}
											</p>
										)}
									</div>
								)}

								<div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-3">
									<p className="text-yellow-300 text-sm">
										Items sent to the wrong wallet address cannot be recovered!
									</p>
								</div>

								{ctx.error && (
									<div className="text-red-400 text-sm p-2 bg-red-900/20 rounded">
										{ctx.error.message}
									</div>
								)}

								{ctx.formError && (
									<div className="text-red-400 text-sm">{ctx.formError}</div>
								)}

								<button
									onClick={ctx.actions.transfer.onClick}
									disabled={
										ctx.actions.transfer.disabled ||
										ctx.actions.transfer.loading
									}
									className="w-full py-3 bg-gray-600 hover:bg-gray-700 rounded text-white font-medium disabled:opacity-50"
									type="button"
								>
									{ctx.actions.transfer.loading
										? 'Transferring...'
										: ctx.actions.transfer.label}
								</button>
							</div>
						)}
					</>
				)}
			</div>
		</div>
	);
}
