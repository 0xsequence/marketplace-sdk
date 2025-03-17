import { useState } from 'react';

import { Skeleton } from '@0xsequence/design-system';
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
import { ActionButton } from '../_internals/action-button/ActionButton';
import { CollectibleCardAction } from '../_internals/action-button/types';
import { Footer } from './Footer';
import { JSX } from 'react/jsx-runtime';

function CollectibleSkeleton() {
	return (
		<div className="w-card-width overflow-hidden rounded-xl border border-border-base focus-visible:border-border-focus focus-visible:shadow-none focus-visible:outline-focus active:border-border-focus active:shadow-none">
			<div className="relative aspect-square overflow-hidden bg-background-secondary">
				<Skeleton
					size="lg"
					className="absolute inset-0 w-full h-full animate-shimmer"
					style={{
						borderRadius: 0,
					}}
				/>
			</div>
			<div className="mt-2 flex flex-col gap-2 px-4 pb-4">
				<Skeleton size="lg" className="animate-shimmer" />
				<Skeleton size="sm" className="animate-shimmer" />
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
}: CollectibleCardProps): JSX.Element {
	const collectibleMetadata = lowestListing?.metadata;
	const highestOffer = lowestListing?.offer;
	const [imageLoadingError, setImageLoadingError] = useState(false);
	const [imageLoading, setImageLoading] = useState(true);

	const { data: lowestListingCurrency } = useCurrency({
		chainId,
		currencyAddress: lowestListing?.order?.priceCurrencyAddress,
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
	const proxiedImage = `${imageSrcPrefixUrl}/${image}`;

	return (
		<div
			className="w-card-width overflow-hidden rounded-xl border border-border-base bg-background-primary focus-visible:border-border-focus focus-visible:shadow-focus-ring focus-visible:outline-focus active:border-border-focus active:shadow-active-ring"
			onClick={() => onCollectibleClick?.(collectibleId)}
			onKeyDown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					onCollectibleClick?.(collectibleId);
				}
			}}
		>
			<div className="group relative z-10 flex h-full w-full cursor-pointer flex-col items-start overflow-hidden rounded-xl border-none bg-none p-0 focus:outline-none [&:focus]:rounded-[10px] [&:focus]:outline-[3px] [&:focus]:outline-black [&:focus]:outline-offset-[-3px]">
				<article className="w-full rounded-xl">
					<div className="relative aspect-square overflow-hidden bg-background-secondary">
						{imageLoading && (
							<Skeleton
								className="absolute inset-0 w-full h-full animate-shimmer"
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
							className={`absolute inset-0 w-full h-full object-cover transition-transform duration-200 ease-in-out group-hover:scale-hover ${
								imageLoading ? 'invisible' : 'visible'
							}`}
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
						<div className="-bottom-action-offset absolute flex w-full items-center justify-center bg-overlay-light p-2 backdrop-blur transition-transform duration-200 ease-in-out group-hover:translate-y-[-44px]">
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
