'use client';

import type { Address } from 'viem';
import type {
	CollectibleCardAction,
	OrderbookKind,
} from '../../../../../types';
import type { ContractType, Currency, Order } from '../../../../_internal';
import { ActionButton } from '../ActionButton/ActionButton';
import { Card } from '../Card';
import type { CollectibleMetadata } from '../Card/card-media';
import {
	CARD_TITLE_MAX_LENGTH_DEFAULT,
	CARD_TITLE_MAX_LENGTH_WITH_OFFER,
} from '../constants';

export interface MarketCardPresentationProps {
	/** Token identification */
	tokenId: string;
	chainId: number;
	collectionAddress: Address;
	collectionType: ContractType;

	/** Display data */
	collectibleMetadata: CollectibleMetadata;
	currency?: Currency;
	lowestListing?: Order;
	highestOffer?: Order;
	balance?: string;

	/** Asset configuration */
	assetSrcPrefixUrl?: string;

	/** Interaction handlers */
	onCollectibleClick?: (tokenId: string) => void;
	onOfferClick?: (params: {
		order: Order;
		e: React.MouseEvent<HTMLButtonElement>;
	}) => void;

	/** Action button configuration */
	orderbookKind?: OrderbookKind;
	action: CollectibleCardAction;
	showActionButton?: boolean;
	onCannotPerformAction?: (
		action: CollectibleCardAction.BUY | CollectibleCardAction.OFFER,
	) => void;
	prioritizeOwnerActions?: boolean;
	hideQuantitySelector?: boolean;
}

/**
 * MarketCardPresentation - Pure presentation component for market cards
 *
 * This is a "dumb" component that receives all data as props and handles no data fetching.
 * Use this when you want full control over data fetching, or for SSR/SSG scenarios.
 *
 * For a convenient "smart" component with built-in data fetching, use MarketCard instead.
 *
 * @example
 * ```tsx
 * // With pre-fetched data
 * <MarketCardPresentation
 *   tokenId="123"
 *   chainId={1}
 *   collectibleMetadata={metadata}
 *   currency={currency}
 *   lowestListing={listing}
 * />
 * ```
 */
export function MarketCardPresentation({
	tokenId,
	chainId,
	collectionAddress,
	collectionType,
	collectibleMetadata,
	currency,
	lowestListing,
	highestOffer,
	balance,
	assetSrcPrefixUrl,
	onCollectibleClick,
	onOfferClick,
	orderbookKind,
	action,
	showActionButton = true,
	onCannotPerformAction,
	prioritizeOwnerActions,
	hideQuantitySelector,
}: MarketCardPresentationProps) {
	// Only define handlers if callback exists
	const handleClick = onCollectibleClick
		? () => onCollectibleClick(tokenId)
		: undefined;

	const handleKeyDown = onCollectibleClick
		? (e: React.KeyboardEvent) => {
				if (e.key === 'Enter' || e.key === ' ') {
					onCollectibleClick(tokenId);
				}
			}
		: undefined;

	return (
		<Card onClick={handleClick} onKeyDown={handleKeyDown}>
			<Card.Media
				metadata={collectibleMetadata}
				assetSrcPrefixUrl={assetSrcPrefixUrl}
			/>

			<Card.Content>
				<Card.Title
					highestOffer={highestOffer}
					onOfferClick={(e) =>
						onOfferClick?.({ order: highestOffer as Order, e })
					}
					balance={balance}
					maxLength={
						highestOffer
							? CARD_TITLE_MAX_LENGTH_WITH_OFFER
							: CARD_TITLE_MAX_LENGTH_DEFAULT
					}
				>
					{collectibleMetadata.name || 'Untitled'}
				</Card.Title>

				<div className="flex items-center gap-1">
					<Card.Price amount={lowestListing?.priceAmount} currency={currency} />
				</div>

				<Card.Badge
					type={collectionType}
					balance={balance}
					decimals={collectibleMetadata.decimals}
				/>
			</Card.Content>

			<Card.Footer show={showActionButton}>
				<ActionButton
					chainId={chainId}
					collectionAddress={collectionAddress}
					tokenId={tokenId}
					orderbookKind={orderbookKind}
					action={action}
					highestOffer={highestOffer}
					lowestListing={lowestListing}
					owned={!!balance}
					onCannotPerformAction={onCannotPerformAction}
					cardType="market"
					prioritizeOwnerActions={prioritizeOwnerActions}
					hideQuantitySelector={hideQuantitySelector}
				/>
			</Card.Footer>
		</Card>
	);
}
