import { useCallback } from 'react';
import { useAccount, useSwitchChain } from 'wagmi';
import { ChainSwitchUserRejectedError } from '../../../utils/_internal/error/transaction';
import { useSwitchChainModal } from '../../ui/modals/_internal/components/switchChainModal';
import { useConnectorMetadata } from '../config/useConnectorMetadata';

export const useEnsureCorrectChain = () => {
	const { chainId: currentChainId } = useAccount();
	const { switchChain, switchChainAsync } = useSwitchChain();
	const { show: showSwitchChainModal } = useSwitchChainModal();
	const { isWaaS } = useConnectorMetadata();

	const ensureCorrectChainAsync = useCallback(
		async (targetChainId: number) => {
			if (currentChainId === targetChainId) {
				return Promise.resolve();
			}
			if (isWaaS) {
				return switchChainAsync({ chainId: targetChainId });
			}

			return new Promise((resolve, reject) => {
				showSwitchChainModal({
					chainIdToSwitchTo: targetChainId,
					onSuccess: () => resolve(targetChainId),
					onError: (error) => reject(error),
					onClose: () => reject(new ChainSwitchUserRejectedError()),
				});
			});
		},
		[currentChainId, isWaaS, switchChainAsync, showSwitchChainModal],
	);

	const ensureCorrectChain = useCallback(
		(
			targetChainId: number,
			callbacks?: {
				onSuccess?: () => void;
				onError?: (error: Error) => void;
				onClose?: () => void;
			},
		) => {
			if (currentChainId === targetChainId) {
				callbacks?.onSuccess?.();
				return;
			}

			if (isWaaS) {
				switchChain(
					{ chainId: targetChainId },
					{
						onSuccess: callbacks?.onSuccess,
						onError: callbacks?.onError,
					},
				);
				return;
			}

			showSwitchChainModal({
				chainIdToSwitchTo: targetChainId,
				onSuccess: callbacks?.onSuccess,
				onError: callbacks?.onError,
				onClose: callbacks?.onClose,
			});
		},
		[currentChainId, isWaaS, switchChain, showSwitchChainModal],
	);

	return {
		ensureCorrectChain,
		ensureCorrectChainAsync,
		currentChainId,
	};
};
