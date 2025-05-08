import type { SdkConfig } from '@0xsequence/marketplace-sdk';
import { useConfig } from '@0xsequence/marketplace-sdk/react';
import { SequenceMetadata } from '@0xsequence/metadata';
import { useQuery } from '@tanstack/react-query';

export const getMetadataClient = (config: SdkConfig) => {
	const projectAccessKey = config.projectAccessKey;
	return new SequenceMetadata(
		'https://dev-metadata.sequence.app',
		projectAccessKey,
	);
};

export const useTokenMetadata = (
	chainId: number,
	contractAddress: string,
	tokenIds: number[],
) => {
	const config = useConfig();
	const metadataClient = getMetadataClient(config);

	return useQuery({
		queryKey: ['tokenMetadata', chainId, contractAddress, tokenIds],
		queryFn: async () => {
			const res = await metadataClient.getTokenMetadata({
				chainID: String(chainId),
				contractAddress,
				tokenIDs: tokenIds.map(String),
			});

			return res.tokenMetadata;
		},
		enabled: !!chainId && !!contractAddress,
	});
};
