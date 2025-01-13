import {
	type ContractType,
	type CreateReq,
	type GenerateListingTransactionArgs,
	GenerateOfferTransactionArgs,
	getMarketplaceClient,
	type OrderbookKind,
	StepType,
} from '../../../_internal';
import { useQuery } from '@tanstack/react-query';
import { useWallet } from '../../../_internal/transaction-machine/useWallet';
import { useConfig } from '../../../hooks/useConfig';
import { dateToUnixTime } from '../../../../utils/date';

export interface UseGetTokenApprovalDataArgs {
	chainId: string;
	tokenId: string;
	collectionAddress: string;
	currencyAddress: string;
	contractType: ContractType;
	orderbook: OrderbookKind;
}

const ONE_DAY_IN_SECONDS = 60 * 60 * 24;

export const useGetTokenApprovalData = (
	params: UseGetTokenApprovalDataArgs,
) => {
	const config = useConfig();
	const { wallet } = useWallet();
	const marketplaceClient = getMarketplaceClient(params.chainId, config);

	const offer = {
		tokenId: params.tokenId,
		quantity: '1',
		currencyAddress: params.currencyAddress,
		pricePerToken: '100000',
		expiry: String(Number(dateToUnixTime(new Date())) + ONE_DAY_IN_SECONDS),
	} satisfies CreateReq;

	const { data, isLoading, isSuccess } = useQuery({
		queryKey: ['token-approval-data', params.currencyAddress],
		queryFn: async () => {
			const args = {
				collectionAddress: params.collectionAddress,
                            maker: await wallet!.address(),
				walletType: wallet!.walletKind,
				contractType: params.contractType,
                                   orderbook: params.orderbook,
                            offer
			} satisfies GenerateOfferTransactionArgs;
			const steps = await marketplaceClient
				.generateOfferTransaction(args)
				.then((resp) => resp.steps);

			const tokenApprovalStep = steps.find(
				(step) => step.id === StepType.tokenApproval,
			);
			if (!tokenApprovalStep) {
				return {
					step: null,
				};
			}

			return {
				step: tokenApprovalStep,
			};
		},
	});

	return {
		data,
		isLoading,
		isSuccess,
	};
};