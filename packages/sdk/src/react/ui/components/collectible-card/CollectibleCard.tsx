import { useState } from 'react';

import { Box, IconButton, Skeleton } from '@0xsequence/design-system';
import type { Hex } from 'viem';
import type {
	ChainId,
	CollectibleOrder,
	ContractType,
	Order,
	OrderbookKind,
} from '../../../_internal';
import { useCurrency } from '../../../hooks';
import ChessTileImage from '../../images/chess-tile.png';
import SvgDiamondEyeIcon from '../../images/marketplaces/LooksRare';
import { ActionButton } from '../_internals/action-button/ActionButton';
import { CollectibleCardAction } from '../_internals/action-button/types';
import { Footer } from './Footer';
import {
	actionWrapper,
	collectibleCard,
	collectibleImage,
	collectibleTileWrapper,
} from './styles.css';

function CollectibleSkeleton() {
	return (
		<Box
			className={collectibleCard}
			borderRadius="md"
			overflow="hidden"
			background="backgroundPrimary"
			data-testid="loading-skeleton"
		>
			<Skeleton
				size="lg"
				style={{ width: '100%', height: 164, borderRadius: 0, paddingTop: 16 }}
			/>

			<Box
				display="flex"
				flexDirection="column"
				gap="2"
				paddingX="4"
				paddingBottom="4"
				marginTop="2"
			>
				<Skeleton size="lg" />

				<Skeleton size="sm" />
			</Box>
		</Box>
	);
}

type CollectibleCardProps = {
	collectibleId: string;
	chainId: ChainId;
	collectionAddress: Hex;
	orderbookKind?: OrderbookKind;
	collectionType?: ContractType;
	lowestListing: CollectibleOrder | undefined;
	onCollectibleClick?: (tokenId: string) => void;
	onOfferClick?: ({ order }: { order?: Order }) => void;
	imageSrcPrefixUrl?: string;
	balance?: string;
	cardLoading?: boolean;
	/**
	 * Callback function that is called when the user attempts to perform an action
	 * (such as buying or making an offer) that they are not permitted to do.
	 *
	 * This function is invoked in the following scenario:
	 *
	 * - When a disconnected user clicks on "Buy Now" and is prompted to connect
	 *   their wallet. After connecting, if it is determined that the user is
	 *   already the owner of the collectible, this callback is triggered to inform
	 *   them that they cannot perform the action (e.g., buying their own collectible).
	 *
	 * @param action - The action that the user cannot perform, which can be either
	 * CollectibleCardAction.BUY or CollectibleCardAction.OFFER.
	 */
	onCannotPerformAction?: (
		action: CollectibleCardAction.BUY | CollectibleCardAction.OFFER,
	) => void;
};

export function CollectibleCard({
	collectibleId,
	chainId,
	collectionAddress,
	orderbookKind,
	collectionType,
	lowestListing,
	onCollectibleClick,
	onOfferClick,
	balance,
	cardLoading,
	onCannotPerformAction,
	imageSrcPrefixUrl,
}: CollectibleCardProps) {
	const collectibleMetadata = lowestListing?.metadata;
	const highestOffer = lowestListing?.offer;
	const [imageLoadingError, setImageLoadingError] = useState(false);
	const [imageLoading, setImageLoading] = useState(true);

	const { data: lowestListingCurrency } = useCurrency({
		chainId,
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		currencyAddress: lowestListing?.order?.priceCurrencyAddress!,
		query: {
			enabled: !!lowestListing?.order?.priceCurrencyAddress,
		},
	});
	if (cardLoading) {
		return <CollectibleSkeleton />;
	}

	const action = (
		balance
			? (highestOffer && CollectibleCardAction.SELL) ||
				(!lowestListing?.order && CollectibleCardAction.LIST) ||
				CollectibleCardAction.TRANSFER
			: (lowestListing?.order && CollectibleCardAction.BUY) ||
				CollectibleCardAction.OFFER
	) as CollectibleCardAction;

	const name = collectibleMetadata?.name;
	const image = collectibleMetadata?.image;
	const externalUrl = collectibleMetadata?.external_url;
	const proxiedImage = `${imageSrcPrefixUrl}/${image}`;

	return (
		<Box
			className={collectibleCard}
			borderRadius="md"
			overflow="hidden"
			background="backgroundPrimary"
			tabIndex={0}
		>
			<Box
				display="flex"
				flexDirection="column"
				alignItems="flex-start"
				position="relative"
				width="full"
				height="full"
				zIndex="10"
				overflow="hidden"
				onClick={() => onCollectibleClick?.(collectibleId)}
				border="none"
				cursor="pointer"
				padding="0"
				className={collectibleTileWrapper}
			>
				<article
					style={{ width: '100%', display: 'flex', flexDirection: 'column' }}
				>
					{externalUrl && (
						<IconButton
							as="a"
							href={externalUrl}
							target="_blank"
							rel="noopener noreferrer"
							size="sm"
							backdropFilter="blur"
							variant="glass"
							onClick={(e) => {
								e.stopPropagation();
							}}
							position="absolute"
							zIndex="20"
							top="2"
							left="2"
							icon={SvgDiamondEyeIcon}
						/>
					)}

					<Box position="relative">
						{imageLoading && (
							<Skeleton
								position="absolute"
								top="0"
								left="0"
								width="full"
								height="full"
								zIndex="10"
								style={{ borderRadius: 0 }}
							/>
						)}
						<img
							src={
								imageLoadingError
									? ChessTileImage
									: (imageSrcPrefixUrl ? proxiedImage : image) || ChessTileImage
							}
							alt={name}
							className={
								imageLoading
									? collectibleImage.loading
									: collectibleImage.loaded
							}
							onError={() => setImageLoadingError(true)}
							onLoad={() => setImageLoading(false)}
						/>
					</Box>

					<Footer
						name={name || ''}
						type={collectionType}
						onOfferClick={() => onOfferClick?.({ order: highestOffer })}
						highestOffer={highestOffer}
						lowestListingPriceAmount={lowestListing?.order?.priceAmount}
						lowestListingCurrency={lowestListingCurrency}
						balance={balance}
						decimals={collectibleMetadata?.decimals}
					/>

					{(highestOffer || lowestListing) && (
						<Box
							display="flex"
							alignItems="center"
							justifyContent="center"
							padding="2"
							className={actionWrapper}
						>
							<ActionButton
								chainId={String(chainId)}
								collectionAddress={collectionAddress}
								tokenId={collectibleId}
								orderbookKind={orderbookKind}
								action={action}
								highestOffer={highestOffer}
								lowestListing={lowestListing?.order}
								owned={!!balance}
								onCannotPerformAction={onCannotPerformAction}
							/>
						</Box>
					)}
				</article>
			</Box>
		</Box>
	);
}
