import { skipToken, useQuery } from '@tanstack/react-query';
import type { SdkConfig } from '../../../../../types';
import {
	type AdditionalFee,
	type GenerateSellTransactionRequest,
	getMarketplaceClient,
	StepType,
	type ValuesOptional,
} from '../../../../_internal';
import { useConfig } from '../../../../hooks';
import { useMarketPlatformFee } from '../../BuyModal/hooks/useMarketPlatformFee';

type GenerateSellTransactionArgsWithNumberChainId = Omit<
	GenerateSellTransactionRequest,
	'chainId'
> & { chainId: number };

type UseGenerateSellTransactionArgs = ValuesOptional<
	Omit<GenerateSellTransactionArgsWithNumberChainId, 'additionalFees'> & {
		additionalFees?: AdditionalFee[];
	}
>;

const generateSellTransaction = async (
	args: GenerateSellTransactionArgsWithNumberChainId,
	config: SdkConfig,
) => {
	const marketplaceClient = getMarketplaceClient(config);
	const argsWithStringChainId = {
		...args,
		chainId: args.chainId,
	} satisfies GenerateSellTransactionRequest;
	const steps = await marketplaceClient
		.generateSellTransaction(argsWithStringChainId)
		.then((data) => data.steps);

	if (steps.length === 0) {
		throw new Error('No steps generated');
	}

	return {
		sellStep: steps.find((step) => step.id === StepType.sell),
		approveStep: steps.find((step) => step.id === StepType.tokenApproval),
	};
};

export const useGenerateSellTransaction = (
	params: UseGenerateSellTransactionArgs,
) => {
	const client = useConfig();

	const { chainId, collectionAddress, seller, marketplace, ordersData } =
		params;

	const enabled =
		!!chainId &&
		!!collectionAddress &&
		!!seller &&
		!!marketplace &&
		!!ordersData;

	const additionalFees = params.additionalFees ? params.additionalFees : [];

	const platformFeeParams = enabled
		? {
				chainId,
				collectionAddress,
			}
		: skipToken;

	const platformFee = useMarketPlatformFee(platformFeeParams);

	return useQuery({
		queryKey: ['generateSellTransaction', params],
		queryFn: enabled
			? () =>
					generateSellTransaction(
						{
							...params,
							chainId,
							marketplace,
							seller,
							collectionAddress,
							ordersData,
							additionalFees: [platformFee, ...additionalFees],
							useWithTrails: false, // SellModal doesn't support trails yet
						},
						client,
					)
			: undefined,
		enabled,
	});
};
