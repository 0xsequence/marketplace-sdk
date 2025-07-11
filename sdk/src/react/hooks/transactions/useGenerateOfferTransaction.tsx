import { useMutation } from '@tanstack/react-query';
import type { SdkConfig } from '../../../../types';
import { dateToUnixTime } from '../../../../utils/date';
import {
	type CreateReq,
	type GenerateOfferTransactionArgs,
	getMarketplaceClient,
	type Step,
	type WalletKind,
} from '../../_internal';
import { useWallet } from '../../_internal/wallet/useWallet';
import { useConfig } from '../config/useConfig';

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

type GenerateOfferTransactionArgsWithNumberChainId = Omit<
	GenerateOfferTransactionArgs,
	'chainId' | 'offer'
> & {
	chainId: number;
	offer: CreateReqWithDateExpiry;
};

export const generateOfferTransaction = async (
	params: GenerateOfferTransactionArgsWithNumberChainId,
	config: SdkConfig,
	walletKind?: WalletKind,
) => {
	const args = {
		...params,
		chainId: String(params.chainId),
		offer: { ...params.offer, expiry: dateToUnixTime(params.offer.expiry) },
		walletType: walletKind,
	} satisfies GenerateOfferTransactionArgs;
	const marketplaceClient = getMarketplaceClient(config);
	return (await marketplaceClient.generateOfferTransaction(args)).steps;
};

export const useGenerateOfferTransaction = (
	params: UseGenerateOfferTransactionArgs,
) => {
	const config = useConfig();
	const { wallet } = useWallet();

	const { mutate, mutateAsync, ...result } = useMutation({
		onSuccess: params.onSuccess,
		mutationFn: (
			args: Omit<GenerateOfferTransactionArgsWithNumberChainId, 'chainId'>,
		) =>
			generateOfferTransaction(
				{ ...args, chainId: params.chainId },
				config,
				wallet?.walletKind,
			),
	});

	return {
		...result,
		generateOfferTransaction: mutate,
		generateOfferTransactionAsync: mutateAsync,
	};
};
