import type { FeeOption } from '../../../../../types/waas-types';
import { useConnectorMetadata } from '../../../../hooks/config/useConnectorMetadata';
import type { WaasFeeOptionSelectionType } from '../types';

interface UseSelectWaasFeeOptionsProps {
	isProcessing: boolean;
	feeOptionsVisible: boolean;
	selectedFeeOption: FeeOption;
	waasFeeOptionSelectionType: WaasFeeOptionSelectionType;
}

export const useSelectWaasFeeOptions = ({
	isProcessing,
	feeOptionsVisible,
	selectedFeeOption,
	waasFeeOptionSelectionType,
}: UseSelectWaasFeeOptionsProps) => {
	const { isWaaS } = useConnectorMetadata();
	const isProcessingWithWaaS = isProcessing && isWaaS;

	const shouldHideActionButton =
		waasFeeOptionSelectionType === 'automatic'
			? false
			: isProcessingWithWaaS &&
				feeOptionsVisible === true &&
				!!selectedFeeOption;

	const waasFeeOptionsShown =
		waasFeeOptionSelectionType === 'automatic'
			? false
			: isWaaS && isProcessing && feeOptionsVisible;

	const getActionLabel = (
		defaultLabel: string,
		loadingLabel = 'Loading fee options',
	) => {
		if (waasFeeOptionSelectionType === 'automatic') {
			return defaultLabel;
		}

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
