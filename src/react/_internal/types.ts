import { ChainId as NetworkChainId } from '@0xsequence/network';
import type { ContractType } from '@types';
import { z } from 'zod';

export const QueryArgSchema = z
	.object({
		query: z
			.object({
				enabled: z.boolean().optional(),
			})
			.optional(),
	})
	.optional();

export type QueryArg = z.infer<typeof QueryArgSchema>;

export const ChainIdSchema = z.union([
	z.string(),
	z.number(),
	z.nativeEnum(NetworkChainId),
]);

export type ChainId = z.infer<typeof ChainIdSchema>;

export type CollectionType = ContractType.ERC1155 | ContractType.ERC721;
