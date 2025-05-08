import type { Address } from 'viem';
import { z } from 'zod';
import type { ContractType, CreateReq } from '../../types';
import type { MarketplaceKind } from './api';

export const QueryArgSchema = z
	.object({
		enabled: z.boolean().optional(),
	})
	.optional();

export type QueryArg = z.infer<typeof QueryArgSchema>;

export const CollectableIdSchema = z.string().or(z.number());

export const AddressSchema = z.string().transform((val, ctx) => {
	const regex = /^0x[a-fA-F0-9]{40}$/;

	if (!regex.test(val)) {
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			message: `Invalid Address ${val}`,
		});
	}

	return val as Address;
});

export enum StoreType {
	MARKETPLACE = 'marketplace',
	SHOP = 'shop',
}

export type CollectionType = ContractType.ERC1155 | ContractType.ERC721;

type TransactionStep = {
	exist: boolean;
	isExecuting: boolean;
	execute: () => Promise<void>;
};

export type TransactionSteps = {
	approval: TransactionStep;
	transaction: TransactionStep;
};

export enum TransactionType {
	BUY = 'BUY',
	SELL = 'SELL',
	LISTING = 'LISTING',
	OFFER = 'OFFER',
	TRANSFER = 'TRANSFER',
	CANCEL = 'CANCEL',
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
