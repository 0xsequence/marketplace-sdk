import { skipToken, useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { useConfig } from '../../../..';
import { dateToUnixTime } from '../../../../../utils/date';
import {
	type ContractType,
	type CreateReq,
	type GenerateListingTransactionArgs,
	type OrderbookKind,
	type QueryArg,
	StepType,
	getMarketplaceClient,
} from '../../../../_internal';
import { useWallet } from '../../../../_internal/wallet/useWallet';

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
	const { address } = useAccount();
	const marketplaceClient = getMarketplaceClient(params.chainId, config);

	const listing = {
		tokenId: params.tokenId,
		quantity: '1',
		currencyAddress: params.currencyAddress,
		pricePerToken: '100000',
		expiry: String(Number(dateToUnixTime(new Date())) + ONE_DAY_IN_SECONDS),
	} satisfies CreateReq;

	const isEnabled =
		wallet &&
		address &&
		(params.query?.enabled ?? true) &&
		!!params.currencyAddress;

	const { data, isLoading, isSuccess } = useQuery({
		queryKey: ['token-approval-data', params, address],
		queryFn: isEnabled
			? async () => {
					const args = {
						collectionAddress: params.collectionAddress,
						owner: await wallet.address(),
						walletType: wallet.walletKind,
						contractType: params.contractType,
						orderbook: params.orderbook,
						listing,
					} satisfies GenerateListingTransactionArgs;
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
	};
};
