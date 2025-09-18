import type { FeeOption } from '../../../../../types/waas-types';
import { useConnectorMetadata } from '../../../../hooks/config/useConnectorMetadata';
import { Spinner } from '@0xsequence/design-system';

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

	const getActionLabel = (defaultLabel: string) => {
		const loadingLabelNode = (
			<div className="flex items-center gap-2">
				<Spinner size="sm" /> Loading fee options...
			</div>
		);

		if (isProcessing) {
			return isWaaS ? loadingLabelNode : defaultLabel;
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
