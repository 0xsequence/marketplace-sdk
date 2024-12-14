import type { Hex } from 'viem';
import {
	type AdditionalFee,
	type ContractType,
	type CreateReq,
	type MarketplaceKind,
	type SequenceMarketplace,
	type WalletKind,
	WebrpcError,
} from '..';
import { type Step, OrderbookKind } from '../../../types';
import {
	StepGenerationError,
	UnknownTransactionTypeError,
} from '../../../utils/_internal/error/transaction';
import { TransactionType } from './execute-transaction';

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

export type Input =
	| BuyInput
	| SellInput
	| ListingInput
	| OfferInput
	| CancelInput;

type TransactionInput =
	| {
			type: TransactionType.BUY;
			props: BuyInput;
	  }
	| {
			type: TransactionType.SELL;
			props: SellInput;
	  }
	| {
			type: TransactionType.LISTING;
			props: ListingInput;
	  }
	| {
			type: TransactionType.OFFER;
			props: OfferInput;
	  }
	| {
			type: TransactionType.CANCEL;
			props: CancelInput;
	  };

export async function generateSteps({
	input,
	marketplaceClient,
	collectionAddress,
	walletKind,
	address,
	marketplaceFee,
}: {
	input: TransactionInput;
	marketplaceClient: SequenceMarketplace;
	collectionAddress: Hex;
	walletKind: WalletKind;
	marketplaceFee: AdditionalFee;
	address: Hex;
}): Promise<Step[]> {
	const { type, props } = input;
	try {
		switch (type) {
			case TransactionType.BUY:
				return await marketplaceClient
					.generateBuyTransaction({
						collectionAddress,
						buyer: address,
						walletType: walletKind,
						marketplace: props.marketplace,
						ordersData: [
							{
								orderId: props.orderId,
								quantity: props.quantity || '1',
							},
						],
						additionalFees: [marketplaceFee],
					})
					.then((resp) => resp.steps);

			case TransactionType.SELL:
				return await marketplaceClient
					.generateSellTransaction({
						collectionAddress,
						seller: address,
						walletType: walletKind,
						marketplace: props.marketplace,
						ordersData: [
							{
								orderId: props.orderId,
								quantity: props.quantity || '1',
							},
						],
						additionalFees: [],
					})
					.then((resp) => resp.steps);

			case TransactionType.LISTING:
				return await marketplaceClient
					.generateListingTransaction({
						collectionAddress,
						owner: address,
						walletType: walletKind,
						contractType: props.contractType,
						orderbook: OrderbookKind.sequence_marketplace_v2,
						listing: props.listing,
					})
					.then((resp) => resp.steps);

			case TransactionType.OFFER:
				return await marketplaceClient
					.generateOfferTransaction({
						collectionAddress,
						maker: address,
						walletType: walletKind,
						contractType: props.contractType,
						orderbook: OrderbookKind.sequence_marketplace_v2,
						offer: props.offer,
					})
					.then((resp) => resp.steps);

			case TransactionType.CANCEL:
				return await marketplaceClient
					.generateCancelTransaction({
						collectionAddress,
						maker: address,
						marketplace: props.marketplace,
						orderId: props.orderId,
					})
					.then((resp) => resp.steps);
			default:
				throw new UnknownTransactionTypeError(type);
		}
	} catch (error) {
		if (error instanceof WebrpcError) {
			throw new StepGenerationError(type, error);
		}
		throw error;
	}
}
