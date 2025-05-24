import type { FeeOption } from '../../../../../types/waas-types';
import { useWallet } from '../../../../_internal/wallet/useWallet';

interface UseSelectWaasFeeOptionsProps {
	isProcessing: boolean;
	feeOptionsVisible: boolean;
	selectedFeeOption: FeeOption;
}

export const useSelectWaasFeeOptions = ({
	isProcessing,
	feeOptionsVisible,
	selectedFeeOption,
}: UseSelectWaasFeeOptionsProps) => {
	const { wallet } = useWallet();
	const isWaaS = wallet?.isWaaS;
	const isProcessingWithWaaS = isProcessing && isWaaS;

	const shouldHideActionButton =
		isProcessingWithWaaS && feeOptionsVisible === true && !!selectedFeeOption;

	const waasFeeOptionsShown =
		wallet?.isWaaS && isProcessing && feeOptionsVisible;

	const getActionLabel = (
		defaultLabel: string,
		loadingLabel = 'Loading fee options',
	) => {
		if (isProcessing) {
			return isWaaS ? loadingLabel : defaultLabel;
		}
		return defaultLabel;
	};

	return {
		isWaaS,
		feeOptionsVisible,
		shouldHideActionButton,
		waasFeeOptionsShown,
		isProcessingWithWaaS,
		getActionLabel,
	};
};
