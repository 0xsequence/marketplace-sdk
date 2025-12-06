import type { FeeOption } from '../../../../../types/waas-types';
import { useConnectorMetadata } from '../../../../hooks/config/useConnectorMetadata';

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
	const { isWaaS } = useConnectorMetadata();
	const isProcessingWithWaaS = isProcessing && isWaaS;

	const shouldHideActionButton =
		isProcessingWithWaaS && feeOptionsVisible === true && !!selectedFeeOption;

	const waasFeeOptionsShown = isWaaS && isProcessing && feeOptionsVisible;

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
