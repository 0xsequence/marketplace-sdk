import { useSwitchChain } from 'wagmi';
import { ChainSwitchUserRejectedError } from '../../utils/_internal/error/transaction';
import { useSwitchChainModal } from '../ui/modals/_internal/components/switchChainModal';
import { useConnectorMetadata } from './useConnectorMetadata';

export const useSwitchChainWithModal = () => {
	const { show: showSwitchChainModal } = useSwitchChainModal();
	const { isWaaS } = useConnectorMetadata();
	const { switchChainAsync } = useSwitchChain();

	return {
		switchChainWithModal: async (
			currentChainId: number,
			targetChainId: number,
		) => {
			const chainIdMismatch = currentChainId !== Number(targetChainId);

			return new Promise((resolve, reject) => {
				if (chainIdMismatch) {
					if (isWaaS) {
						switchChainAsync({ chainId: targetChainId })
							.then(resolve)
							.catch(reject);
					} else {
						showSwitchChainModal({
							chainIdToSwitchTo: targetChainId,
							onSuccess: () => resolve({ chainId: targetChainId }),
							onError: (error) => reject(error),
							onClose: () => reject(new ChainSwitchUserRejectedError()),
						});
					}
				} else {
					resolve({ chainId: targetChainId });
				}
			});
		},
	};
};
