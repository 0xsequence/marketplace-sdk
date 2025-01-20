import { Chain } from 'viem';
import { MarketplaceKind, OrderbookKind } from '../api';
import { SdkConfig, MarketplaceConfig } from '../../../types';

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
