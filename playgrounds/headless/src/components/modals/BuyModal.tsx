import { useBuyModalContext } from '@0xsequence/marketplace-sdk/react';
import { closeModal, useActiveModal } from '../../stores/modalStore';
import { ErrorBoundary } from '../ui/ErrorBoundary';
import { ModalShell } from '../ui/ModalShell';

export function BuyModal() {
	const activeModal = useActiveModal();
	const isOpen = activeModal === 'buy';

	const handleClose = () => {
		closeModal();
	};

	return (
		<ModalShell title="Buy NFT" isOpen={isOpen} onClose={handleClose}>
			<ErrorBoundary onReset={handleClose}>
				<BuyModalContent onClose={handleClose} />
			</ErrorBoundary>
		</ModalShell>
	);
}

function BuyModalContent({ onClose }: { onClose: () => void }) {
	const ctx = useBuyModalContext();

	const handleClose = () => {
		ctx.close();
		onClose();
	};

	if (ctx.isLoading) {
		return (
			<div className="py-8 text-center">
				<p className="text-gray-300">Loading...</p>
			</div>
		);
	}

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
					<div className="h-20 w-20 rounded bg-gray-700" />
				)}
				<div>
					<p className="font-medium">{ctx.collectible?.name || 'Loading...'}</p>
					<p className="text-gray-400 text-sm">{ctx.collection?.name || ''}</p>
				</div>
			</div>

			{ctx.buyStep?.price && (
				<div className="mb-4 rounded-lg bg-gray-700 p-4">
					<p className="text-gray-400 text-sm">Price</p>
					<p className="font-semibold text-green-400 text-xl">
						{ctx.formattedAmount || ctx.buyStep.price}
					</p>
				</div>
			)}

			{ctx.checkoutMode && (
				<div className="mb-4 text-gray-400 text-sm">
					Checkout mode:{' '}
					{typeof ctx.checkoutMode === 'string'
						? ctx.checkoutMode
						: ctx.checkoutMode.mode}
				</div>
			)}

			{ctx.steps && ctx.steps.length > 0 && (
				<div className="mb-4 space-y-2">
					<p className="text-gray-400 text-sm">Transaction Steps:</p>
					{ctx.steps.map((step, index) => (
						<div key={step.id} className="rounded bg-gray-700 p-2 text-sm">
							{index + 1}. {step.id}
						</div>
					))}
				</div>
			)}

			<div className="space-y-2">
				{ctx.checkoutMode === 'crypto' && ctx.buyStep && (
					<p className="text-center text-gray-400 text-sm">
						Crypto checkout ready - integrate with your payment flow
					</p>
				)}

				{ctx.checkoutMode === 'trails' && (
					<p className="text-center text-gray-400 text-sm">
						Trails checkout mode - requires additional integration
					</p>
				)}

				<button
					onClick={handleClose}
					className="w-full rounded bg-gray-600 py-2 text-white hover:bg-gray-700"
					type="button"
				>
					Cancel
				</button>
			</div>
		</>
	);
}
