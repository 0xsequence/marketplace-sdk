import { useMutation } from '@tanstack/react-query';
import { useConfig } from './useConfig';

export type UseGenerateListingTransactionArgs = {
	chainId: ChainId;
	onSuccess?: (data?: Step[]) => void;
};

import type { SdkConfig } from '../../types';
import { dateToUnixTime } from '../../utils/date';
import {
	type ChainId,
	type CreateReq,
	type GenerateListingTransactionArgs,
	type Step,
	getMarketplaceClient,
} from '../_internal';

export type CreateReqWithDateExpiry = Omit<CreateReq, 'expiry'> & {
	expiry: Date;
};

export type GenerateListingTransactionProps = Omit<
	GenerateListingTransactionArgs,
	'listing'
> & {
	listing: CreateReqWithDateExpiry;
};

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
