'use client';

import {
	Button,
	ExternalLinkIcon,
	Image,
	Modal,
	Text,
} from '@0xsequence/design-system';
import { observer, use$ } from '@legendapp/state/react';
import type { JSX } from 'react/jsx-runtime';
import type { TokenMetadata } from '../../../_internal';
import type { ModalCallbacks } from '../_internal/types';
import {
	type SuccessfulPurchaseModalState,
	successfulPurchaseModal$,
} from './_store';

export const useSuccessfulPurchaseModal = (callbacks?: ModalCallbacks) => {
	return {
		show: (args: SuccessfulPurchaseModalState['state']): void =>
			successfulPurchaseModal$.open({ ...args, defaultCallbacks: callbacks }),
		close: (): void => successfulPurchaseModal$.close(),
	};
};

const SuccessfulPurchaseModal: () => JSX.Element | null = observer(
	(): JSX.Element | null => {
		const handleClose = () => {
			successfulPurchaseModal$.close();
		};
		const isOpen = use$(successfulPurchaseModal$.isOpen);

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

					<CollectiblesGrid
						collectibles={successfulPurchaseModal$.state.get().collectibles}
					/>

					<div className="flex items-center gap-1">
						<Text className="text-base" fontWeight="medium" color="text80">
							You bought
						</Text>

						<Text className="text-base" fontWeight="medium" color="text100">
							{successfulPurchaseModal$.state.get().collectibles.length}
						</Text>

						<Text className="text-base" fontWeight="medium" color="text80">
							items for
						</Text>

						<Text className="text-base" fontWeight="medium" color="text100">
							{successfulPurchaseModal$.state.get().totalPrice}
						</Text>
					</div>

					<SuccessfulPurchaseActions />
				</div>
			</Modal>
		);
	},
);

function SuccessfulPurchaseActions() {
	return (
		<div className="flex flex-col gap-2">
			{successfulPurchaseModal$.state.ctaOptions.get() && (
				<Button
					className="w-full"
					shape="square"
					leftIcon={
						successfulPurchaseModal$.state.ctaOptions.ctaIcon.get() || undefined
					}
					label={successfulPurchaseModal$.state.ctaOptions.ctaLabel.get()}
					onClick={
						successfulPurchaseModal$.state.ctaOptions.ctaOnClick.get() ||
						undefined
					}
				/>
			)}
			<Button
				className="w-full"
				as={'a'}
				href={successfulPurchaseModal$.state.explorerUrl.get()}
				target="_blank"
				rel="noopener noreferrer"
				shape="square"
				leftIcon={ExternalLinkIcon}
				label={`View on ${successfulPurchaseModal$.state.explorerName.get()}`}
			/>
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
