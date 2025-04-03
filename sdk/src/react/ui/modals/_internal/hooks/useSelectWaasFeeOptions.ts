import { getNetwork } from '@0xsequence/connect';
import { NetworkType } from '@0xsequence/network';
import { useWallet } from '../../../../_internal/wallet/useWallet';
import { selectWaasFeeOptions$ } from '../components/selectWaasFeeOptions/store';

interface UseSelectWaasFeeOptionsProps {
	chainId: string | number;
	isProcessing: boolean;
}

export const useSelectWaasFeeOptions = ({
	chainId,
	isProcessing,
}: UseSelectWaasFeeOptionsProps) => {
	const { wallet } = useWallet();
	const feeOptionsVisible = selectWaasFeeOptions$.isVisible.get();
	const network = chainId ? getNetwork(Number(chainId)) : undefined;
	const isTestnet = network?.type === NetworkType.TESTNET;
	const isWaaS = wallet?.isWaaS;
	const isProcessingWithWaaS = isProcessing && isWaaS;
	const selectedFeeOption = selectWaasFeeOptions$.selectedFeeOption.get();

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

	const showWaasFeeOptions = () => {
		selectWaasFeeOptions$.isVisible.set(true);
	};

	const hideWaasFeeOptions = () => {
		selectWaasFeeOptions$.hide();
	};

	return {
		isWaaS,
		isTestnet,
		feeOptionsVisible,
		shouldHideActionButton,
		waasFeeOptionsShown,
		isProcessingWithWaaS,
		getActionLabel,
		showWaasFeeOptions,
		hideWaasFeeOptions,
	};
};
