import { useSwitchChain } from 'wagmi';
import { ChainSwitchUserRejectedError } from '../../../utils/_internal/error/transaction';
import { useSwitchChainModal } from '../../ui/modals/_internal/components/switchChainModal';
import { useConnectorMetadata } from '../config/useConnectorMetadata';

/**
 * Provides chain switching with modal UI for non-WaaS wallets
 *
 * This hook offers a lower-level chain switching function that explicitly
 * requires both current and target chain IDs. It shows a modal for standard
 * wallets while WaaS wallets switch automatically.
 *
 * @returns Chain switching interface
 * @returns returns.switchChainWithModal - Function to switch chains with modal
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { switchChainWithModal } = useSwitchChainWithModal();
 * const { chainId } = useAccount();
 *
 * const handleChainSwitch = async (targetChainId: number) => {
 *   try {
 *     await switchChainWithModal(chainId, targetChainId);
 *     console.log('Successfully switched to chain', targetChainId);
 *   } catch (error) {
 *     if (error instanceof ChainSwitchUserRejectedError) {
 *       console.log('User cancelled chain switch');
 *     } else {
 *       console.error('Chain switch failed:', error);
 *     }
 *   }
 * };
 * ```
 *
 * @example
 * In a chain selector component:
 * ```typescript
 * const { switchChainWithModal } = useSwitchChainWithModal();
 * const { chainId: currentChainId } = useAccount();
 *
 * const ChainSelector = () => {
 *   const supportedChains = [1, 137, 42161]; // Ethereum, Polygon, Arbitrum
 *
 *   return (
 *     <select
 *       value={currentChainId}
 *       onChange={async (e) => {
 *         const newChainId = Number(e.target.value);
 *         try {
 *           await switchChainWithModal(currentChainId, newChainId);
 *         } catch (error) {
 *           // Revert select on error
 *           e.target.value = String(currentChainId);
 *         }
 *       }}
 *     >
 *       {supportedChains.map(id => (
 *         <option key={id} value={id}>Chain {id}</option>
 *       ))}
 *     </select>
 *   );
 * };
 * ```
 *
 * @example
 * With loading state:
 * ```typescript
 * const { switchChainWithModal } = useSwitchChainWithModal();
 * const [isSwitching, setIsSwitching] = useState(false);
 *
 * const switchToPolygon = async () => {
 *   setIsSwitching(true);
 *   try {
 *     await switchChainWithModal(currentChainId, 137);
 *     toast.success('Switched to Polygon');
 *   } catch (error) {
 *     toast.error('Failed to switch chains');
 *   } finally {
 *     setIsSwitching(false);
 *   }
 * };
 * ```
 *
 * @remarks
 * - Returns immediately if already on target chain
 * - WaaS wallets switch without showing modal
 * - Standard wallets see explanatory modal
 * - Returns `{ chainId }` on success for consistency
 * - Lower-level than `useEnsureCorrectChain` - requires current chain ID
 *
 * @throws {ChainSwitchUserRejectedError} When user closes modal without switching
 * @throws {Error} When chain switch fails for other reasons
 *
 * @see {@link useEnsureCorrectChain} - Higher-level hook that auto-detects current chain
 * @see {@link useSwitchChainModal} - The modal component used
 * @see {@link useConnectorMetadata} - Detects WaaS wallet type
 */
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
