'use client';

import {
	successfulPurchaseModal$,
	type SuccessfulPurchaseModalState,
} from './_store';
import {
	closeButton,
	collectiblesGrid,
	collectiblesGridItem,
	collectiblesGridImage,
	collectiblesGridImagePale,
	dialogContent,
	dialogOverlay,
} from './styles.css';
import {
	Box,
	Button,
	CloseIcon,
	ExternalLinkIcon,
	IconButton,
	Image,
	Text,
} from '@0xsequence/design-system';
import { observer } from '@legendapp/state/react';
import { Close, Content, Overlay, Portal, Root } from '@radix-ui/react-dialog';
import type { TokenMetadata } from '@types';

export const useSuccessfulPurchaseModal = () => {
	return {
		show: (args: SuccessfulPurchaseModalState['state']) =>
			successfulPurchaseModal$.open(args),
		close: () => successfulPurchaseModal$.close(),
	};
};

const SuccessfulPurchaseModal = observer(() => {
	return (
		<Root open={successfulPurchaseModal$.isOpen.get()}>
			<Portal>
				<Overlay className={dialogOverlay} />

				<Content className={dialogContent}>
					<Box display="flex" flexDirection="column" gap="4" width="full">
						<Text
							textAlign="center"
							fontSize="medium"
							fontWeight="bold"
							color="text100"
						>
							Successful purchase!
						</Text>

						<CollectiblesGrid
							collectibles={successfulPurchaseModal$.state.get().collectibles}
						/>

						<Box display="flex" alignItems="center" gap="1">
							<Text fontSize="normal" fontWeight="medium" color="text80">
								You bought
							</Text>

							<Text fontSize="normal" fontWeight="medium" color="text100">
								{successfulPurchaseModal$.state.get().collectibles.length}
							</Text>

							<Text fontSize="normal" fontWeight="medium" color="text80">
								items for
							</Text>

							<Text fontSize="normal" fontWeight="medium" color="text100">
								{successfulPurchaseModal$.state.get().totalPrice}
							</Text>
						</Box>

						<SuccessfulPurchaseActions />
					</Box>

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
		<Box display="flex" flexDirection="column" gap="2">
			{successfulPurchaseModal$.state.ctaOptions.get() && (
				<Button
					shape="square"
					leftIcon={
						successfulPurchaseModal$.state.ctaOptions.ctaIcon.get() || undefined
					}
					label={successfulPurchaseModal$.state.ctaOptions.ctaLabel.get()}
					width="full"
					onClick={
						successfulPurchaseModal$.state.ctaOptions.ctaOnClick.get() ||
						undefined
					}
				/>
			)}

			<Button
				as={'a'}
				href={successfulPurchaseModal$.state.explorerUrl.get()}
				target="_blank"
				rel="noopener noreferrer"
				shape="square"
				leftIcon={ExternalLinkIcon}
				label={`View on ${successfulPurchaseModal$.state.explorerName.get()}`}
				width="full"
			/>
		</Box>
	);
}

function CollectiblesGrid({ collectibles }: { collectibles: TokenMetadata[] }) {
	const total = collectibles.length;
	const shownCollectibles = total > 4 ? collectibles.slice(0, 4) : collectibles;

	return (
		<Box className={collectiblesGrid} display={'grid'} gap={'2'}>
			{shownCollectibles.map((collectible) => {
				const showPlus = total > 4 && collectibles.indexOf(collectible) === 3;

				return (
					<Box
						key={collectible.tokenId}
						className={collectiblesGridItem}
						position="relative"
					>
						<Image
							src={collectible.image}
							alt={collectible.name}
							className={
								showPlus ? collectiblesGridImagePale : collectiblesGridImage
							}
							aspectRatio="1/1"
							background="backgroundSecondary"
							borderRadius="sm"
						/>

						{showPlus && (
							<Box
								position="absolute"
								top="0"
								left="0"
								right="0"
								bottom="0"
								display="flex"
								alignItems="center"
								justifyContent="center"
								background="backgroundOverlay"
								backdropFilter="blur"
							>
								<Text
									fontSize="small"
									fontWeight="medium"
									color="text80"
									paddingX="2"
									paddingY="1.5"
									borderRadius="sm"
									background="backgroundSecondary"
									backdropFilter="blur"
								>
									{total} TOTAL
								</Text>
							</Box>
						)}
					</Box>
				);
			})}
		</Box>
	);
}

export default SuccessfulPurchaseModal;
