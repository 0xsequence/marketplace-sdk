import { useAccount } from 'wagmi';
import { WalletKind } from '../../_internal/api';

/**
 * Provides metadata about the currently connected wallet connector
 *
 * This hook analyzes the active wallet connection to determine the wallet type
 * and specific characteristics. It's particularly useful for implementing
 * wallet-specific features or UI adjustments based on whether the user is
 * connected via Sequence wallet, WaaS (Wallet as a Service), or other wallets.
 *
 * @returns Wallet connector metadata
 * @returns returns.isWaaS - True if connected via Wallet as a Service
 * @returns returns.isSequence - True if connected via any Sequence wallet variant
 * @returns returns.walletKind - Enum indicating the specific wallet type (sequence or unknown)
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { isWaaS, isSequence, walletKind } = useConnectorMetadata();
 *
 * if (isWaaS) {
 *   console.log('User is connected via WaaS');
 * }
 * ```
 *
 * @example
 * Conditional rendering based on wallet type:
 * ```typescript
 * const { isSequence, walletKind } = useConnectorMetadata();
 *
 * return (
 *   <div>
 *     {isSequence ? (
 *       <SequenceWalletFeatures />
 *     ) : (
 *       <GenericWalletInterface />
 *     )}
 *     <p>Wallet type: {walletKind}</p>
 *   </div>
 * );
 * ```
 *
 * @remarks
 * This hook depends on wagmi's useAccount hook and will return default values
 * when no wallet is connected. The detection is based on the connector ID string
 * patterns, where 'waas' suffix indicates WaaS and 'sequence' substring indicates
 * any Sequence wallet variant.
 *
 * @see {@link useAccount} - The underlying wagmi hook for account information
 * @see {@link WalletKind} - Enum defining possible wallet types
 */
export const useConnectorMetadata = () => {
	const { connector } = useAccount();

	const isWaaS = connector?.id.endsWith('waas') ?? false;
	const isSequence = connector?.id.includes('sequence');
	const walletKind = isSequence ? WalletKind.sequence : WalletKind.unknown;

	return {
		isWaaS,
		isSequence,
		walletKind,
	};
};
