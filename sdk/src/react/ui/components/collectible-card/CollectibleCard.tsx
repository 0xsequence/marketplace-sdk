'use client';

import { Skeleton } from '@0xsequence/design-system';
import type { Hex } from 'viem';
import type {
	CollectibleOrder,
	ContractType,
	Order,
	OrderbookKind,
} from '../../../_internal';
import { useCurrency } from '../../../hooks';
import { ActionButton } from '../_internals/action-button/ActionButton';
import { CollectibleCardAction } from '../_internals/action-button/types';
import { Footer } from './Footer';
import { Media } from './media/Media';
import { type CollectibleCardProps, CollectibleCardType } from './types';

export function CollectibleCard({
	collectibleId,
	chainId,
	collectionAddress,
	orderbookKind,
	collectionType,
	collectible,
	onCollectibleClick,
	onOfferClick,
	balance,
	balanceIsLoading,
	cardLoading,
	onCannotPerformAction,
	assetSrcPrefixUrl,
	cardType = CollectibleCardType.MARKETPLACE,
	salesContractAddress,
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
		return <CollectibleSkeleton />;
	}

	const showActionButton =
		(!balanceIsLoading && (highestOffer || collectible)) ||
		(salesContractAddress && collectionType === ContractType.ERC1155) ||
		cardType === CollectibleCardType.MARKETPLACE;

	const action = (
		balance
			? (highestOffer && CollectibleCardAction.SELL) ||
				(!collectible?.listing && CollectibleCardAction.LIST) ||
				CollectibleCardAction.TRANSFER
			: (collectible?.listing && CollectibleCardAction.BUY) ||
				CollectibleCardAction.OFFER
	) as CollectibleCardAction;

	return (
		<div
			data-testid="collectible-card"
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
					<Media
						name={collectibleMetadata?.name || ''}
						assets={[
							collectibleMetadata?.image,
							collectibleMetadata?.video,
							collectibleMetadata?.animation_url,
						]}
						assetSrcPrefixUrl={assetSrcPrefixUrl}
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
							/>
						</div>
					)}
				</article>
			</div>
		</div>
	);
}
