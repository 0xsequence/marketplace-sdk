import { useState, useEffect } from 'react';
import { useWallet } from '../../../_internal/transaction-machine/useWallet';
import { useSwitchChainModal } from '../../../ui/modals/_internal/components/switchChainModal';

interface UseChainManagementArgs {
	chainId: string;
}

export const useChainManagement = ({ chainId }: UseChainManagementArgs) => {
	const [isLoading, setIsLoading] = useState(false);
	const { wallet, isLoading: walletClientIsLoading } = useWallet();
	const { show: showSwitchChainModal } = useSwitchChainModal();

	useEffect(() => {
		if (walletClientIsLoading) {
			setIsLoading(true);
			return;
		}

		const checkChain = async () => {
			const currentChainId = await wallet?.getChainId();
			if (!currentChainId) {
				setIsLoading(false);
				return;
			}

			const chainMismatch = currentChainId !== Number(chainId);
			if (chainMismatch) {
				showSwitchChainModal({
					chainIdToSwitchTo: Number(chainId),
					onSuccess: () => setIsLoading(false),
					onError: () => setIsLoading(false),
				});
			} else {
				setIsLoading(false);
			}
		};

		checkChain();
	}, [walletClientIsLoading, wallet, chainId, showSwitchChainModal]);

	return {
		isLoading,
		wallet,
	};
};
