import type { Chain } from '@0xsequence/network';
import type { SdkConfig } from '../../../../config';
import type { MarketplaceConfig, OrderbookKind } from '../../../../types';
import type { ContractType, CreateReq } from '../../../../types/marketplace.gen';
import type { Hash } from 'viem';

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

interface StateConfig {
	config: TransactionConfig;
	onTransactionSent?: (hash?: Hash, orderId?: string) => void;
	onSuccess?: (hash: Hash) => void;
	onApprovalSuccess?: (hash: Hash) => void;
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
