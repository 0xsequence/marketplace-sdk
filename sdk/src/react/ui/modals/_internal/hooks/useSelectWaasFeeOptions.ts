import { getNetwork } from '@0xsequence/connect';
import { NetworkType } from '@0xsequence/network';
import type { FeeOption } from '../../../../../types/waas-types';
import { useWallet } from '../../../../_internal/wallet/useWallet';

interface UseSelectWaasFeeOptionsProps {
	chainId: string | number;
	isProcessing: boolean;
	feeOptionsVisible: boolean;
	selectedFeeOption: FeeOption;
}

export const useSelectWaasFeeOptions = ({
	chainId,
	isProcessing,
	feeOptionsVisible,
	selectedFeeOption,
}: UseSelectWaasFeeOptionsProps) => {
	const { wallet } = useWallet();
	const network = chainId ? getNetwork(Number(chainId)) : undefined;
	const isTestnet = network?.type === NetworkType.TESTNET;
	const isWaaS = wallet?.isWaaS;
	const isProcessingWithWaaS = isProcessing && isWaaS;

	const shouldHideActionButton =
		!isTestnet &&
		isProcessingWithWaaS &&
		feeOptionsVisible === true &&
		!!selectedFeeOption;

	const waasFeeOptionsShown =
		wallet?.isWaaS && isProcessing && feeOptionsVisible;

	const getActionLabel = (
		defaultLabel: string,
		loadingLabel = 'Loading fee options',
	) => {
		if (isProcessing) {
			return isWaaS && !isTestnet ? loadingLabel : defaultLabel;
		}
		return defaultLabel;
	};

	return {
		isWaaS,
		isTestnet,
		feeOptionsVisible,
		shouldHideActionButton,
		waasFeeOptionsShown,
		isProcessingWithWaaS,
		getActionLabel,
	};
};
