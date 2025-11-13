import { skipToken, useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { dateToUnixTime } from '../../../../../utils/date';
import {
	type ContractType,
	type CreateReq,
	type GenerateOfferTransactionRequest,
	getMarketplaceClient,
	OfferType,
	type OrderbookKind,
	type QueryArg,
	StepType,
} from '../../../../_internal';
import { useConfig, useConnectorMetadata } from '../../../../hooks';

export interface UseGetTokenApprovalDataArgs {
	chainId: number;
	tokenId: bigint;
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
	const { address } = useAccount();
	const { walletKind } = useConnectorMetadata();
	const marketplaceClient = getMarketplaceClient(config);

	const offer = {
		tokenId: params.tokenId,
		quantity: 1n,
		currencyAddress: params.currencyAddress,
		pricePerToken: 1n,
		expiry: String(Number(dateToUnixTime(new Date())) + ONE_DAY_IN_SECONDS),
	} satisfies CreateReq;

	const isEnabled = address && params.query?.enabled !== false;

	const { data, isLoading, isSuccess, isError, error } = useQuery({
		queryKey: ['token-approval-data', params.currencyAddress],
		queryFn: isEnabled
			? async () => {
					const args = {
						chainId: params.chainId,
						collectionAddress: params.collectionAddress,
						maker: address,
						walletType: walletKind,
						contractType: params.contractType,
						orderbook: params.orderbook,
						offer,
						offerType: OfferType.item,
						additionalFees: [],
					} satisfies GenerateOfferTransactionRequest;
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
		enabled:
			!!address && !!params.collectionAddress && !!params.currencyAddress,
	});

	return {
		data,
		isLoading,
		isSuccess,
		isError,
		error,
	};
};
