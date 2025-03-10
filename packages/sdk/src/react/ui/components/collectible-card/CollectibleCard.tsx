import { useState } from 'react';

import { IconButton, Skeleton } from '@0xsequence/design-system';
import type { Hex } from 'viem';
import type {
	ChainId,
	CollectibleOrder,
	ContractType,
	Order,
	OrderbookKind,
} from '../../../_internal';
import { useCurrency } from '../../../hooks';
import SvgDiamondEyeIcon from '../../icons/DiamondEye';
import ChessTileImage from '../../images/chess-tile.png';
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
		<div
			className={`${collectibleCard} rounded-xl overflow-hidden bg-background-primary`}
		>
			<Skeleton
				size="lg"
				style={{ width: '100%', height: 164, borderRadius: 0, paddingTop: 16 }}
			/>
			<div className="flex flex-col gap-2 px-4 pb-4 mt-2">
				<Skeleton size="lg" />

				<Skeleton size="sm" />
			</div>
		</div>
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

	return (
		<div
			className={`${collectibleCard} rounded-xl overflow-hidden bg-background-primary`}
			tabIndex={0}
		>
			<div
				className={`${collectibleTileWrapper} flex flex-col items-start relative w-full h-full z-10 overflow-hidden border-none cursor-pointer p-0`}
				onClick={() => onCollectibleClick?.(collectibleId)}
			>
				<article
					style={{ width: '100%', display: 'flex', flexDirection: 'column' }}
				>
					{externalUrl && (
						<IconButton
							className="backdrop-blur-md absolute z-20 top-2 left-2"
							size="sm"
							variant="glass"
							icon={SvgDiamondEyeIcon}
						>
							<a
								href={externalUrl}
								target="_blank"
								rel="noopener noreferrer"
								onClick={(e) => {
									e.stopPropagation();
								}}
							/>
						</IconButton>
					)}

					<div className="relative">
						{imageLoading && (
							<Skeleton
								className="absolute top-0 left-0 w-full h-full z-10"
								style={{ borderRadius: 0 }}
							/>
						)}
						<img
							src={imageLoadingError ? ChessTileImage : image || ChessTileImage}
							alt={name}
							className={
								imageLoading
									? collectibleImage.loading
									: collectibleImage.loaded
							}
							onError={() => setImageLoadingError(true)}
							onLoad={() => setImageLoading(false)}
						/>
					</div>

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
						<div
							className={`${actionWrapper} flex items-center justify-center p-2`}
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
						</div>
					)}
				</article>
			</div>
		</div>
	);
}
