import { useMakeOfferModalContext } from '@0xsequence/marketplace-sdk/react';
import { closeModal, useActiveModal } from '../../stores/modalStore';

export function OfferModal() {
	const activeModal = useActiveModal();

	if (activeModal !== 'offer') return null;

	return <OfferModalContent />;
}

function OfferModalContent() {
	const ctx = useMakeOfferModalContext();

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
					<h2 className="text-lg font-semibold">Make Offer</h2>
					<button
						onClick={handleClose}
						className="text-gray-400 hover:text-white text-xl"
						type="button"
					>
						×
					</button>
				</div>

				<div className="flex gap-4 mb-4">
					{ctx.collectible?.image ? (
						<img
							src={ctx.collectible.image}
							alt=""
							className="w-20 h-20 rounded object-cover"
						/>
					) : (
						<div className="w-20 h-20 rounded bg-gray-700 flex items-center justify-center">
							<span className="text-gray-500 text-xs">
								#{ctx.tokenId.toString()}
							</span>
						</div>
					)}
					<div>
						<p className="font-medium">
							{ctx.collectible?.name || `Token #${ctx.tokenId.toString()}`}
						</p>
						<p className="text-sm text-gray-400">
							{ctx.collection?.name || ''}
						</p>
					</div>
				</div>

				{ctx.flow.isSuccess ? (
					<div className="text-center py-6">
						<p className="text-green-400 text-lg mb-4">Offer submitted!</p>
						{ctx.transactions.offer && (
							<p className="text-sm text-gray-400 font-mono break-all mb-4">
								Tx: {ctx.transactions.offer}
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
								Offer Price
							</label>
							<input
								type="text"
								value={ctx.form.price.input}
								onChange={(e) => ctx.form.price.update(e.target.value)}
								onBlur={() => ctx.form.price.touch()}
								placeholder="0.00"
								disabled={ctx.flow.isPending}
								className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:border-blue-500 outline-none disabled:opacity-50"
							/>
							{ctx.form.errors.price && (
								<p className="text-red-400 text-sm mt-1">
									{ctx.form.errors.price}
								</p>
							)}
						</div>

						<div>
							<label className="block text-sm text-gray-400 mb-1">
								Currency (ERC20 only)
							</label>
							<select
								value={ctx.currencies.selected?.contractAddress || ''}
								onChange={(e) =>
									ctx.currencies.select(e.target.value as `0x${string}`)
								}
								disabled={ctx.flow.isPending}
								className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded disabled:opacity-50"
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
								<p className="text-red-400 text-sm mt-1">
									No currencies configured for this marketplace
								</p>
							)}
						</div>

						<div>
							<label className="block text-sm text-gray-400 mb-1">
								Quantity
							</label>
							<input
								type="text"
								value={ctx.form.quantity.input}
								onChange={(e) => ctx.form.quantity.update(e.target.value)}
								onBlur={() => ctx.form.quantity.touch()}
								disabled={ctx.flow.isPending}
								className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded disabled:opacity-50"
							/>
							{ctx.form.errors.quantity && (
								<p className="text-red-400 text-sm mt-1">
									{ctx.form.errors.quantity}
								</p>
							)}
						</div>

						{ctx.form.errors.balance && (
							<p className="text-yellow-400 text-sm">
								{ctx.form.errors.balance}
							</p>
						)}

						{ctx.error && (
							<div className="text-red-400 text-sm p-2 bg-red-900/20 rounded">
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
									className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded text-white font-medium disabled:opacity-50"
									type="button"
								>
									{ctx.actions.approve.loading
										? 'Approving...'
										: ctx.actions.approve.label}
								</button>
							)}

							<button
								onClick={ctx.actions.offer.onClick}
								disabled={
									ctx.actions.offer.disabled || ctx.actions.offer.loading
								}
								className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded text-white font-medium disabled:opacity-50"
								type="button"
							>
								{ctx.actions.offer.loading
									? 'Submitting...'
									: ctx.actions.offer.label}
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
