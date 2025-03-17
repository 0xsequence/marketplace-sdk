import { ChainId as NetworkChainId } from '@0xsequence/network';
import type { Address } from 'viem';
import type { Chain } from 'viem';
import { z } from 'zod';
import type { ContractType, CreateReq } from '../../types';
import type { MarketplaceConfig, SdkConfig } from '../../types';
import type { MarketplaceKind, OrderbookKind } from './api';

export const QueryArgSchema: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    enabled?: boolean | undefined;
}, {
    enabled?: boolean | undefined;
}>> = z
	.object({
		enabled: z.boolean().optional(),
	})
	.optional();

export type QueryArg = z.infer<typeof QueryArgSchema>;

export const CollectableIdSchema: z.ZodUnion<[z.ZodString, z.ZodNumber]> = z.string().or(z.number());

export const ChainIdSchema: z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodNativeEnum<typeof NetworkChainId>]> = z.union([
	z.string(),
	z.number(),
	z.nativeEnum(NetworkChainId),
]);

export const AddressSchema: z.ZodEffects<z.ZodString, Address> = z.string().transform((val, ctx) => {
	const regex = /^0x[a-fA-F0-9]{40}$/;

	if (!regex.test(val)) {
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			message: `Invalid Address ${val}`,
		});
	}

	return val as Address;
});

export type ChainId = z.infer<typeof ChainIdSchema>;

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
