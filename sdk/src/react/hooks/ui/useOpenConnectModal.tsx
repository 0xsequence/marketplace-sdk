import { useConfig } from '../config/useConfig';

/**
 * Provides access to the wallet connection modal opener function
 *
 * This hook extracts the `openConnectModal` function from the SDK context,
 * providing a convenient way to trigger the wallet connection flow from any
 * component within the MarketplaceSdkProvider.
 *
 * @returns Modal opener interface
 * @returns returns.openConnectModal - Function to open the wallet connection modal
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { openConnectModal } = useOpenConnectModal();
 *
 * return (
 *   <button onClick={openConnectModal}>
 *     Connect Wallet
 *   </button>
 * );
 * ```
 *
 * @example
 * Conditional rendering with wallet state:
 * ```typescript
 * const { openConnectModal } = useOpenConnectModal();
 * const { address, isConnected } = useAccount();
 *
 * if (!isConnected) {
 *   return (
 *     <div>
 *       <p>Please connect your wallet to continue</p>
 *       <button onClick={openConnectModal}>
 *         Connect Wallet
 *       </button>
 *     </div>
 *   );
 * }
 *
 * return <p>Connected as {address}</p>;
 * ```
 *
 * @example
 * In response to restricted actions:
 * ```typescript
 * const { openConnectModal } = useOpenConnectModal();
 * const { address } = useAccount();
 *
 * const handleBuyClick = () => {
 *   if (!address) {
 *     openConnectModal();
 *     return;
 *   }
 *
 *   // Proceed with purchase
 *   startPurchaseFlow();
 * };
 * ```
 *
 * @remarks
 * - The modal function must be provided to MarketplaceSdkProvider
 * - This hook provides a cleaner API than accessing config directly
 * - The modal implementation is controlled by the parent application
 * - Commonly used in "Connect to perform action" flows
 *
 * @see {@link useConfig} - The underlying hook that provides the function
 * @see {@link MarketplaceSdkProvider} - Where openConnectModal is configured
 */
export const useOpenConnectModal = () => {
	const context = useConfig();

	return {
		openConnectModal: context.openConnectModal,
	};
};
