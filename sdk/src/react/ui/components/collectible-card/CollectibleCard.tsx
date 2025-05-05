'use client';

import { useCurrency } from '../../../hooks';
import { ActionButton } from '../_internals/action-button/ActionButton';
import { CollectibleCardAction } from '../_internals/action-button/types';
import { CollectibleCardSkeleton } from './CollectibleCardSkeleton';
import { Footer } from './Footer';
import { CollectibleAsset } from './collectible-asset/CollectibleAsset';
import type { CollectibleCardProps } from './types';

export function CollectibleCard({
	// Base properties
	collectibleId,
	chainId,
	collectionAddress,
	collectible,
	assetSrcPrefixUrl,
	cardLoading,
	cardType,
	supply,

	// Card type specific props
	salesContractAddress,
	orderbookKind,
	collectionType,
	onCollectibleClick,
	onOfferClick,
	balance,
	balanceIsLoading = false,
	onCannotPerformAction,
}: CollectibleCardProps) {
	const collectibleMetadata = collectible?.metadata;
	const highestOffer = collectible?.offer;

	const { data: lowestListingCurrency } = useCurrency({
		chainId,
		currencyAddress: collectible?.listing?.priceCurrencyAddress,
		query: {
			enabled: !!collectible?.listing?.priceCurrencyAddress,
		},
	});

	if (cardLoading) {
		return <CollectibleCardSkeleton />;
	}

	const showActionButton = !balanceIsLoading && (highestOffer || collectible);

	// Determine action based on card type and state
	const action = (
		balance
			? (highestOffer && CollectibleCardAction.SELL) ||
				(!collectible?.listing && CollectibleCardAction.LIST) ||
				CollectibleCardAction.TRANSFER
			: (collectible?.listing && CollectibleCardAction.BUY) ||
				CollectibleCardAction.OFFER
	) as CollectibleCardAction;

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' || e.key === ' ') {
			onCollectibleClick?.(collectibleId);
		}
	};

	return (
		<div
			data-testid="collectible-card"
			className="w-card-width min-w-card-min-width overflow-hidden rounded-xl border border-border-base bg-background-primary focus-visible:border-border-focus focus-visible:shadow-focus-ring focus-visible:outline-focus active:border-border-focus active:shadow-active-ring"
			onClick={() => onCollectibleClick?.(collectibleId)}
			onKeyDown={handleKeyDown}
		>
			<div className="group relative z-10 flex h-full w-full cursor-pointer flex-col items-start overflow-hidden rounded-xl border-none bg-none p-0 focus:outline-none [&:focus]:rounded-[10px] [&:focus]:outline-[3px] [&:focus]:outline-black [&:focus]:outline-offset-[-3px]">
				<article className="w-full rounded-xl">
					<CollectibleAsset
						name={collectibleMetadata?.name || ''}
						collectibleMetadata={collectibleMetadata}
						assetSrcPrefixUrl={assetSrcPrefixUrl}
						supply={supply}
					/>

					<Footer
						name={collectibleMetadata?.name || ''}
						type={collectionType}
						onOfferClick={(e) => onOfferClick?.({ order: highestOffer, e })}
						highestOffer={highestOffer}
						lowestListingPriceAmount={collectible?.listing?.priceAmount}
						lowestListingCurrency={lowestListingCurrency}
						balance={balance}
						decimals={collectibleMetadata?.decimals}
						supply={supply}
						cardType={cardType}
						salesContractAddress={salesContractAddress}
					/>

					{showActionButton && (
						<div className="-bottom-16 absolute flex w-full origin-bottom items-center justify-center bg-overlay-light p-2 backdrop-blur transition-transform duration-200 ease-in-out group-hover:translate-y-[-64px]">
							<ActionButton
								chainId={chainId}
								collectionAddress={collectionAddress}
								tokenId={collectibleId}
								orderbookKind={orderbookKind}
								action={action}
								highestOffer={highestOffer}
								lowestListing={collectible?.listing}
								owned={!!balance}
								onCannotPerformAction={onCannotPerformAction}
								cardType={cardType}
							/>
						</div>
					)}
				</article>
			</div>
		</div>
	);
}
