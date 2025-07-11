import { useMutation } from '@tanstack/react-query';
import { useConfig } from '../config/useConfig';

export type UseGenerateListingTransactionArgs = {
	chainId: number;
	onSuccess?: (data?: Step[]) => void;
};

import type { SdkConfig } from '../../../../types';
import { dateToUnixTime } from '../../../utils/date';
import {
	type CreateReq,
	type GenerateListingTransactionArgs,
	getMarketplaceClient,
	type Step,
} from '../../_internal';

export type CreateReqWithDateExpiry = Omit<CreateReq, 'expiry'> & {
	expiry: Date;
};

export type GenerateListingTransactionProps = Omit<
	GenerateListingTransactionArgs,
	'listing'
> & {
	listing: CreateReqWithDateExpiry;
};

type GenerateListingTransactionArgsWithNumberChainId = Omit<
	GenerateListingTransactionArgs,
	'chainId' | 'listing'
> & {
	chainId: number;
	listing: CreateReqWithDateExpiry;
};

export const generateListingTransaction = async (
	params: GenerateListingTransactionArgsWithNumberChainId,
	config: SdkConfig,
) => {
	const args = {
		...params,
		chainId: String(params.chainId),
		listing: {
			...params.listing,
			expiry: dateToUnixTime(params.listing.expiry),
		},
	} satisfies GenerateListingTransactionArgs;
	const marketplaceClient = getMarketplaceClient(config);
	return (await marketplaceClient.generateListingTransaction(args)).steps;
};

export const useGenerateListingTransaction = (
	params: UseGenerateListingTransactionArgs,
) => {
	const config = useConfig();

	const { mutate, mutateAsync, ...result } = useMutation({
		onSuccess: params.onSuccess,
		mutationFn: (
			args: Omit<GenerateListingTransactionArgsWithNumberChainId, 'chainId'>,
		) =>
			generateListingTransaction({ ...args, chainId: params.chainId }, config),
	});

	return {
		...result,
		generateListingTransaction: mutate,
		generateListingTransactionAsync: mutateAsync,
	};
};
