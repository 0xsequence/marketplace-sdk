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

function CollectibleSkeleton() {
	return (
		<div className="w-[175px] overflow-hidden rounded-xl border border-[hsla(0,0%,31%,1)] bg-background-primary focus-visible:border-[hsla(247,100%,75%,1)] focus-visible:shadow-[0px_0px_0px_2px_hsla(247,100%,75%,1)] focus-visible:outline-[4px_solid_hsla(254,100%,57%,1)] focus-visible:outline-offset-2 active:border-[hsla(247,100%,75%,1)] active:shadow-[0px_0px_0px_1px_hsla(247,100%,75%,1)]">
			<Skeleton
				size="lg"
				style={{ width: '100%', height: 164, borderRadius: 0, paddingTop: 16 }}
			/>
			<div className="mt-2 flex flex-col gap-2 px-4 pb-4">
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
	// const externalUrl = collectibleMetadata?.external_url;
	const proxiedImage = `${imageSrcPrefixUrl}/${image}`;

	return (
		<button
			type="button"
			className="w-[175px] overflow-hidden rounded-xl border border-[hsla(0,0%,31%,1)] bg-background-primary text-left focus-visible:border-[hsla(247,100%,75%,1)] focus-visible:shadow-[0px_0px_0px_2px_hsla(247,100%,75%,1)] focus-visible:outline-[4px_solid_hsla(254,100%,57%,1)] focus-visible:outline-offset-2 active:border-[hsla(247,100%,75%,1)] active:shadow-[0px_0px_0px_1px_hsla(247,100%,75%,1)]"
			onClick={() => onCollectibleClick?.(collectibleId)}
			onKeyDown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					onCollectibleClick?.(collectibleId);
				}
			}}
		>
			<div className="relative z-10 flex h-full w-full cursor-pointer flex-col items-start overflow-hidden border-none p-0 focus:outline-none focus:[.w-[175px]_border_border-[hsla(0,0%,31%,1)]_rounded-xl_overflow-hidden_bg-background-primary_active:border-[hsla(247,100%,75%,1)]_active:shadow-[0px_0px_0px_1px_hsla(247,100%,75%,1)]_focus-visible:border-[hsla(247,100%,75%,1)]_focus-visible:shadow-[0px_0px_0px_2px_hsla(247,100%,75%,1)]_focus-visible:outline-[4px_solid_hsla(254,100%,57%,1)]_focus-visible:outline-offset-2:focus_&]:rounded-[10px] focus:[.w-[175px]_border_border-[hsla(0,0%,31%,1)]_rounded-xl_overflow-hidden_bg-background-primary_active:border-[hsla(247,100%,75%,1)]_active:shadow-[0px_0px_0px_1px_hsla(247,100%,75%,1)]_focus-visible:border-[hsla(247,100%,75%,1)]_focus-visible:shadow-[0px_0px_0px_2px_hsla(247,100%,75%,1)]_focus-visible:outline-[4px_solid_hsla(254,100%,57%,1)]_focus-visible:outline-offset-2:focus_&]:outline-[3px_solid_black] focus:[.w-[175px]_border_border-[hsla(0,0%,31%,1)]_rounded-xl_overflow-hidden_bg-background-primary_active:border-[hsla(247,100%,75%,1)]_active:shadow-[0px_0px_0px_1px_hsla(247,100%,75%,1)]_focus-visible:border-[hsla(247,100%,75%,1)]_focus-visible:shadow-[0px_0px_0px_2px_hsla(247,100%,75%,1)]_focus-visible:outline-[4px_solid_hsla(254,100%,57%,1)]_focus-visible:outline-offset-2:focus_&]:outline-offset-[-3px]">
				<article
					style={{ width: '100%', display: 'flex', flexDirection: 'column' }}
				>
					{/* {externalUrl && (
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
								aria-label="View on external site"
							>
								<span className="sr-only">View on external site</span>
							</a>
						</IconButton> 
					{/* )} */}

					<div className="relative">
						{imageLoading && (
							<Skeleton
								className="absolute top-0 left-0 z-10 h-full w-full"
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
							className={`h-[175px] w-[175px] object-cover transition-transform duration-200 ease-in-out hover:scale-[1.165] ${
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
						<div className="absolute bottom-[-44px] flex w-full items-center justify-center bg-[hsla(0,0%,100%,0.1)] p-2 backdrop-blur-md transition-transform duration-200 ease-in-out hover:translate-y-[-44px]">
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
		</button>
	);
}
