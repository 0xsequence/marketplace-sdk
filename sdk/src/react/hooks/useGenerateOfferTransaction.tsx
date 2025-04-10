import { useMutation } from '@tanstack/react-query';
import type { SdkConfig } from '../../types';
import { dateToUnixTime } from '../../utils/date';
import {
	type CreateReq,
	type GenerateOfferTransactionArgs,
	type Step,
	type WalletKind,
	getMarketplaceClient,
} from '../_internal';
import { useWallet } from '../_internal/wallet/useWallet';
import { useConfig } from './useConfig';

export type UseGenerateOfferTransactionArgs = {
	chainId: number;
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
	chainId: number,
	walletKind?: WalletKind,
) => {
	const args = {
		...params,
		offer: { ...params.offer, expiry: dateToUnixTime(params.offer.expiry) },
		walletType: walletKind,
	} satisfies GenerateOfferTransactionArgs;
	const marketplaceClient = getMarketplaceClient(chainId, config);
	return (await marketplaceClient.generateOfferTransaction(args)).steps;
};

export const useGenerateOfferTransaction = (
	params: UseGenerateOfferTransactionArgs,
) => {
	const config = useConfig();
	const { wallet } = useWallet();

	const { mutate, mutateAsync, ...result } = useMutation({
		onSuccess: params.onSuccess,
		mutationFn: (args: GenerateOfferTransactionProps) =>
			generateOfferTransaction(
				args,
				config,
				params.chainId,
				wallet?.walletKind,
			),
	});

	return {
		...result,
		generateOfferTransaction: mutate,
		generateOfferTransactionAsync: mutateAsync,
	};
};
