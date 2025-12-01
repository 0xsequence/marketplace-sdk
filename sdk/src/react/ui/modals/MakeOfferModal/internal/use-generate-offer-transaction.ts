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
	const serializedArgs = {
		...args,
		chainId: args.chainId,
		offer: args.offer
			? {
					...args.offer,
					tokenId: args.offer.tokenId?.toString(),
					quantity: args.offer.quantity?.toString(),
					pricePerToken: args.offer.pricePerToken?.toString(),
				}
			: undefined,
	};
	const response = await marketplaceClient.generateOfferTransaction(
		serializedArgs as GenerateOfferTransactionRequest,
	);
	const steps = response.steps;

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

	const serializableParams = {
		...params,
		offer: params.offer
			? {
					...params.offer,
					tokenId: params.offer.tokenId?.toString(),
					quantity: params.offer.quantity?.toString(),
					pricePerToken: params.offer.pricePerToken?.toString(),
				}
			: undefined,
	};

	return useQuery({
		queryKey: ['generateOfferTransaction', serializableParams, address],
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
							offerType: OfferType.item,
						},
						config,
					)
			: skipToken,
	});
};
