import { ChainId as NetworkChainId } from '@0xsequence/network';
import type { Address } from 'viem';
import { z } from 'zod';
import type { ContractType } from '../../types';

export const QueryArgSchema = z
	.object({
		enabled: z.boolean().optional(),
	})
	.optional();

export type QueryArg = z.infer<typeof QueryArgSchema>;

export const CollectableIdSchema = z.string().or(z.number());

export const ChainIdSchema = z.union([
	z.string(),
	z.number(),
	z.nativeEnum(NetworkChainId),
]);

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

export type ChainId = z.infer<typeof ChainIdSchema>;

export type CollectionType = ContractType.ERC1155 | ContractType.ERC721;

type TransactionStep = {
	isExist: boolean;
	isExecuting: boolean;
	execute: () => Promise<void>;
};

export type TransactionSteps = {
	approval: TransactionStep;
	transaction: TransactionStep;
};
