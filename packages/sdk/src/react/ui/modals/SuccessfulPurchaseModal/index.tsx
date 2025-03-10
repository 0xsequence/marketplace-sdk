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
import {
	closeButton,
	collectiblesGrid,
	collectiblesGridImage,
	collectiblesGridImagePale,
	collectiblesGridItem,
	dialogContent,
	dialogOverlay,
} from './styles.css';

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
				<Overlay className={dialogOverlay} />

				<Content className={dialogContent.narrow}>
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
						className={closeButton}
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
		<div className={`${collectiblesGrid} grid gap-2`}>
			{shownCollectibles.map((collectible) => {
				const showPlus = total > 4 && collectibles.indexOf(collectible) === 3;

				return (
					<div
						className={`${collectiblesGridItem} relative`}
						key={collectible.tokenId}
					>
						<Image
							className={`${showPlus ? collectiblesGridImagePale : collectiblesGridImage} aspect-square bg-background-secondary rounded-lg`}
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
