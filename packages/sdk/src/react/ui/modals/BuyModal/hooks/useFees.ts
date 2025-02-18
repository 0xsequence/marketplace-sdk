import { avalanche, optimism } from 'viem/chains';
import type { AdditionalFee } from '../../../../_internal';
import { useMarketplaceConfig } from '../../../../hooks';

export const useFees = ({
	chainId,
	collectionAddress,
}: {
	chainId: number;
	collectionAddress: string;
}) => {
	const defaultFee = 2.5;
	const defaultPlatformFeeRecipient =
		'0x858dB1cbF6D09D447C96A11603189b49B2D1C219';
	const avalancheAndOptimismPlatformFeeRecipient =
		'0x400cdab4676c17aec07e8ec748a5fc3b674bca41';
	const { data: marketplaceConfig } = useMarketplaceConfig();

	const collection = marketplaceConfig?.collections.find(
		(collection) =>
			collection.address.toLowerCase() === collectionAddress.toLowerCase() &&
			chainId === Number(collection.chainId),
	);

	const avalancheOrOptimism =
		chainId === avalanche.id || chainId === optimism.id;
	const receiver = avalancheOrOptimism
		? avalancheAndOptimismPlatformFeeRecipient
		: defaultPlatformFeeRecipient;

	const percentageToBPS = (percentage: string | number) =>
		(Number(percentage) * 10000) / 100;

	return {
		amount: percentageToBPS(collection?.feePercentage || defaultFee).toString(),
		receiver,
	} satisfies AdditionalFee;
};
