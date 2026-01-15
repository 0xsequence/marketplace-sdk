import { useSellModalContext } from '@0xsequence/marketplace-sdk/react';
import { formatUnits } from 'viem';
import { closeModal, useActiveModal } from '../../stores/modalStore';
import { ErrorBoundary } from '../ui/ErrorBoundary';
import { ModalShell } from '../ui/ModalShell';

export function SellModal() {
	const activeModal = useActiveModal();
	const isOpen = activeModal === 'sell';

	const handleClose = () => {
		closeModal();
	};

	return (
		<ModalShell title="Accept Offer" isOpen={isOpen} onClose={handleClose}>
			<ErrorBoundary onReset={handleClose}>
				<SellModalContent onClose={handleClose} />
			</ErrorBoundary>
		</ModalShell>
	);
}

function SellModalContent({ onClose }: { onClose: () => void }) {
	const ctx = useSellModalContext();

	const handleClose = () => {
		ctx.close();
		onClose();
	};

	const formattedPrice =
		ctx.offer.priceAmount && ctx.offer.currency?.decimals
			? formatUnits(BigInt(ctx.offer.priceAmount), ctx.offer.currency.decimals)
			: ctx.offer.priceAmount;

	if (ctx.loading.collectible) {
		return (
			<div className="py-8 text-center">
				<p className="text-gray-300">Loading...</p>
			</div>
		);
	}

	return (
		<>
			<div className="mb-4 flex gap-4">
				{ctx.queries.collectible.data?.image ? (
					<img
						src={ctx.queries.collectible.data.image}
						alt=""
						className="h-20 w-20 rounded object-cover"
					/>
				) : (
					<div className="flex h-20 w-20 items-center justify-center rounded bg-gray-700">
						<span className="text-gray-500 text-xs">#{ctx.item.tokenId}</span>
					</div>
				)}
				<div>
					<p className="font-medium">
						{ctx.queries.collectible.data?.name || `Token #${ctx.item.tokenId}`}
					</p>
					<p className="text-gray-400 text-sm">{ctx.collection?.name || ''}</p>
				</div>
			</div>

			<div className="mb-4 rounded-lg bg-gray-700 p-4">
				<p className="text-gray-400 text-sm">Offer Amount</p>
				<p className="font-semibold text-green-400 text-xl">
					{formattedPrice} {ctx.offer.currency?.symbol || ''}
				</p>
			</div>

			{ctx.flow.isSuccess ? (
				<div className="py-4 text-center">
					<p className="mb-4 text-green-400 text-lg">Sale completed!</p>
					{ctx.transactions.sell && (
						<p className="mb-4 break-all font-mono text-gray-400 text-sm">
							Tx: {ctx.transactions.sell}
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
				<>
					{ctx.error && (
						<div className="mb-4 rounded bg-red-900/20 p-2 text-red-400 text-sm">
							{ctx.error.message}
						</div>
					)}

					<div className="space-y-2">
						{ctx.actions.approve && (
							<button
								onClick={ctx.actions.approve.onClick}
								disabled={
									ctx.actions.approve.disabled || ctx.actions.approve.loading
								}
								className="w-full rounded bg-blue-600 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
								type="button"
							>
								{ctx.actions.approve.loading
									? 'Approving...'
									: ctx.actions.approve.label}
							</button>
						)}

						<button
							onClick={ctx.actions.sell.onClick}
							disabled={ctx.actions.sell.disabled || ctx.actions.sell.loading}
							className="w-full rounded bg-orange-600 py-3 font-medium text-white hover:bg-orange-700 disabled:opacity-50"
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
	);
}
