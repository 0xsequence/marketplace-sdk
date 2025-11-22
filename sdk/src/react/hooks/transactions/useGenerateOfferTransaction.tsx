import { useMutation } from '@tanstack/react-query';
import type { SdkConfig } from '../../../types';
import { dateToUnixTime } from '../../../utils/date';
import {
	type CreateReq,
	type GenerateOfferTransactionRequest,
	getMarketplaceClient,
	type Step,
	type WalletKind,
} from '../../_internal';
import { useConfig } from '../config/useConfig';
import { useConnectorMetadata } from '../config/useConnectorMetadata';

export type UseGenerateOfferTransactionRequest = {
	chainId: number;
	onSuccess?: (data?: Step[]) => void;
};

type CreateReqWithDateExpiry = Omit<CreateReq, 'expiry'> & {
	expiry: Date;
};

export type GenerateOfferTransactionProps = Omit<
	GenerateOfferTransactionRequest,
	'offer'
> & {
	offer: CreateReqWithDateExpiry;
};

type GenerateOfferTransactionRequestWithNumberChainId = Omit<
	GenerateOfferTransactionRequest,
	'chainId' | 'offer'
> & {
	chainId: number;
	offer: CreateReqWithDateExpiry;
};

export const generateOfferTransaction = async (
	params: GenerateOfferTransactionRequestWithNumberChainId,
	config: SdkConfig,
	walletKind?: WalletKind,
): Promise<Step[]> => {
	const args = {
		...params,
		chainId: params.chainId,
		offer: { ...params.offer, expiry: dateToUnixTime(params.offer.expiry) },
		walletType: walletKind,
	};
	const marketplaceClient = getMarketplaceClient(config);
	return (await marketplaceClient.generateOfferTransaction(args)).steps;
};

export const useGenerateOfferTransaction = (
	params: UseGenerateOfferTransactionRequest,
) => {
	const config = useConfig();
	const { walletKind } = useConnectorMetadata();

	const { mutate, mutateAsync, ...result } = useMutation({
		onSuccess: params.onSuccess,
		mutationFn: (
			args: Omit<GenerateOfferTransactionRequestWithNumberChainId, 'chainId'>,
		) =>
			generateOfferTransaction(
				{ ...args, chainId: params.chainId },
				config,
				walletKind,
			),
	});

	return {
		...result,
		generateOfferTransaction: mutate,
		generateOfferTransactionAsync: mutateAsync,
	};
};
