import { queryOptions } from '@tanstack/react-query';
import type { SdkConfig } from '../../types';
//TODO: This is not complete, there is no hook for this,
// add it if we need it in the future
import { getIndexerClient } from '../_internal';

export type UseGetTokenSuppliesArgs = {
	chainId: number;
	contractAddress: string;
	tokenId: string;
	isLaos721?: boolean;
};

export async function getTokenSupplies(
	args: UseGetTokenSuppliesArgs,
	config: SdkConfig,
) {
	if (args.isLaos721) {
		const response = await fetch(
			'https://extensions.api.laosnetwork.io/token/GetTokenSupplies',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					chainId: args.chainId.toString(),
					contractAddress: args.contractAddress,
					includeMetadata: true,
					page: {
						sort: [
							{
								column: 'CREATED_AT',
								order: 'DESC',
							},
						],
					},
				}),
			},
		);

		if (!response.ok) {
			throw new Error(`Laos Network API error: ${response.statusText}`);
		}

		return response.json();
	}

	const indexerClient = getIndexerClient(args.chainId, config);
	const tokenSupplies = await indexerClient.getTokenSupplies(args);
	return tokenSupplies;
}

export function getTokenSuppliesOptions(
	args: UseGetTokenSuppliesArgs,
	config: SdkConfig,
) {
	return queryOptions({
		queryKey: ['getTokenSupplies', args],
		queryFn: () => getTokenSupplies(args, config),
	});
}
