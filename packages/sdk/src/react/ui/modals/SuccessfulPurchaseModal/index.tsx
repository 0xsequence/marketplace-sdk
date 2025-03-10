'use client';

import {
	Button,
	CloseIcon,
	ExternalLinkIcon,
	IconButton,
	Image,
	Text,
} from '@0xsequence/design-system';
import { observer } from '@legendapp/state/react';
import { Close, Content, Overlay, Portal, Root } from '@radix-ui/react-dialog';
import type { TokenMetadata } from '../../../_internal';
import type { ModalCallbacks } from '../_internal/types';
import {
	type SuccessfulPurchaseModalState,
	successfulPurchaseModal$,
} from './_store';

export const useSuccessfulPurchaseModal = (callbacks?: ModalCallbacks) => {
	return {
		show: (args: SuccessfulPurchaseModalState['state']) =>
			successfulPurchaseModal$.open({ ...args, defaultCallbacks: callbacks }),
		close: () => successfulPurchaseModal$.close(),
	};
};

const SuccessfulPurchaseModal = observer(() => {
	return (
		<Root open={successfulPurchaseModal$.isOpen.get()}>
			<Portal>
				<Overlay className="bg-background-backdrop fixed inset-0 z-20" />

				<Content className="flex bg-background-primary rounded-2xl fixed z-20 w-[360px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-6 max-sm:w-full max-sm:bottom-0 max-sm:transform-none max-sm:top-auto max-sm:left-auto max-sm:rounded-b-none">
					<div className="flex flex-col gap-4 w-full">
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

					<Close
						onClick={() => {
							successfulPurchaseModal$.close();
						}}
						className="absolute right-6 top-6"
						asChild
					>
						<IconButton size="xs" aria-label="Close modal" icon={CloseIcon} />
					</Close>
				</Content>
			</Portal>
		</Root>
	);
});

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
		<div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-2 [&>div:nth-child(1):only-child]:w-[312px] [&>div:nth-child(1):only-child]:h-[312px] [&>div:nth-child(3)]:col-[1/-1] [&>div:nth-child(3)]:justify-self-center [&:has(div:nth-child(4))>div]:col-[unset]">
			{shownCollectibles.map((collectible) => {
				const showPlus = total > 4 && collectibles.indexOf(collectible) === 3;

				return (
					<div
						className="w-[150px] h-[150px] relative"
						key={collectible.tokenId}
					>
						<Image
							className={`w-full h-full object-contain aspect-square bg-background-secondary rounded-lg ${showPlus ? 'opacity-[0.4_!important]' : ''}`}
							src={collectible.image}
							alt={collectible.name}
						/>
						{showPlus && (
							<div className="flex absolute top-0 left-0 right-0 bottom-0 items-center justify-center bg-background-overlay backdrop-blur-md">
								<Text
									className="text-sm px-2 py-1.5 rounded-lg bg-background-secondary backdrop-blur-md"
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
