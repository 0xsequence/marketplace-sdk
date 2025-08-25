import { useCallback, useEffect } from 'react';
import { useAccount, useSwitchChain } from 'wagmi';
import { useSwitchChainErrorModal } from '../../ui/modals/_internal/components/switchChainErrorModal';
import { useChainIdToSwitchTo } from '../../ui/modals/_internal/components/switchChainErrorModal/store';
import { useConnectorMetadata } from '../config/useConnectorMetadata';

export const useEnsureCorrectChain = () => {
	const { chainId: currentChainId } = useAccount();
	const { switchChain, switchChainAsync } = useSwitchChain();
	const { show: showSwitchChainErrorModal, close: closeSwitchChainErrorModal } =
		useSwitchChainErrorModal();
	const chainIdToSwitchTo = useChainIdToSwitchTo();
	const { isWaaS } = useConnectorMetadata();

	// Close the switch chain error modal when user successfully switches to the target chain
	useEffect(() => {
		if (
			currentChainId &&
			chainIdToSwitchTo &&
			currentChainId === chainIdToSwitchTo
		) {
			closeSwitchChainErrorModal();
		}
	}, [currentChainId, chainIdToSwitchTo, closeSwitchChainErrorModal]);

	const ensureCorrectChainAsync = useCallback(
		async (targetChainId: number) => {
			if (currentChainId === targetChainId) {
				return Promise.resolve();
			}
			return switchChainAsync({ chainId: targetChainId }).catch(() => {
				showSwitchChainErrorModal({
					chainIdToSwitchTo: targetChainId,
				});
			});
		},
		[currentChainId, isWaaS, switchChainAsync, showSwitchChainErrorModal],
	);

	const ensureCorrectChain = useCallback(
		(
			targetChainId: number,
			callbacks?: {
				onSuccess?: () => void;
			},
		) => {
			if (currentChainId === targetChainId) {
				callbacks?.onSuccess?.();
				return;
			}

			switchChain(
				{ chainId: targetChainId },
				{
					onSuccess: callbacks?.onSuccess,
					onError: () =>
						showSwitchChainErrorModal({
							chainIdToSwitchTo: targetChainId,
						}),
				},
			);
		},
		[currentChainId, isWaaS, switchChain, showSwitchChainErrorModal],
	);

	return {
		ensureCorrectChain,
		ensureCorrectChainAsync,
		currentChainId,
	};
};
