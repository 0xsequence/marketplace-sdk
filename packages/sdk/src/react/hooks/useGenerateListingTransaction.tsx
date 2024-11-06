import {
	type ChainId,
	type GenerateListingTransactionArgs,
	getMarketplaceClient,
} from '@internal';
import { useMutation } from '@tanstack/react-query';
import type { SdkConfig, Step } from '@types';
import { useConfig } from './useConfig';

export type UseGenerateListingTransactionArgs = {
	chainId: ChainId;
	onSuccess?: (data?: Step[]) => void;
};

import type { CreateReq } from '@types';

export type CreateReqWithDateExpiry = Omit<CreateReq, 'expiry'> & {
	expiry: Date;
};

export type GenerateListingTransactionProps = Omit<
	GenerateListingTransactionArgs,
	'listing'
> & {
	listing: CreateReqWithDateExpiry;
};

const dateToUnixTime = (date: Date) =>
	Math.floor(date.getTime() / 1000).toString();

export const generateListingTransaction = async (
	params: GenerateListingTransactionProps,
	config: SdkConfig,
	chainId: ChainId,
) => {
	const args = {
		...params,
		listing: {
			...params.listing,
			expiry: dateToUnixTime(params.listing.expiry),
		},
	} satisfies GenerateListingTransactionArgs;
	const marketplaceClient = getMarketplaceClient(chainId, config);
	return (await marketplaceClient.generateListingTransaction(args)).steps;
};

export const useGenerateListingTransaction = (
	params: UseGenerateListingTransactionArgs,
) => {
	const config = useConfig();

	const { mutate, mutateAsync, ...result } = useMutation({
		onSuccess: params.onSuccess,
		mutationFn: (args: GenerateListingTransactionProps) =>
			generateListingTransaction(args, config, params.chainId),
	});

	return {
		...result,
		generateListingTransaction: mutate,
		generateListingTransactionAsync: mutateAsync,
	};
};
