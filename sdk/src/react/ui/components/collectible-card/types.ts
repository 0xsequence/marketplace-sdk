import type { Hex } from 'viem';
import type { ContractType } from '../../../_internal';
import type { CollectibleOrder } from '../../../_internal';
import type { Order } from '../../../_internal';
import type { OrderbookKind } from '../../../_internal';
import type { CollectibleCardAction } from '../_internals/action-button/types';

type CardType = 'store' | 'marketplace' | 'inventory';

// Base properties shared by all collectible card types
type BaseCollectibleCardProps = {
	collectibleId: string;
	chainId: number;
	collectionAddress: Hex;
	collectible: CollectibleOrder | undefined;
	cardLoading?: boolean;
	supply?: number;
};

type StoreCardSpecificProps = {
	supply: number;
};

// Properties specific to marketplace cards
type MarketplaceCardSpecificProps = {
	orderbookKind?: OrderbookKind;
	collectionType?: ContractType;
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

// Complete CollectibleCardProps with all possible properties
type CollectibleCardProps = BaseCollectibleCardProps &
	MarketplaceCardSpecificProps & {
		cardType: CardType;
	};

// Type utility to create card props for specific card types
type StoreCardProps = BaseCollectibleCardProps & StoreCardSpecificProps;
type InventoryCardProps = BaseCollectibleCardProps &
	MarketplaceCardSpecificProps;
type MarketplaceCardProps = BaseCollectibleCardProps &
	MarketplaceCardSpecificProps;

export type {
	CardType,
	BaseCollectibleCardProps,
	MarketplaceCardSpecificProps,
	CollectibleCardProps,
	StoreCardProps,
	InventoryCardProps,
	MarketplaceCardProps,
};
