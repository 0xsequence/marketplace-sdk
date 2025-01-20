import type { ChainId } from '@0xsequence/network';
import type { Hash } from 'viem';
import type { SdkConfig } from '../../../../types/sdk-config';
import type { MarketplaceConfig } from '../../../../types/marketplace-config';
import type { Chain } from '@0xsequence/network';

export enum OrderbookKind {
  unknown = 'unknown',
  sequence_marketplace_v1 = 'sequence_marketplace_v1',
  sequence_marketplace_v2 = 'sequence_marketplace_v2',
  blur = 'blur',
  opensea = 'opensea',
  looks_rare = 'looks_rare',
  reservoir = 'reservoir',
  x2y2 = 'x2y2'
}

export enum MarketplaceKind {
  unknown = 'unknown',
  sequence_marketplace_v1 = 'sequence_marketplace_v1',
  sequence_marketplace_v2 = 'sequence_marketplace_v2',
  blur = 'blur',
  zerox = 'zerox',
  opensea = 'opensea',
  looks_rare = 'looks_rare',
  x2y2 = 'x2y2',
  alienswap = 'alienswap',
}

export enum ContractType {
  UNKNOWN = 'UNKNOWN',
  ERC20 = 'ERC20',
  ERC721 = 'ERC721',
  ERC1155 = 'ERC1155'
}

export interface CreateReq {
  tokenId: string
  quantity: string
  expiry: string
  currencyAddress: string
  pricePerToken: string
}

export enum TransactionType {
	BUY = 'BUY',
	SELL = 'SELL',
	LISTING = 'LISTING',
	OFFER = 'OFFER',
	TRANSFER = 'TRANSFER',
	CANCEL = 'CANCEL',
}

export interface TransactionConfig {
	type: TransactionType;
	chainId: string;
	chains: readonly Chain[];
	collectionAddress: string;
	sdkConfig: SdkConfig;
	marketplaceConfig: MarketplaceConfig;
	orderbookKind?: OrderbookKind;
}


export interface BuyInput {
	orderId: string;
	collectableDecimals: number;
	marketplace: MarketplaceKind;
	quantity: string;
}

export interface SellInput {
	orderId: string;
	marketplace: MarketplaceKind;
	quantity?: string;
}

export interface ListingInput {
	contractType: ContractType;
	listing: CreateReq;
}

export interface OfferInput {
	contractType: ContractType;
	offer: CreateReq;
}

export interface CancelInput {
	orderId: string;
	marketplace: MarketplaceKind;
}
