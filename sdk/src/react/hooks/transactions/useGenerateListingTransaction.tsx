import { useMutation } from '@tanstack/react-query';
import { useConfig } from '../config/useConfig';

export type UseGenerateListingTransactionRequest = {
	chainId: number;
	onSuccess?: (data?: Step[]) => void;
};

import type * as types from '../../../types';
import { dateToUnixTime } from '../../../utils/date';
import {
	type CreateReq,
	type GenerateListingTransactionRequest,
	getMarketplaceClient,
	type Step,
} from '../../_internal';

export type CreateReqWithDateExpiry = Omit<CreateReq, 'expiry'> & {
	expiry: Date;
};

export type GenerateListingTransactionProps = Omit<
	GenerateListingTransactionRequest,
	'listing'
> & {
	listing: CreateReqWithDateExpiry;
};

type GenerateListingTransactionRequestWithNumberChainId = Omit<
	GenerateListingTransactionRequest,
	'chainId' | 'listing'
> & {
	chainId: number;
	listing: CreateReqWithDateExpiry;
};

export const generateListingTransaction = async (
	params: GenerateListingTransactionRequestWithNumberChainId,
	config: types.SdkConfig,
): Promise<Step[]> => {
	const args = {
		...params,
		chainId: params.chainId,
		listing: {
			...params.listing,
			expiry: dateToUnixTime(params.listing.expiry),
		},
	};
	const marketplaceClient = getMarketplaceClient(config);
	return (await marketplaceClient.generateListingTransaction(args)).steps;
};

export const useGenerateListingTransaction = (
	params: UseGenerateListingTransactionRequest,
) => {
	const config = useConfig();

	const { mutate, mutateAsync, ...result } = useMutation({
		onSuccess: (data) => {
			// Only pass the data (steps) to the user's onSuccess callback to maintain backwards compatibility
			if (params.onSuccess) {
				params.onSuccess(data);
			}
		},
		mutationFn: (
			args: Omit<GenerateListingTransactionRequestWithNumberChainId, 'chainId'>,
		) =>
			generateListingTransaction({ ...args, chainId: params.chainId }, config),
	});

	return {
		...result,
		generateListingTransaction: mutate,
		generateListingTransactionAsync: mutateAsync,
	};
};
