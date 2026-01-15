import { useBuyModalContext } from '@0xsequence/marketplace-sdk/react';
import { closeModal, useActiveModal } from '../../stores/modalStore';

export function BuyModal() {
	const activeModal = useActiveModal();

	if (activeModal !== 'buy') return null;

	return <BuyModalContent />;
}

function BuyModalContent() {
	const ctx = useBuyModalContext();

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
					<h2 className="text-lg font-semibold">Buy NFT</h2>
					<button
						onClick={handleClose}
						className="text-gray-400 hover:text-white text-xl"
						type="button"
					>
						×
					</button>
				</div>

				{ctx.isLoading && (
					<div className="text-center py-8">
						<p className="text-gray-300">Loading...</p>
					</div>
				)}

				{!ctx.isLoading && (
					<>
						<div className="flex gap-4 mb-4">
							{ctx.collectible?.image ? (
								<img
									src={ctx.collectible.image}
									alt=""
									className="w-20 h-20 rounded object-cover"
								/>
							) : (
								<div className="w-20 h-20 rounded bg-gray-700" />
							)}
							<div>
								<p className="font-medium">
									{ctx.collectible?.name || 'Loading...'}
								</p>
								<p className="text-sm text-gray-400">
									{ctx.collection?.name || ''}
								</p>
							</div>
						</div>

						{ctx.buyStep?.price && (
							<div className="bg-gray-700 rounded-lg p-4 mb-4">
								<p className="text-gray-400 text-sm">Price</p>
								<p className="text-xl font-semibold text-green-400">
									{ctx.formattedAmount || ctx.buyStep.price}
								</p>
							</div>
						)}

						{ctx.checkoutMode && (
							<div className="text-sm text-gray-400 mb-4">
								Checkout mode:{' '}
								{typeof ctx.checkoutMode === 'string'
									? ctx.checkoutMode
									: ctx.checkoutMode.mode}
							</div>
						)}

						{ctx.steps && ctx.steps.length > 0 && (
							<div className="mb-4 space-y-2">
								<p className="text-sm text-gray-400">Transaction Steps:</p>
								{ctx.steps.map((step, index) => (
									<div
										key={step.id}
										className="text-sm bg-gray-700 rounded p-2"
									>
										{index + 1}. {step.id}
									</div>
								))}
							</div>
						)}

						<div className="space-y-2">
							{ctx.checkoutMode === 'crypto' && ctx.buyStep && (
								<button
									onClick={() => {
										console.log('Buy step:', ctx.buyStep);
									}}
									className="w-full py-3 bg-green-600 hover:bg-green-700 rounded text-white font-medium disabled:opacity-50"
									type="button"
								>
									Confirm Purchase
								</button>
							)}

							{ctx.checkoutMode === 'trails' && (
								<p className="text-center text-gray-400 text-sm">
									Trails checkout mode - requires additional integration
								</p>
							)}

							<button
								onClick={handleClose}
								className="w-full py-2 bg-gray-600 hover:bg-gray-700 rounded text-white"
								type="button"
							>
								Cancel
							</button>
						</div>
					</>
				)}
			</div>
		</div>
	);
}
