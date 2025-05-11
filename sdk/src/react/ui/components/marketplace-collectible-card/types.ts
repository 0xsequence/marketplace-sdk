import type { Address, Hex } from 'viem';
import type { ContractType, TokenMetadata } from '../../../_internal';
import type { CollectibleOrder } from '../../../_internal';
import type { Order } from '../../../_internal';
import type { OrderbookKind } from '../../../_internal';
import type { CollectibleCardAction } from '../_internals/action-button/types';

export enum CollectibleCardType {
	SHOP = 'shop',
	MARKETPLACE = 'marketplace',
}

// Base properties shared by all collectible card types
type MarketplaceCardBaseProps = {
	collectibleId: string;
	chainId: number;
	collectionAddress: Hex;
	collectionType?: ContractType;
	assetSrcPrefixUrl?: string;
	cardLoading?: boolean;
	quantityDecimals?: number;
	quantityRemaining?: string;
};

// Properties specific to Shop card
type ShopCardSpecificProps = {
	supply: number | undefined;
	salesContractAddress: Hex;
	tokenMetadata: TokenMetadata;
	salePrice:
		| {
				amount: string;
				currencyAddress: Address;
		  }
		| undefined;
};

// Properties specific to marketplace and inventory cards
type MarketCardSpecificProps = {
	orderbookKind?: OrderbookKind;
	collectible: CollectibleOrder | undefined;
	onCollectibleClick?: (tokenId: string) => void;
	onOfferClick?: ({
		order,
		e,
	}: {
		order?: Order;
		e: React.MouseEvent<HTMLButtonElement>;
	}) => void;
	balance?: string;
	balanceIsLoading: boolean;
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
	prioritizeOwnerActions?: boolean;
};

// Complete CollectibleCardProps with all possible properties and card type
type MarketplaceCollectibleCardProps = MarketplaceCardBaseProps & {
	cardType: CollectibleCardType;
	supply?: number; // Can be required or optional depending on card type
} & Partial<MarketCardSpecificProps & ShopCardSpecificProps>;

type ShopCardProps = MarketplaceCardBaseProps & ShopCardSpecificProps;

type MarketCardProps = MarketplaceCardBaseProps & MarketCardSpecificProps;

export type {
	MarketplaceCardBaseProps,
	ShopCardSpecificProps,
	MarketCardSpecificProps,
	MarketplaceCollectibleCardProps,
	ShopCardProps,
	MarketCardProps,
};
