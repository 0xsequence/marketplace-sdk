import { useQuery } from '@tanstack/react-query';
import { useConfig } from './useConfig';

import {
	type FetchTokenMetadataArgs,
	tokenMetadataOptions,
} from '../queries/listTokenMetadata';

export const useListTokenMetadata = (args: FetchTokenMetadataArgs) => {
	const config = useConfig();
	const { chainId, contractAddress, tokenIds, query } = args;

	return useQuery({
		...tokenMetadataOptions(
			{ chainId, contractAddress, tokenIds, query },
			config,
		),
	});
};
