import { skipToken } from '@tanstack/react-query';
import { avalanche, optimism } from 'viem/chains';
import { compareAddress } from '../../../../../utils';
import type { AdditionalFee } from '../../../../_internal';
import { useMarketplaceConfig } from '../../../../hooks';

export type FeesParams = {
	chainId: number;
	collectionAddress: string;
};

export const useMarketPlatformFee = (params: FeesParams | typeof skipToken) => {
	const defaultFee = 2.5;
	const defaultPlatformFeeRecipient =
		'0x858dB1cbF6D09D447C96A11603189b49B2D1C219';
	const avalancheAndOptimismPlatformFeeRecipient =
		'0x400cdab4676c17aec07e8ec748a5fc3b674bca41';
	const { data: marketplaceConfig } = useMarketplaceConfig();

	// Early return if skipToken is passed
	if (params === skipToken) {
		return {
			amount: 0n,
			receiver: defaultPlatformFeeRecipient,
		} satisfies AdditionalFee;
	}

	const { chainId, collectionAddress } = params;

	// Find collection in market collections only (not shop collections)
	const marketCollection = marketplaceConfig?.market?.collections?.find(
		(col) =>
			compareAddress(col.itemsAddress, collectionAddress) &&
			String(col.chainId) === String(chainId),
	);

	const avalancheOrOptimism =
		chainId === avalanche.id || chainId === optimism.id;
	const receiver = avalancheOrOptimism
		? avalancheAndOptimismPlatformFeeRecipient
		: defaultPlatformFeeRecipient;

	const percentageToBPS = (percentage: string | number) =>
		(Number(percentage) * 10000) / 100;

	// Use collection fee if found in market collections, otherwise use default
	const feePercentage = marketCollection?.feePercentage ?? defaultFee;

	return {
		amount: BigInt(Math.round(percentageToBPS(feePercentage))),
		receiver,
	} satisfies AdditionalFee;
};
