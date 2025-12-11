'use client';

import type { Address } from 'viem';
import { type CardType, CollectibleCardAction } from '../../../../../types';
import { cn } from '../../../../../utils';
import { ContractType, type Currency } from '../../../../_internal';
import { ActionButton } from '../ActionButton/ActionButton';
import { Card } from '../Card';
import type { CollectibleMetadata } from '../Card/card-media';
import { CARD_TITLE_MAX_LENGTH_DEFAULT } from '../constants';
import type { CardClassNames } from '../types';

export interface ShopCardPresentationProps {
	/** Token identification */
	tokenId: bigint;
	chainId: number;
	collectionAddress: Address;
	collectionType: ContractType;

	/** Display data */
	tokenMetadata: CollectibleMetadata;
	saleCurrency?: Currency;

	/** Sale information */
	salePrice?: {
		amount: bigint;
		currencyAddress: Address;
	};

	/** Asset configuration */
	assetSrcPrefixUrl?: string;

	/** Shop card state */
	shopState: {
		mediaClassName?: string;
		titleClassName?: string;
		showActionButton: boolean;
	};

	/** Action button configuration */
	cardType: CardType;
	salesContractAddress?: Address;
	quantityRemaining?: bigint;
	unlimitedSupply?: boolean;
	hideQuantitySelector?: boolean;
	classNames?: CardClassNames;
}

/**
 * ShopCardPresentation - Pure presentation component for shop/primary sale cards
 *
 * This is a "dumb" component that receives all data as props and handles no data fetching.
 * Use this when you want full control over data fetching, or for SSR/SSG scenarios.
 *
 * For a convenient "smart" component with built-in data fetching, use ShopCard instead.
 *
 * @example
 * ```tsx
 * // With pre-fetched data
 * <ShopCardPresentation
 *   tokenId="123"
 *   chainId={1}
 *   tokenMetadata={metadata}
 *   saleCurrency={currency}
 *   shopState={shopState}
 * />
 * ```
 */
export function ShopCardPresentation({
	tokenId,
	chainId,
	collectionAddress,
	collectionType,
	tokenMetadata,
	saleCurrency,
	salePrice,
	assetSrcPrefixUrl,
	shopState,
	cardType,
	salesContractAddress,
	quantityRemaining,
	unlimitedSupply,
	hideQuantitySelector,
	classNames,
}: ShopCardPresentationProps) {
	return (
		<Card className={classNames?.cardRoot}>
			<Card.Media
				metadata={tokenMetadata}
				assetSrcPrefixUrl={assetSrcPrefixUrl}
				className={cn(shopState.mediaClassName, classNames?.cardMedia)}
			/>

			<Card.Content className={classNames?.cardContent}>
				<Card.Title
					className={cn(shopState.titleClassName, classNames?.cardTitle)}
					maxLength={CARD_TITLE_MAX_LENGTH_DEFAULT}
				>
					{tokenMetadata.name || 'Untitled'}
				</Card.Title>

				<div className="flex items-center gap-1">
					{collectionType === ContractType.ERC1155 &&
						salePrice?.amount !== undefined &&
						saleCurrency && (
							<Card.Price
								amount={salePrice.amount}
								currency={saleCurrency}
								className={classNames?.cardPrice}
								type={'shop'}
							/>
						)}
				</div>

				<Card.SaleDetails
					quantityRemaining={quantityRemaining}
					type={collectionType}
					unlimitedSupply={unlimitedSupply}
					className={classNames?.cardSaleDetails}
				/>
			</Card.Content>

			<Card.Footer
				show={shopState.showActionButton}
				className={classNames?.cardFooter}
			>
				<ActionButton
					chainId={chainId}
					collectionAddress={collectionAddress}
					tokenId={tokenId}
					action={CollectibleCardAction.BUY}
					owned={false}
					cardType={cardType}
					salesContractAddress={salesContractAddress}
					salePrice={salePrice}
					quantityRemaining={quantityRemaining}
					unlimitedSupply={unlimitedSupply}
					hideQuantitySelector={hideQuantitySelector}
					className={classNames?.cardActionButton}
				/>
			</Card.Footer>
		</Card>
	);
}
