import { skipToken, useQuery } from '@tanstack/react-query';
import type { Address } from 'viem';
import { useAccount } from 'wagmi';
import { dateToUnixTime } from '../../../../../utils/date';
import { useConfig, useConnectorMetadata } from '../../../..';
import {
	type ContractType,
	type CreateReq,
	type GenerateListingTransactionRequest,
	getMarketplaceClient,
	type OrderbookKind,
	type QueryArg,
	StepType,
} from '../../../../_internal';

export interface UseGetTokenApprovalDataArgs {
	chainId: number;
	tokenId: bigint;
	collectionAddress: Address;
	currencyAddress: Address;
	contractType: ContractType;
	orderbook: OrderbookKind;
	query?: QueryArg;
}

const ONE_DAY_IN_SECONDS = 60 * 60 * 24;

export const useGetTokenApprovalData = (
	params: UseGetTokenApprovalDataArgs,
) => {
	const config = useConfig();
	const { walletKind } = useConnectorMetadata();
	const { address } = useAccount();
	const marketplaceClient = getMarketplaceClient(config);

	const listing = {
		tokenId: params.tokenId,
		quantity: 1n,
		currencyAddress: params.currencyAddress,
		pricePerToken: 100000n,
		expiry: String(Number(dateToUnixTime(new Date())) + ONE_DAY_IN_SECONDS),
	} satisfies CreateReq;

	const isEnabled =
		address && (params.query?.enabled ?? true) && !!params.currencyAddress;

	const { data, isLoading, isSuccess, isError, error } = useQuery({
		queryKey: ['token-approval-data', params, address],
		queryFn: isEnabled
			? async () => {
					const args = {
						chainId: params.chainId,
						collectionAddress: params.collectionAddress,
						owner: address,
						walletType: walletKind,
						contractType: params.contractType,
						orderbook: params.orderbook,
						listing,
						additionalFees: [],
					} satisfies GenerateListingTransactionRequest;
					const steps = await marketplaceClient
						.generateListingTransaction(args)
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
	});

	return {
		data,
		isLoading,
		isSuccess,
		isError,
		error,
	};
};
