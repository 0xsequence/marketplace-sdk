'use client';

import type {
	Address,
	ContractType,
	Currency,
	Order,
} from '@0xsequence/api-client';
import type { CollectibleCardAction } from '../../../../../types';
import { ActionButton } from '../ActionButton/ActionButton';
import { Card } from '../Card';
import type { CollectibleMetadata } from '../Card/card-media';
import {
	CARD_TITLE_MAX_LENGTH_DEFAULT,
	CARD_TITLE_MAX_LENGTH_WITH_OFFER,
} from '../constants';
import type { CardClassNames } from '../types';

export interface MarketCardPresentationProps {
	/** Token identification */
	tokenId: bigint;
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
	onCollectibleClick?: (tokenId: bigint) => void;
	onOfferClick?: (params: {
		order: Order;
		e: React.MouseEvent<HTMLButtonElement>;
	}) => void;

	/** Action button configuration */
	action: CollectibleCardAction;
	showActionButton?: boolean;
	onCannotPerformAction?: (
		action: CollectibleCardAction.BUY | CollectibleCardAction.OFFER,
	) => void;
	prioritizeOwnerActions?: boolean;
	hideQuantitySelector?: boolean;
	classNames?: CardClassNames;
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
	action,
	showActionButton = true,
	onCannotPerformAction,
	prioritizeOwnerActions,
	hideQuantitySelector,
	classNames,
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
		<Card
			onClick={handleClick}
			onKeyDown={handleKeyDown}
			className={classNames?.cardRoot}
		>
			<Card.Media
				metadata={collectibleMetadata}
				assetSrcPrefixUrl={assetSrcPrefixUrl}
				className={classNames?.cardMedia}
			/>

			<Card.Content className={classNames?.cardContent}>
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
					className={classNames?.cardTitle}
				>
					{collectibleMetadata.name || 'Untitled'}
				</Card.Title>

				<div className="flex items-center gap-1">
					<Card.Price
						amount={lowestListing?.priceAmount}
						currency={currency}
						className={classNames?.cardPrice}
						type={'market'}
					/>
				</div>

				<Card.Badge
					type={collectionType}
					balance={balance}
					className={classNames?.cardBadge}
				/>
			</Card.Content>

			<Card.Footer show={showActionButton} className={classNames?.cardFooter}>
				<ActionButton
					chainId={chainId}
					collectionAddress={collectionAddress}
					tokenId={tokenId}
					action={action}
					highestOffer={highestOffer}
					lowestListing={lowestListing}
					owned={!!balance}
					onCannotPerformAction={onCannotPerformAction}
					cardType="market"
					prioritizeOwnerActions={prioritizeOwnerActions}
					hideQuantitySelector={hideQuantitySelector}
					className={classNames?.cardActionButton}
				/>
			</Card.Footer>
		</Card>
	);
}
