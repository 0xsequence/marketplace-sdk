'use client';

import {
	Button,
	ExternalLinkIcon,
	Image,
	Modal,
	Text,
} from '@0xsequence/design-system';
import type { TokenMetadata } from '../../../_internal';
import type { ModalCallbacks } from '../_internal/types';
import {
	type SuccessfulPurchaseModalState,
	successfulPurchaseModal,
	useIsOpen,
	useModalState,
} from './store';

export const useSuccessfulPurchaseModal = (callbacks?: ModalCallbacks) => {
	return {
		show: (args: SuccessfulPurchaseModalState['state']) =>
			successfulPurchaseModal.open({ ...args, defaultCallbacks: callbacks }),
		close: () => successfulPurchaseModal.close(),
	};
};

const SuccessfulPurchaseModal = () => {
	const handleClose = () => {
		successfulPurchaseModal.close();
	};
	const isOpen = useIsOpen();
	const modalState = useModalState();

	if (!isOpen) return null;

	return (
		<Modal
			isDismissible={true}
			onClose={handleClose}
			size="sm"
			backdropColor="backgroundBackdrop"
		>
			<div className="flex w-full flex-col gap-4 p-6">
				<Text
					className="text-center text-large"
					fontWeight="bold"
					color="text100"
				>
					Successful purchase!
				</Text>

				<CollectiblesGrid collectibles={modalState.collectibles} />

				<div className="flex items-center gap-1">
					<Text className="text-base" fontWeight="medium" color="text80">
						You bought
					</Text>

					<Text className="text-base" fontWeight="medium" color="text100">
						{modalState.collectibles.length}
					</Text>

					<Text className="text-base" fontWeight="medium" color="text80">
						items for
					</Text>

					<Text className="text-base" fontWeight="medium" color="text100">
						{modalState.totalPrice}
					</Text>
				</div>

				<SuccessfulPurchaseActions modalState={modalState} />
			</div>
		</Modal>
	);
};

function SuccessfulPurchaseActions({
	modalState,
}: { modalState: SuccessfulPurchaseModalState['state'] }) {
	return (
		<div className="flex flex-col gap-2">
			{modalState.ctaOptions && (
				<Button
					className="w-full"
					shape="square"
					leftIcon={modalState.ctaOptions.ctaIcon || undefined}
					label={modalState.ctaOptions.ctaLabel}
					onClick={modalState.ctaOptions.ctaOnClick || undefined}
				/>
			)}
			<a
				href={modalState.explorerUrl}
				target="_blank"
				rel="noopener noreferrer"
				className="w-full"
			>
				<Button
					shape="square"
					leftIcon={ExternalLinkIcon}
					label={`View on ${modalState.explorerName}`}
				/>
			</a>
		</div>
	);
}

function CollectiblesGrid({ collectibles }: { collectibles: TokenMetadata[] }) {
	const total = collectibles.length;
	const shownCollectibles = total > 4 ? collectibles.slice(0, 4) : collectibles;

	return (
		<div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-2 [&:has(div:nth-child(4))>div]:col-[unset] [&>div:nth-child(1):only-child]:h-[312px] [&>div:nth-child(1):only-child]:w-[312px] [&>div:nth-child(3)]:col-[1/-1] [&>div:nth-child(3)]:justify-self-center">
			{shownCollectibles.map((collectible) => {
				const showPlus = total > 4 && collectibles.indexOf(collectible) === 3;

				return (
					<div
						className="relative h-[150px] w-[150px]"
						key={collectible.tokenId}
					>
						<Image
							className={`aspect-square h-full w-full rounded-lg bg-background-secondary object-contain ${showPlus ? 'opacity-[0.4_!important]' : ''}`}
							src={collectible.image}
							alt={collectible.name}
						/>
						{showPlus && (
							<div className="absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center bg-background-overlay backdrop-blur-md">
								<Text
									className="rounded-lg bg-background-secondary px-2 py-1.5 text-sm backdrop-blur-md"
									fontWeight="medium"
									color="text80"
								>
									{total} TOTAL
								</Text>
							</div>
						)}
					</div>
				);
			})}
		</div>
	);
}

export default SuccessfulPurchaseModal;
