'use client';

import { ContractVerificationStatus } from '@0xsequence/indexer';
import type { FeeOption } from '@0xsequence/waas';
import { useEffect } from 'react';
import { formatUnits } from 'viem';
import type { Connection, Connector } from 'wagmi';
import { useConnections } from 'wagmi';
import type { SdkConfig } from '../../../types';
import { getIndexerClient } from '../../_internal';
import {
	Deferred,
	type FeeOptionConfirmationResult,
	type FeeOptionExtended,
	usePendingConfirmation,
	type WaasFeeOptionConfirmation,
	waasFeeOptionsStore,
} from './waasFeeOptionsStore';

// Re-export types for backward compatibility
export type { FeeOptionExtended, WaasFeeOptionConfirmation };

/**
 * Return type for the useWaasFeeOptions hook
 */
export type UseWaasFeeOptionsReturnType = {
	pendingFeeOptionConfirmation: WaasFeeOptionConfirmation | undefined;
	confirmPendingFeeOption: (id: string, feeTokenAddress: string | null) => void;
	rejectPendingFeeOption: (id: string) => void;
};

/**
 * Options for the useWaasFeeOptions hook
 *
 * @property {boolean} skipFeeBalanceCheck - Whether to skip checking token balances (default: false)
 */
export interface WaasFeeOptionsConfig {
	/** Whether to skip checking token balances (default: false) */
	skipFeeBalanceCheck?: boolean;
}

/**
 * Hook for handling WaaS (Wallet as a Service) fee options for unsponsored transactions
 *
 * This hook provides functionality to:
 * - Get available fee options for a transaction in Native Token and ERC20's
 * - Provide user wallet balances for each fee option
 * - Confirm or reject fee selections
 *
 * @param options - Configuration options for the hook {@link WaasFeeOptionsConfig}
 * @returns Array containing the confirmation state and control functions {@link UseWaasFeeOptionsReturnType}
 *
 * @example
 * ```tsx
 *   // Use the hook with default balance checking, this will fetch the user's wallet balances for each fee option and provide them in the UseWaasFeeOptionsReturn
 *   const [
 *     pendingFeeOptionConfirmation,
 *     confirmPendingFeeOption,
 *     rejectPendingFeeOption
 *   ] = useWaasFeeOptions();
 *
 *   // Or skip balance checking if needed
 *   // const [pendingFeeOptionConfirmation, confirmPendingFeeOption, rejectPendingFeeOption] =
 *   //   useWaasFeeOptions({ skipFeeBalanceCheck: true });
 *
 *   const [selectedFeeOptionTokenName, setSelectedFeeOptionTokenName] = useState<string>();
 *   const [feeOptionAlert, setFeeOptionAlert] = useState<AlertProps>();
 *
 *   // Initialize with first option when fee options become available
 *   useEffect(() => {
 *     if (pendingFeeOptionConfirmation) {
 *       console.log('Pending fee options: ', pendingFeeOptionConfirmation.options)
 *     }
 *   }, [pendingFeeOptionConfirmation]);
 *
 * ```
 */
export function useWaasFeeOptions(
	chainId: number,
	config: SdkConfig,
	options?: WaasFeeOptionsConfig,
): UseWaasFeeOptionsReturnType {
	const { skipFeeBalanceCheck = false } = options || {};
	const connections = useConnections();
	const waasConnector: Connector | undefined = connections.find(
		(c: Connection) => c.connector.id.includes('waas'),
	)?.connector;
	const pendingFeeOptionConfirmation = usePendingConfirmation();

	const isValidChainId = chainId > 0;
	const indexerClient = isValidChainId
		? getIndexerClient(chainId, config)
		: null;
	/**
	 * Confirms the selected fee option
	 * @param id - The fee confirmation ID
	 * @param feeTokenAddress - The address of the token to use for fee payment (null for native token)
	 */
	function confirmPendingFeeOption(id: string, feeTokenAddress: string | null) {
		waasFeeOptionsStore.send({
			type: 'confirmFeeOption',
			id,
			feeTokenAddress,
		});
	}

	/**
	 * Rejects the current fee option confirmation
	 * @param id - The fee confirmation ID to reject
	 */
	function rejectPendingFeeOption(id: string) {
		waasFeeOptionsStore.send({
			type: 'rejectFeeOption',
			id,
		});
	}

	useEffect(() => {
		if (!waasConnector || !indexerClient) {
			return;
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any -- sequenceWaasProvider is not typed on Connector
		const waasProvider = (waasConnector as any).sequenceWaasProvider;
		if (!waasProvider) {
			return;
		}

		const originalHandler = waasProvider.feeConfirmationHandler;

		waasProvider.feeConfirmationHandler = {
			async confirmFeeOption(
				id: string,
				options: FeeOption[],
				chainId: number,
			): Promise<FeeOptionConfirmationResult> {
				const pending = new Deferred<FeeOptionConfirmationResult>();

				// Set the deferred in the store
				waasFeeOptionsStore.send({
					type: 'setDeferred',
					deferred: pending,
				});

				// Clear any previous stale state immediately
				waasFeeOptionsStore.send({
					type: 'setPendingConfirmation',
					confirmation: undefined,
				});

				const accountAddress = connections[0]?.accounts[0];
				if (!accountAddress) {
					throw new Error('No account address available');
				}

				if (!skipFeeBalanceCheck) {
					const optionsWithBalances = await Promise.all(
						options.map(async (option) => {
							if (option.token.contractAddress) {
								const tokenBalances =
									await indexerClient.getTokenBalancesByContract({
										filter: {
											accountAddresses: [accountAddress],
											contractStatus: ContractVerificationStatus.ALL,
											contractAddresses: [option.token.contractAddress],
										},
										omitMetadata: true,
									});
								const tokenBalance = tokenBalances.balances[0]?.balance;
								return {
									...option,
									balanceFormatted: option.token.decimals
										? formatUnits(
												BigInt(tokenBalances.balances[0]?.balance ?? '0'),
												option.token.decimals,
											)
										: (tokenBalances.balances[0]?.balance ?? '0'),
									balance: tokenBalances.balances[0]?.balance ?? '0',
									hasEnoughBalanceForFee: tokenBalance
										? BigInt(option.value) <= BigInt(tokenBalance)
										: false,
								};
							}
							const nativeBalance = await indexerClient.getNativeTokenBalance({
								accountAddress,
							});
							return {
								...option,
								balanceFormatted: formatUnits(
									BigInt(nativeBalance.balance.balance),
									18,
								),
								balance: nativeBalance.balance.balance,
								hasEnoughBalanceForFee:
									BigInt(option.value) <= BigInt(nativeBalance.balance.balance),
							};
						}),
					);

					const confirmation: WaasFeeOptionConfirmation = {
						id,
						options: optionsWithBalances,
						chainId,
					};
					waasFeeOptionsStore.send({
						type: 'setPendingConfirmation',
						confirmation,
					});
				} else {
					const confirmation: WaasFeeOptionConfirmation = {
						id,
						options,
						chainId,
					};
					waasFeeOptionsStore.send({
						type: 'setPendingConfirmation',
						confirmation,
					});
				}
				return pending.promise;
			},
		};

		return () => {
			waasProvider.feeConfirmationHandler = originalHandler;
		};
	}, [waasConnector, indexerClient]);

	return {
		pendingFeeOptionConfirmation,
		confirmPendingFeeOption,
		rejectPendingFeeOption,
	};
}
