import { useMakeOfferModalContext } from '@0xsequence/marketplace-sdk/react';
import { closeModal, useActiveModal } from '../../stores/modalStore';
import { ErrorBoundary } from '../ui/ErrorBoundary';
import { ModalShell } from '../ui/ModalShell';

export function OfferModal() {
	const activeModal = useActiveModal();
	const isOpen = activeModal === 'offer';

	const handleClose = () => {
		closeModal();
	};

	return (
		<ModalShell title="Make Offer" isOpen={isOpen} onClose={handleClose}>
			<ErrorBoundary onReset={handleClose}>
				<OfferModalContent onClose={handleClose} />
			</ErrorBoundary>
		</ModalShell>
	);
}

function OfferModalContent({ onClose }: { onClose: () => void }) {
	const ctx = useMakeOfferModalContext();

	const handleClose = () => {
		ctx.close();
		onClose();
	};

	return (
		<>
			<div className="mb-4 flex gap-4">
				{ctx.collectible?.image ? (
					<img
						src={ctx.collectible.image}
						alt=""
						className="h-20 w-20 rounded object-cover"
					/>
				) : (
					<div className="flex h-20 w-20 items-center justify-center rounded bg-gray-700">
						<span className="text-gray-500 text-xs">
							#{ctx.tokenId.toString()}
						</span>
					</div>
				)}
				<div>
					<p className="font-medium">
						{ctx.collectible?.name || `Token #${ctx.tokenId.toString()}`}
					</p>
					<p className="text-gray-400 text-sm">{ctx.collection?.name || ''}</p>
				</div>
			</div>

			{ctx.flow.isSuccess ? (
				<div className="py-6 text-center">
					<p className="mb-4 text-green-400 text-lg">Offer submitted!</p>
					{ctx.transactions.offer && (
						<p className="mb-4 break-all font-mono text-gray-400 text-sm">
							Tx: {ctx.transactions.offer}
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
							htmlFor="offer-price"
							className="mb-1 block text-gray-400 text-sm"
						>
							Offer Price
						</label>
						<input
							id="offer-price"
							type="text"
							value={ctx.form.price.input}
							onChange={(e) => ctx.form.price.update(e.target.value)}
							onBlur={() => ctx.form.price.touch()}
							placeholder="0.00"
							disabled={ctx.flow.isPending}
							className="w-full rounded border border-gray-600 bg-gray-700 px-3 py-2 outline-none focus:border-blue-500 disabled:opacity-50"
						/>
						{ctx.form.errors.price && (
							<p className="mt-1 text-red-400 text-sm">
								{ctx.form.errors.price}
							</p>
						)}
					</div>

					<div>
						<label
							htmlFor="offer-currency"
							className="mb-1 block text-gray-400 text-sm"
						>
							Currency (ERC20 only)
						</label>
						<select
							id="offer-currency"
							value={ctx.currencies.selected?.contractAddress || ''}
							onChange={(e) =>
								ctx.currencies.select(e.target.value as `0x${string}`)
							}
							disabled={ctx.flow.isPending}
							className="w-full rounded border border-gray-600 bg-gray-700 px-3 py-2 disabled:opacity-50"
						>
							<option value="">Select currency</option>
							{ctx.currencies.available.map((currency) => (
								<option
									key={currency.contractAddress}
									value={currency.contractAddress}
								>
									{currency.symbol}
								</option>
							))}
						</select>
						{!ctx.currencies.isConfigured && (
							<p className="mt-1 text-red-400 text-sm">
								No currencies configured for this marketplace
							</p>
						)}
					</div>

					<div>
						<label
							htmlFor="offer-quantity"
							className="mb-1 block text-gray-400 text-sm"
						>
							Quantity
						</label>
						<input
							id="offer-quantity"
							type="text"
							value={ctx.form.quantity.input}
							onChange={(e) => ctx.form.quantity.update(e.target.value)}
							onBlur={() => ctx.form.quantity.touch()}
							disabled={ctx.flow.isPending}
							className="w-full rounded border border-gray-600 bg-gray-700 px-3 py-2 disabled:opacity-50"
						/>
						{ctx.form.errors.quantity && (
							<p className="mt-1 text-red-400 text-sm">
								{ctx.form.errors.quantity}
							</p>
						)}
					</div>

					{ctx.form.errors.balance && (
						<p className="text-sm text-yellow-400">{ctx.form.errors.balance}</p>
					)}

					{ctx.error && (
						<div className="rounded bg-red-900/20 p-2 text-red-400 text-sm">
							{ctx.error.message}
						</div>
					)}

					{ctx.formError && (
						<div className="text-red-400 text-sm">{ctx.formError}</div>
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
							onClick={ctx.actions.offer.onClick}
							disabled={ctx.actions.offer.disabled || ctx.actions.offer.loading}
							className="w-full rounded bg-blue-600 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
							type="button"
						>
							{ctx.actions.offer.loading
								? 'Submitting...'
								: ctx.actions.offer.label}
						</button>
					</div>
				</div>
			)}
		</>
	);
}
