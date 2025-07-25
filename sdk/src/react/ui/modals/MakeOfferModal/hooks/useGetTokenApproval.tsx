import { skipToken, useQuery } from '@tanstack/react-query';
import { dateToUnixTime } from '../../../../../utils/date';
import {
	type ContractType,
	type CreateReq,
	type GenerateOfferTransactionArgs,
	getMarketplaceClient,
	type OrderbookKind,
	type QueryArg,
	StepType,
} from '../../../../_internal';
import { useWallet } from '../../../../_internal/wallet/useWallet';
import { useConfig } from '../../../../hooks';

export interface UseGetTokenApprovalDataArgs {
	chainId: number;
	tokenId: string;
	collectionAddress: string;
	currencyAddress: string;
	contractType: ContractType;
	orderbook: OrderbookKind;
	query?: QueryArg;
}

const ONE_DAY_IN_SECONDS = 60 * 60 * 24;

export const useGetTokenApprovalData = (
	params: UseGetTokenApprovalDataArgs,
) => {
	const config = useConfig();
	const { wallet } = useWallet();
	const marketplaceClient = getMarketplaceClient(config);

	const offer = {
		tokenId: params.tokenId,
		quantity: '1',
		currencyAddress: params.currencyAddress,
		pricePerToken: '1',
		expiry: String(Number(dateToUnixTime(new Date())) + ONE_DAY_IN_SECONDS),
	} satisfies CreateReq;

	const isEnabled = wallet && params.query?.enabled !== false;

	const { data, isLoading, isSuccess } = useQuery({
		queryKey: ['token-approval-data', params.currencyAddress],
		queryFn: isEnabled
			? async () => {
					const args = {
						chainId: String(params.chainId),
						collectionAddress: params.collectionAddress,
						maker: await wallet.address(),
						walletType: wallet.walletKind,
						contractType: params.contractType,
						orderbook: params.orderbook,
						offer,
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
				}
			: skipToken,
		enabled: !!wallet && !!params.collectionAddress && !!params.currencyAddress,
	});

	return {
		data,
		isLoading,
		isSuccess,
	};
};
