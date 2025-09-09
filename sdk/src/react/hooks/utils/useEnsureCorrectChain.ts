import { useCallback, useEffect } from 'react';
import { useAccount, useSwitchChain } from 'wagmi';
import { useSwitchChainErrorModal } from '../../ui/modals/_internal/components/switchChainErrorModal';
import { useChainIdToSwitchTo } from '../../ui/modals/_internal/components/switchChainErrorModal/store';
import { useConnectorMetadata } from '../config/useConnectorMetadata';

/**
 * Ensures the wallet is connected to the correct blockchain network
 *
 * This hook provides functions to check and switch chains with appropriate
 * UX for different wallet types. For WaaS wallets, it switches directly.
 * For other wallets, it shows a modal explaining the chain switch.
 *
 * @returns Chain management interface
 * @returns returns.ensureCorrectChain - Callback-based chain switching
 * @returns returns.ensureCorrectChainAsync - Promise-based chain switching
 * @returns returns.currentChainId - The currently connected chain ID
 *
 * @example
 * With callbacks:
 * ```typescript
 * const { ensureCorrectChain } = useEnsureCorrectChain();
 *
 * const handleAction = () => {
 *   ensureCorrectChain(137, {
 *     onSuccess: () => {
 *       console.log('Switched to Polygon');
 *       proceedWithAction();
 *     },
 *     onError: (error) => {
 *       console.error('Chain switch failed:', error);
 *     },
 *     onClose: () => {
 *       console.log('User closed modal without switching');
 *     }
 *   });
 * };
 * ```
 *
 * @example
 * With async/await:
 * ```typescript
 * const { ensureCorrectChainAsync, currentChainId } = useEnsureCorrectChain();
 *
 * const executeTrade = async () => {
 *   try {
 *     // Check if already on correct chain
 *     if (currentChainId !== requiredChainId) {
 *       await ensureCorrectChainAsync(requiredChainId);
 *     }
 *
 *     // Now safe to execute on the correct chain
 *     await performTrade();
 *   } catch (error) {
 *     if (error instanceof ChainSwitchUserRejectedError) {
 *       showToast('Please switch chains to continue');
 *     }
 *   }
 * };
 * ```
 *
 * @example
 * In transaction flows:
 * ```typescript
 * const { ensureCorrectChainAsync } = useEnsureCorrectChain();
 *
 * const { buyToken } = useBuyToken({
 *   onBeforeTransaction: async ({ chainId }) => {
 *     // Ensure correct chain before transaction
 *     await ensureCorrectChainAsync(chainId);
 *   }
 * });
 * ```
 *
 * @remarks
 * - No-op if already on the target chain
 * - WaaS wallets switch automatically without modal
 * - Non-WaaS wallets see an explanatory modal
 * - The async version throws ChainSwitchUserRejectedError on cancel
 * - Used internally by transaction hooks for seamless chain switching
 *
 * @throws {ChainSwitchUserRejectedError} When user rejects or closes modal (async only)
 *
 * @see {@link useSwitchChainModal} - The modal shown for non-WaaS wallets
 * @see {@link useConnectorMetadata} - Detects WaaS wallet type
 * @see {@link useSwitchChain} - Underlying wagmi hook
 */
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
