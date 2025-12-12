'use client';

import {
	Button,
	NetworkImage,
	Spinner,
	Text,
	Tooltip,
} from '@0xsequence/design-system';
import { useState } from 'react';
import type { Hex } from 'viem';
import { getPresentableChainName } from '../../../../../utils/network';
import type { Step } from '../../../../_internal';
import { useEnsureCorrectChain } from '../../../../hooks/utils/useEnsureCorrectChain';
import { ErrorLogBox } from '../../../components/_internals/ErrorLogBox';
import { Media } from '../../../components/media/Media';
import { useCryptoPaymentModalContext } from '../internal/cryptoPaymentModalContext';
import { CryptoPaymentModalSkeleton } from './CryptoPaymentModalSkeleton';

export interface CryptoPaymentModalProps {
	chainId: number;
	steps: Step[];
	onSuccess: (hash: Hex | string) => void;
}

export const CryptoPaymentModal = ({
	chainId,
	steps,
	onSuccess,
}: CryptoPaymentModalProps) => {
	const {
		data: { collectible, currency, collection },
		loading: { isLoadingBuyModalData, isLoadingBalance },
		chain: { isOnCorrectChain, currentChainId },
		balance: { hasSufficientBalance },
		transaction: {
			isApproving,
			isExecuting,
			isExecutingBundledTransactions,
			isAnyTransactionPending,
		},
		error: { error, dismissError },
		steps: { approvalStep },
		connector: { isSequenceConnector },
		flags: { isMarket },
		permissions: { canApprove, canBuy },
		price: { formattedPrice, renderCurrencyPrice, renderPriceUSD },
		actions: { executeApproval, executeBuy },
	} = useCryptoPaymentModalContext({ chainId, steps, onSuccess });

	const { ensureCorrectChainAsync } = useEnsureCorrectChain();
	const [chainSwitchError, setChainSwitchError] = useState<{
		title: string;
		message: string;
		details?: Error;
	} | null>(null);

	const handleChainSwitchError = (error: Error) => {
		const chainName = getPresentableChainName(chainId);
		setChainSwitchError({
			title: 'Chain switch failed',
			message: `Failed to switch to ${chainName}. Please try changing the network in your wallet manually.`,
			details: error,
		});
	};

	const dismissChainSwitchError = () => {
		setChainSwitchError(null);
	};

	const approvalButtonLabel = isApproving ? (
		<div className="flex items-center gap-2">
			<Spinner size="sm" /> Approving Token...
		</div>
	) : (
		'Approve Token'
	);
	const buyButtonLabel =
		isExecuting || isExecutingBundledTransactions ? (
			<div className="flex items-center gap-2">
				<Spinner size="sm" /> Confirming Purchase...
			</div>
		) : (
			'Buy now'
		);

	if (isLoadingBuyModalData || isLoadingBalance) {
		return (
			<CryptoPaymentModalSkeleton
				networkMismatch={!isOnCorrectChain && currentChainId !== undefined}
			/>
		);
	}

	return (
		<div className="flex w-full flex-col">
			<div className="flex flex-col gap-4 p-4">
				<div className="flex items-start gap-4">
					<Media
						assets={[collectible?.image]}
						name={collectible?.name}
						containerClassName="h-[84px] w-[84px] rounded-lg object-cover"
					/>
					<div className="flex flex-col">
						<div className="flex items-center gap-2">
							<Text className="font-bold text-sm text-text-80">
								{collectible?.name}
							</Text>
							<Text className="font-bold text-text-50 text-xs">
								#{collectible?.tokenId}
							</Text>
						</div>
						<Text className="font-bold text-text-50 text-xs">
							{' '}
							{collection?.name}
						</Text>

						<div className="mt-2 flex flex-col">
							<Tooltip
								message={`${formattedPrice} ${currency?.symbol}`}
								side="right"
							>
								<div className="flex items-center gap-1">
									{currency?.imageUrl ? (
										<img
											src={currency.imageUrl}
											alt={currency.symbol}
											className="h-5 w-5 rounded-full"
										/>
									) : (
										<NetworkImage chainId={chainId} size="sm" />
									)}

									<Text className="font-bold text-md">
										{renderCurrencyPrice()}
									</Text>
								</div>
							</Tooltip>

							{isMarket && renderPriceUSD() && (
								<Text className="font-bold text-text-50 text-xs">
									{renderPriceUSD()}
								</Text>
							)}
						</div>
					</div>
				</div>

				{!isLoadingBalance &&
					!isLoadingBuyModalData &&
					!hasSufficientBalance &&
					isOnCorrectChain && (
						<Text className="text-sm text-warning">
							You do not have enough{' '}
							<Text className="font-bold">{currency?.name}</Text> to purchase
							this item
						</Text>
					)}

				{approvalStep && !isSequenceConnector && (
					<Button
						onClick={async () => {
							dismissChainSwitchError();
							try {
								await ensureCorrectChainAsync(chainId);
								try {
									await executeApproval();
								} catch (error) {
									console.error('Approval failed:', error);
								}
							} catch (error) {
								handleChainSwitchError(error as Error);
							}
						}}
						disabled={!canApprove || isAnyTransactionPending}
						variant="primary"
						size="lg"
						className="w-full"
					>
						{approvalButtonLabel}
					</Button>
				)}

				{canBuy && (
					<Button
						onClick={async () => {
							dismissError();
							dismissChainSwitchError();
							try {
								await ensureCorrectChainAsync(chainId);
								try {
									await executeBuy();
								} catch (error) {
									console.error('Buy failed:', error);
								}
							} catch (error) {
								handleChainSwitchError(error as Error);
							}
						}}
						disabled={!canBuy || isAnyTransactionPending}
						variant="primary"
						size="lg"
						className="w-full"
					>
						{buyButtonLabel}
					</Button>
				)}

				{chainSwitchError && (
					<ErrorLogBox
						title={chainSwitchError.title}
						message={chainSwitchError.message}
						error={chainSwitchError.details}
						onDismiss={dismissChainSwitchError}
					/>
				)}

				{error && (
					<ErrorLogBox
						title={error.title}
						message={error.message}
						error={error.details}
						onDismiss={dismissError}
					/>
				)}
			</div>
		</div>
	);
};
