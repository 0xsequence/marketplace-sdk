'use client';

import type { Address } from 'viem';
import { type CardType, CollectibleCardAction } from '../../../../../types';
import { ContractType, type Currency } from '../../../../_internal';
import { ActionButton } from '../ActionButton/ActionButton';
import { Card } from '../Card';
import type { CollectibleMetadata } from '../Card/card-media';
import { CARD_TITLE_MAX_LENGTH_DEFAULT } from '../constants';

export interface ShopCardPresentationProps {
	/** Token identification */
	tokenId: string;
	chainId: number;
	collectionAddress: Address;
	collectionType: ContractType;

	/** Display data */
	tokenMetadata: CollectibleMetadata;
	saleCurrency?: Currency;

	/** Sale information */
	salePrice?: {
		amount: string;
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
	quantityDecimals?: number;
	quantityRemaining?: number;
	unlimitedSupply?: boolean;
	hideQuantitySelector?: boolean;
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
	quantityDecimals,
	quantityRemaining,
	unlimitedSupply,
	hideQuantitySelector,
}: ShopCardPresentationProps) {
	return (
		<Card>
			<Card.Media
				metadata={tokenMetadata}
				assetSrcPrefixUrl={assetSrcPrefixUrl}
				className={shopState.mediaClassName}
			/>

			<Card.Content>
				<Card.Title
					className={shopState.titleClassName}
					maxLength={CARD_TITLE_MAX_LENGTH_DEFAULT}
				>
					{tokenMetadata.name || 'Untitled'}
				</Card.Title>

				<div className="flex items-center gap-1">
					{collectionType === ContractType.ERC1155 &&
						salePrice?.amount &&
						saleCurrency && (
							<Card.Price amount={salePrice.amount} currency={saleCurrency} />
						)}
				</div>

				<Card.SaleDetails
					quantityRemaining={
						quantityRemaining !== undefined
							? String(quantityRemaining)
							: undefined
					}
					type={collectionType}
					unlimitedSupply={unlimitedSupply}
				/>

				{!salePrice?.amount && <div className="h-5 w-full" />}
			</Card.Content>

			<Card.Footer show={shopState.showActionButton}>
				<ActionButton
					chainId={chainId}
					collectionAddress={collectionAddress}
					tokenId={tokenId}
					action={CollectibleCardAction.BUY}
					owned={false}
					cardType={cardType}
					salesContractAddress={salesContractAddress}
					salePrice={salePrice}
					quantityDecimals={quantityDecimals}
					quantityRemaining={quantityRemaining}
					unlimitedSupply={unlimitedSupply}
					hideQuantitySelector={hideQuantitySelector}
				/>
			</Card.Footer>
		</Card>
	);
}
