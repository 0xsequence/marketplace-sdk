import { ChainId as NetworkChainId } from '@0xsequence/network';
import type { ContractType } from '@types';
import { z } from 'zod';

export const QueryArgSchema = z
	.object({
		enabled: z.boolean().optional(),
	})
	.optional();

export type QueryArg = z.infer<typeof QueryArgSchema>;

export const ChainIdSchema = z.union([
	z.string(),
	z.number(),
	z.nativeEnum(NetworkChainId),
]);

const addressRegex = /^0x[a-fA-F0-9]{40}$/;
export const AddressSchema = z.string().regex(addressRegex).brand<'Address'>();

export type ChainId = z.infer<typeof ChainIdSchema>;

export type CollectionType = ContractType.ERC1155 | ContractType.ERC721;
