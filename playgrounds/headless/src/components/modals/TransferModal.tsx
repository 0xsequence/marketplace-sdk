import { useTransferModalContext } from '@0xsequence/marketplace-sdk/react';
import { closeModal, useActiveModal } from '../../stores/modalStore';
import { ErrorBoundary } from '../ui/ErrorBoundary';
import { ModalShell } from '../ui/ModalShell';

export function TransferModal() {
	const activeModal = useActiveModal();
	const isOpen = activeModal === 'transfer';

	const handleClose = () => {
		closeModal();
	};

	return (
		<ModalShell title="Transfer NFT" isOpen={isOpen} onClose={handleClose}>
			<ErrorBoundary onReset={handleClose}>
				<TransferModalContent onClose={handleClose} />
			</ErrorBoundary>
		</ModalShell>
	);
}

function TransferModalContent({ onClose }: { onClose: () => void }) {
	const ctx = useTransferModalContext();

	const handleClose = () => {
		ctx.close();
		onClose();
	};

	if (ctx.loading.collection) {
		return (
			<div className="py-8 text-center">
				<p className="text-gray-300">Loading...</p>
			</div>
		);
	}

	return (
		<>
			<div className="mb-4 flex gap-4">
				<div className="flex h-20 w-20 items-center justify-center rounded bg-gray-700">
					<span className="text-gray-500 text-xs">
						#{ctx.item.tokenId.toString()}
					</span>
				</div>
				<div>
					<p className="font-medium">Token #{ctx.item.tokenId.toString()}</p>
					<p className="font-mono text-gray-400 text-sm">
						{ctx.item.collectionAddress.slice(0, 6)}...
						{ctx.item.collectionAddress.slice(-4)}
					</p>
				</div>
			</div>

			{ctx.flow.isSuccess ? (
				<div className="py-4 text-center">
					<p className="mb-4 text-green-400 text-lg">Transfer successful!</p>
					{ctx.transactions.transfer && (
						<p className="mb-4 break-all font-mono text-gray-400 text-sm">
							Tx: {ctx.transactions.transfer}
						</p>
					)}
					<button
						onClick={handleClose}
						className="rounded bg-gray-600 px-4 py-2 hover:bg-gray-700"
						type="button"
					>
						Close
					</button>
				</div>
			) : (
				<div className="space-y-4">
					<div>
						<label
							htmlFor="receiver-address"
							className="mb-1 block text-gray-400 text-sm"
						>
							Recipient Address
						</label>
						<input
							id="receiver-address"
							type="text"
							value={ctx.form.receiver.input}
							onChange={(e) => ctx.form.receiver.update(e.target.value)}
							onBlur={() => ctx.form.receiver.touch()}
							placeholder="0x..."
							disabled={ctx.flow.isPending}
							className="w-full rounded border border-gray-600 bg-gray-700 px-3 py-2 font-mono text-sm outline-none focus:border-blue-500 disabled:opacity-50"
						/>
						{ctx.form.errors.receiver && (
							<p className="mt-1 text-red-400 text-sm">
								{ctx.form.errors.receiver}
							</p>
						)}
					</div>

					{ctx.queries.collection.data?.type === 'ERC1155' && (
						<div>
							<label
								htmlFor="transfer-quantity"
								className="mb-1 block text-gray-400 text-sm"
							>
								Quantity
							</label>
							<input
								id="transfer-quantity"
								type="number"
								value={ctx.form.quantity.input.toString()}
								onChange={(e) =>
									ctx.form.quantity.update(BigInt(e.target.value || '1'))
								}
								onBlur={() => ctx.form.quantity.touch()}
								min={1}
								disabled={ctx.flow.isPending}
								className="w-full rounded border border-gray-600 bg-gray-700 px-3 py-2 disabled:opacity-50"
							/>
							{ctx.form.errors.quantity && (
								<p className="mt-1 text-red-400 text-sm">
									{ctx.form.errors.quantity}
								</p>
							)}
						</div>
					)}

					<div className="rounded-lg border border-yellow-700 bg-yellow-900/30 p-3">
						<p className="text-sm text-yellow-300">
							Items sent to the wrong wallet address cannot be recovered!
						</p>
					</div>

					{ctx.error && (
						<div className="rounded bg-red-900/20 p-2 text-red-400 text-sm">
							{ctx.error.message}
						</div>
					)}

					{ctx.formError && (
						<div className="text-red-400 text-sm">{ctx.formError}</div>
					)}

					<button
						onClick={ctx.actions.transfer.onClick}
						disabled={
							ctx.actions.transfer.disabled || ctx.actions.transfer.loading
						}
						className="w-full rounded bg-gray-600 py-3 font-medium text-white hover:bg-gray-700 disabled:opacity-50"
						type="button"
					>
						{ctx.actions.transfer.loading
							? 'Transferring...'
							: ctx.actions.transfer.label}
					</button>
				</div>
			)}
		</>
	);
}
