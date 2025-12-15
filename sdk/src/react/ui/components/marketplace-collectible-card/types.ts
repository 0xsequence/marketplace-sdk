import type { Metadata } from '@0xsequence/api-client';
import type { Address } from 'viem';
import type { CardType, CollectibleCardAction } from '../../../../types';
import type { CollectibleOrder, ContractType, Order } from '../../../_internal';

export type CardClassNames = {
	cardRoot?: string;
	cardMedia?: string;
	cardContent?: string;
	cardTitle?: string;
	cardPrice?: string;
	cardBadge?: string;
	cardFooter?: string;
	cardActionButton?: string;
	cardSaleDetails?: string;
	cardSkeleton?: string;
};

type TokenMetadataType = Metadata.TokenMetadata;

// Base properties shared by all collectible card types
type MarketplaceCardBaseProps = {
	tokenId: bigint;
	chainId: number;
	collectionAddress: Address;
	collectionType?: ContractType;
	assetSrcPrefixUrl?: string;
	cardLoading: boolean;
	cardType?: CardType;
	classNames?: CardClassNames;
	hideQuantitySelector?: boolean;
};

type ShopCardSpecificProps = {
	salesContractAddress: Address;
	tokenMetadata: TokenMetadataType;
	salePrice:
		| {
				amount: bigint;
				currencyAddress: Address;
		  }
		| undefined;
	saleStartsAt: string | undefined;
	saleEndsAt: string | undefined;
	quantityInitial: bigint | undefined;
	quantityRemaining: bigint | undefined;
	unlimitedSupply?: boolean; // it's useful for 1155 tokens
};

// Properties specific to marketplace and inventory cards
type MarketCardSpecificProps = {
	collectible: CollectibleOrder | undefined;
	onCollectibleClick?: (tokenId: bigint) => void;
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

type NonTradableInventoryCardSpecificProps = {
	balance: string;
	balanceIsLoading: boolean;
	collectibleMetadata: TokenMetadataType;
};

// Complete CollectibleCardProps with all possible properties and card type
type MarketplaceCollectibleCardProps = MarketplaceCardBaseProps &
	Partial<MarketCardSpecificProps & ShopCardSpecificProps>;

type ShopCollectibleCardProps = MarketplaceCardBaseProps &
	ShopCardSpecificProps & {
		cardType?: 'shop';
	};
type MarketCollectibleCardProps = MarketplaceCardBaseProps &
	MarketCardSpecificProps & {
		cardType?: 'market';
	};
type NonTradableInventoryCardProps = MarketplaceCardBaseProps &
	NonTradableInventoryCardSpecificProps & {
		cardType?: 'inventory-non-tradable';
	};

type CollectibleCardProps =
	| ShopCollectibleCardProps
	| MarketCollectibleCardProps
	| NonTradableInventoryCardProps;

export type {
	MarketplaceCardBaseProps,
	ShopCardSpecificProps,
	MarketCardSpecificProps,
	MarketplaceCollectibleCardProps,
	ShopCollectibleCardProps,
	MarketCollectibleCardProps,
	NonTradableInventoryCardProps,
	CollectibleCardProps,
};
