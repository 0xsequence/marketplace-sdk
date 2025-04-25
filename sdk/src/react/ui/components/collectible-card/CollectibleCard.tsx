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
import { CollectibleAsset } from './collectible-asset/CollectibleAsset';

function CollectibleSkeleton() {
	return (
		<div
			data-testid="collectible-card-skeleton"
			className="w-card-width overflow-hidden rounded-xl border border-border-base focus-visible:border-border-focus focus-visible:shadow-none focus-visible:outline-focus active:border-border-focus active:shadow-none"
		>
			<div className="relative aspect-square overflow-hidden bg-background-secondary">
				<Skeleton
					size="lg"
					className="absolute inset-0 h-full w-full animate-shimmer"
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
	chainId: number;
	collectionAddress: Hex;
	orderbookKind?: OrderbookKind;
	collectionType?: ContractType;
	collectible: CollectibleOrder | undefined;
	onCollectibleClick?: (tokenId: string) => void;
	onOfferClick?: ({
		order,
		e,
	}: {
		order?: Order;
		e: React.MouseEvent<HTMLButtonElement>;
	}) => void;
	assetSrcPrefixUrl?: string;
	balance?: string;
	balanceIsLoading: boolean;
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
	collectible,
	onCollectibleClick,
	onOfferClick,
	balance,
	balanceIsLoading,
	cardLoading,
	onCannotPerformAction,
	assetSrcPrefixUrl,
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
					<CollectibleAsset
						name={collectibleMetadata?.name || ''}
						collectibleMetadata={collectibleMetadata}
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

					{(highestOffer || collectible) && !balanceIsLoading && (
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
							/>
						</div>
					)}
				</article>
			</div>
		</div>
	);
}
