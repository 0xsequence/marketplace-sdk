import { useMutation } from '@tanstack/react-query';
import type { SdkConfig } from '../../types';
import {
	type ChainId,
	type CreateReq,
	type GenerateOfferTransactionArgs,
	type Step,
	getMarketplaceClient,
} from '../_internal';
import { useConfig } from './useConfig';
import { dateToUnixTime } from '../../utils/date';

export type UseGenerateOfferTransactionArgs = {
	chainId: ChainId;
	onSuccess?: (data?: Step[]) => void;
};

type CreateReqWithDateExpiry = Omit<CreateReq, 'expiry'> & {
	expiry: Date;
};

export type GenerateOfferTransactionProps = Omit<
	GenerateOfferTransactionArgs,
	'offer'
> & {
	offer: CreateReqWithDateExpiry;
};

export const generateOfferTransaction = async (
	params: GenerateOfferTransactionProps,
	config: SdkConfig,
	chainId: ChainId,
) => {
	const args = {
		...params,
		offer: { ...params.offer, expiry: dateToUnixTime(params.offer.expiry) },
	} satisfies GenerateOfferTransactionArgs;
	const marketplaceClient = getMarketplaceClient(chainId, config);
	return (await marketplaceClient.generateOfferTransaction(args)).steps;
};

export const useGenerateOfferTransaction = (
	params: UseGenerateOfferTransactionArgs,
) => {
	const config = useConfig();

	const { mutate, mutateAsync, ...result } = useMutation({
		onSuccess: params.onSuccess,
		mutationFn: (args: GenerateOfferTransactionProps) =>
			generateOfferTransaction(args, config, params.chainId),
	});

	return {
		...result,
		generateOfferTransaction: mutate,
		generateOfferTransactionAsync: mutateAsync,
	};
};
