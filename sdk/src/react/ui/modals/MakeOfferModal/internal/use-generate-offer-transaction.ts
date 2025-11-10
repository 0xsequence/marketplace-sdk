import { skipToken, useQuery } from '@tanstack/react-query';
import type { Address } from 'viem';
import { useAccount } from 'wagmi';
import {
	type ContractType,
	type CreateReq,
	type GenerateOfferTransactionRequest,
	getMarketplaceClient,
	OfferType,
	type OrderbookKind,
	StepType,
	type ValuesOptional,
} from '../../../../_internal';
import { useConfig } from '../../../../hooks';
import { useConnectorMetadata } from '../../../../hooks/config/useConnectorMetadata';

type UseGenerateOfferTransactionArgs = ValuesOptional<
	Omit<GenerateOfferTransactionRequest, 'chainId'> & {
		chainId: number;
	}
>;

const generateOfferTransaction = async (
	args: Omit<GenerateOfferTransactionRequest, 'chainId'> & { chainId: number },
	config: any,
) => {
	const marketplaceClient = getMarketplaceClient(config);
	const argsWithStringChainId = {
		...args,
		chainId: String(args.chainId),
	} satisfies GenerateOfferTransactionRequest;

	const steps = await marketplaceClient
		.generateOfferTransaction(argsWithStringChainId)
		.then((data) => data.steps);

	if (steps.length === 0) {
		throw new Error('No steps generated');
	}

	return {
		offerStep: steps.find((step) => step.id !== StepType.tokenApproval),
		approveStep: steps.find((step) => step.id === StepType.tokenApproval),
	};
};

export const useGenerateOfferTransaction = (
	params: UseGenerateOfferTransactionArgs,
) => {
	const config = useConfig();
	const { walletKind } = useConnectorMetadata();
	const { address } = useAccount();

	const {
		chainId,
		collectionAddress,
		contractType,
		orderbook,
		offer,
		additionalFees,
	} = params;

	const enabled =
		!!chainId &&
		!!collectionAddress &&
		!!address &&
		!!contractType &&
		!!orderbook &&
		!!offer;

	return useQuery({
		queryKey: ['generateOfferTransaction', params, address],
		queryFn: enabled
			? () =>
					generateOfferTransaction(
						{
							chainId,
							collectionAddress: collectionAddress as Address,
							maker: address,
							walletType: walletKind,
							contractType: contractType as ContractType,
							orderbook: orderbook as OrderbookKind,
							offer: offer as CreateReq,
							additionalFees: additionalFees || [],
							offerType: OfferType.item, // WE only support item offers for now
						},
						config,
					)
			: skipToken,
	});
};
