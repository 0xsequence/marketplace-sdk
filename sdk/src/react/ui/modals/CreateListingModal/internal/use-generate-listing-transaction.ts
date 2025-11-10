import { skipToken, useQuery } from '@tanstack/react-query';
import type { Address } from 'viem';
import { useAccount } from 'wagmi';
import {
	type ContractType,
	type CreateReq,
	type GenerateListingTransactionArgs,
	getMarketplaceClient,
	type OrderbookKind,
	StepType,
	type ValuesOptional,
} from '../../../../_internal';
import { useConfig } from '../../../../hooks';
import { useConnectorMetadata } from '../../../../hooks/config/useConnectorMetadata';

type UseGenerateListingTransactionArgs = ValuesOptional<
	Omit<GenerateListingTransactionArgs, 'chainId'> & {
		chainId: number;
	}
>;

const generateListingTransaction = async (
	args: Omit<GenerateListingTransactionArgs, 'chainId'> & { chainId: number },
	config: any,
) => {
	const marketplaceClient = getMarketplaceClient(config);
	const argsWithStringChainId = {
		...args,
		chainId: String(args.chainId),
	} satisfies GenerateListingTransactionArgs;

	const steps = await marketplaceClient
		.generateListingTransaction(argsWithStringChainId)
		.then((data) => data.steps);

	if (steps.length === 0) {
		throw new Error('No steps generated');
	}

	return {
		listStep: steps.find((step) => step.id !== StepType.tokenApproval),
		approveStep: steps.find((step) => step.id === StepType.tokenApproval),
	};
};

export const useGenerateListingTransaction = (
	params: UseGenerateListingTransactionArgs,
) => {
	const config = useConfig();
	const { walletKind } = useConnectorMetadata();
	const { address } = useAccount();

	const {
		chainId,
		collectionAddress,
		contractType,
		orderbook,
		listing,
		additionalFees,
	} = params;

	const enabled =
		!!chainId &&
		!!collectionAddress &&
		!!address &&
		!!contractType &&
		!!orderbook &&
		!!listing;

	return useQuery({
		queryKey: ['generateListingTransaction', params, address],
		queryFn: enabled
			? () =>
					generateListingTransaction(
						{
							chainId,
							collectionAddress: collectionAddress as Address,
							owner: address,
							walletType: walletKind,
							contractType: contractType as ContractType,
							orderbook: orderbook as OrderbookKind,
							listing: listing as CreateReq,
							additionalFees: additionalFees || [],
						},
						config,
					)
			: skipToken,
	});
};
