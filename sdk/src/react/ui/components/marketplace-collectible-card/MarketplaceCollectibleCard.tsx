'use client';

import { ContractType } from '../../../_internal';
import { useCurrency } from '../../../hooks';
import { ActionButton } from '../_internals/action-button/ActionButton';
import { CollectibleCardAction } from '../_internals/action-button/types';
import { Media } from '../media/Media';
import { Footer } from './Footer';
import { MarketplaceCollectibleCardSkeleton } from './MarketplaceCollectibleCardSkeleton';
import {
	CollectibleCardType,
	type MarketplaceCollectibleCardProps,
} from './types';

export function MarketplaceCollectibleCard({
	// Base properties
	collectibleId,
	chainId,
	collectionAddress,
	assetSrcPrefixUrl,
	cardLoading,
	cardType,
	supply,
	quantityDecimals,
	quantityRemaining,

	// Card type specific props
	salesContractAddress,
	collectible,
	tokenMetadata,
	orderbookKind,
	collectionType,
	onCollectibleClick,
	onOfferClick,
	balance,
	balanceIsLoading = false,
	onCannotPerformAction,
	salePrice,
	saleStartsAt,
	saleEndsAt,
	prioritizeOwnerActions,
}: MarketplaceCollectibleCardProps) {
	const collectibleMetadata = collectible?.metadata || tokenMetadata;
	const highestOffer = collectible?.offer;
	const isSaleNotAvailable = !saleStartsAt && !saleEndsAt;

	const { data: lowestListingCurrency } = useCurrency({
		chainId,
		currencyAddress: collectible?.listing?.priceCurrencyAddress,
		query: {
			enabled:
				!!collectible?.listing?.priceCurrencyAddress &&
				cardType === CollectibleCardType.MARKETPLACE,
		},
	});
	const { data: saleCurrency } = useCurrency({
		chainId,
		currencyAddress: salePrice?.currencyAddress,
		query: {
			enabled:
				!!salePrice?.currencyAddress &&
				cardType === CollectibleCardType.SHOP &&
				!!salesContractAddress &&
				collectionType === ContractType.ERC1155,
		},
	});

	if (cardLoading) {
		return <MarketplaceCollectibleCardSkeleton />;
	}

	if (
		!collectibleMetadata ||
		(cardType === CollectibleCardType.SHOP && !salePrice)
	) {
		console.error('Collectible metadata or sale price is undefined', {
			collectibleMetadata,
			salePrice,
		});

		return null;
	}

	const showActionButton =
		(!balanceIsLoading && (highestOffer || collectible)) ||
		(salesContractAddress &&
			collectionType === ContractType.ERC1155 &&
			supply !== undefined &&
			!isSaleNotAvailable) ||
		cardType === CollectibleCardType.MARKETPLACE;

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
					<Media
						name={collectibleMetadata?.name || ''}
						assets={[
							collectibleMetadata?.image,
							collectibleMetadata?.video,
							collectibleMetadata?.animation_url,
						]}
						assetSrcPrefixUrl={assetSrcPrefixUrl}
						supply={supply}
						className={
							cardType === CollectibleCardType.SHOP && isSaleNotAvailable
								? 'opacity-50'
								: 'opacity-100'
						}
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
						salePriceAmount={salePrice?.amount}
						salePriceCurrency={saleCurrency}
						saleStartsAt={saleStartsAt}
						saleEndsAt={saleEndsAt}
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
								salesContractAddress={salesContractAddress}
								prioritizeOwnerActions={prioritizeOwnerActions}
								salePrice={salePrice}
								quantityDecimals={quantityDecimals}
								quantityRemaining={quantityRemaining}
							/>
						</div>
					)}
				</article>
			</div>
		</div>
	);
}
