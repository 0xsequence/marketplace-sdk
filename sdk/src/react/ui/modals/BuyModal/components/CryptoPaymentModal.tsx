'use client';

import { Button, Spinner, Text } from '@0xsequence/design-system';
import { useState } from 'react';
import type { Hex } from 'viem';
import { getPresentableChainName } from '../../../../../utils/network';
import type { Step } from '../../../../_internal';
import { useEnsureCorrectChain } from '../../../../hooks/utils/useEnsureCorrectChain';
import { ErrorLogBox } from '../../../components/_internals/ErrorLogBox';
import SelectWaasFeeOptions from '../../_internal/components/selectWaasFeeOptions';
import { useCryptoPaymentModalContext } from '../internal/cryptoPaymentModalContext';
import { CollectibleMetadataSummary } from './CollectibleMetadataSummary';
import { CryptoPaymentModalSkeleton } from './CryptoPaymentModalSkeleton';

export interface CryptoPaymentModalProps {
	chainId: number;
	steps: Step[];
	onSuccess: (hash: Hex) => void;
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
		transaction: { isApproving, isExecuting, isExecutingBundledTransactions },
		error: { error, dismissError },
		steps: { approvalStep, feeStep },
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

	const executeWithChainSwitch = async (action: 'approval' | 'buy') => {
		dismissChainSwitchError();
		try {
			await ensureCorrectChainAsync(chainId);
		} catch (error) {
			if (error instanceof Error) {
				handleChainSwitchError(error);
			}
		}

		if (action === 'approval') {
			await executeApproval();
		} else {
			await executeBuy();
		}
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
				<CollectibleMetadataSummary
					checkoutMode={'crypto'}
					collectible={collectible}
					collection={collection}
					chainId={chainId}
					currency={currency}
					formattedPrice={formattedPrice}
					renderCurrencyPrice={renderCurrencyPrice}
					renderPriceUSD={renderPriceUSD}
					isMarket={isMarket}
				/>

				{!isLoadingBalance &&
					!isLoadingBuyModalData &&
					!hasSufficientBalance && (
						<Text className="text-sm text-warning">
							You do not have enough{' '}
							<Text className="font-bold">{currency?.name}</Text> to purchase
							this item
						</Text>
					)}

				{approvalStep && !isSequenceConnector && (
					<Button
						onClick={async () => {
							await executeWithChainSwitch('approval');
						}}
						disabled={!canApprove}
						variant="primary"
						size="lg"
						className="w-full"
					>
						{approvalButtonLabel}
					</Button>
				)}

				{!isLoadingBalance && !isLoadingBuyModalData && (
					<Button
						onClick={async () => {
							await executeWithChainSwitch('buy');
						}}
						disabled={!canBuy}
						variant="primary"
						size="lg"
						className="w-full"
					>
						{buyButtonLabel}
					</Button>
				)}

				{feeStep?.isSelecting && (
					<SelectWaasFeeOptions
						chainId={chainId}
						onCancel={feeStep.cancel}
						titleOnConfirm="Processing purchase..."
					/>
				)}

				{(chainSwitchError || error) && (
					<ErrorLogBox
						title={chainSwitchError?.title ?? error?.title ?? ''}
						message={chainSwitchError?.message ?? error?.message ?? ''}
						error={chainSwitchError?.details ?? error?.details}
						onDismiss={() => {
							dismissChainSwitchError();
							dismissError();
						}}
					/>
				)}
			</div>
		</div>
	);
};
