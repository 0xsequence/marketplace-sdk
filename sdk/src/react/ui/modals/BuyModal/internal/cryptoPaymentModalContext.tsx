import { ChevronLeftIcon, Text } from '@0xsequence/design-system';
import type { ReactNode } from 'react';
import { useState } from 'react';
import type { Address, Hash, Hex } from 'viem';
import { useSendTransaction } from 'wagmi';
import { formatPrice } from '../../../../../utils/price';
import { type Step, StepType } from '../../../../_internal';
import { useConnectorMetadata } from '../../../../hooks';
import { useConfig } from '../../../../hooks/config/useConfig';
import { useEnsureCorrectChain } from '../../../../hooks/utils/useEnsureCorrectChain';
import { waitForTransactionReceipt } from '../../../../utils/waitForTransactionReceipt';
import { useBuyModalData } from '../hooks/useBuyModalData';
import { useExecuteBundledTransactions } from '../hooks/useExecuteBundledTransactions';
import { useHasSufficientBalance } from '../hooks/useHasSufficientBalance';

type CryptoPaymentModalReturn = {
	data: {
		collectible: Awaited<ReturnType<typeof useBuyModalData>>['collectible'];
		currency: Awaited<ReturnType<typeof useBuyModalData>>['currency'];
		order: Awaited<ReturnType<typeof useBuyModalData>>['order'];
		collection: Awaited<ReturnType<typeof useBuyModalData>>['collection'];
	};
	loading: {
		isLoadingBuyModalData: boolean;
		isLoadingBalance: boolean;
	};
	chain: {
		isOnCorrectChain: boolean;
		currentChainId: number | undefined;
	};
	balance: {
		hasSufficientBalance: boolean;
	};
	transaction: {
		isApproving: boolean;
		isExecuting: boolean;
		isExecutingBundledTransactions: boolean;
		isAnyTransactionPending: boolean;
	};
	error: {
		error: {
			title: string;
			message: string;
			details?: Error;
		} | null;
		dismissError: () => void;
	};
	steps: {
		approvalStep: Step | undefined;
	};
	connector: {
		isSequenceConnector: boolean | undefined;
	};
	flags: {
		isMarket: boolean;
	};
	permissions: {
		canApprove: boolean;
		canBuy: boolean;
	};
	price: {
		formattedPrice: string;
		renderCurrencyPrice: () => ReactNode;
		renderPriceUSD: () => ReactNode;
	};
	actions: {
		executeApproval: () => Promise<void>;
		executeBuy: () => Promise<void>;
	};
};

export function useCryptoPaymentModalContext({
	chainId,
	steps,
	onSuccess,
}: {
	chainId: number;
	steps: Step[];
	onSuccess: (hash: Hex | string) => void;
}): CryptoPaymentModalReturn {
	const [isExecuting, setIsExecuting] = useState(false);
	const [isApproving, setIsApproving] = useState(false);
	const [error, setError] = useState<{
		title: string;
		message: string;
		details?: Error;
	} | null>(null);
	const { isSequence: isSequenceConnector } = useConnectorMetadata();

	const buyStep = steps.find((step) => step.id === StepType.buy);
	if (!buyStep) throw new Error('Buy step not found');

	const {
		collectible,
		currency,
		order,
		isMarket,
		marketOrderPrice,
		primarySalePrice,
		isShop,
		collection,
		isLoading: isLoadingBuyModalData,
	} = useBuyModalData();
	const sdkConfig = useConfig();

	const { ensureCorrectChainAsync, currentChainId } = useEnsureCorrectChain();
	const isOnCorrectChain = currentChainId === chainId;
	const priceAmount = isMarket
		? marketOrderPrice?.amount
		: primarySalePrice?.amount;
	const priceCurrencyAddress = isMarket
		? marketOrderPrice?.currencyAddress
		: (primarySalePrice?.currencyAddress as Address);
	const isAnyTransactionPending = isApproving || isExecuting;

	const { data, isLoading: isLoadingBalance } = useHasSufficientBalance({
		chainId,
		value: BigInt(priceAmount || 0),
		tokenAddress: priceCurrencyAddress as Address,
	});

	const hasSufficientBalance = data?.hasSufficientBalance ?? false;
	const { sendTransactionAsync } = useSendTransaction();

	const [approvalStep, setApprovalStep] = useState<Step | undefined>(
		steps.find((step) => step.id === StepType.tokenApproval),
	);

	const {
		executeBundledTransactions,
		isExecuting: isExecutingBundledTransactions,
	} = useExecuteBundledTransactions({
		chainId,
		approvalStep,
		priceAmount: BigInt(priceAmount || 0),
	});

	const executeTransaction = async (step: Step) => {
		const data = step.data as Hex;
		const to = step.to as Address;
		const value = BigInt(step.value);

		if (!data || !to) {
			const errorDetails = new Error(
				`Invalid step: 'data' and 'to' are required:
				data: ${data}
				to: ${to}

				${JSON.stringify(step)}`,
			);

			setError({
				title: 'Invalid step',
				message: '`data` and `to` are required',
				details: errorDetails,
			});
			throw errorDetails;
		}

		await ensureCorrectChainAsync(chainId);

		const hash = await sendTransactionAsync({
			to,
			data,
			value,
		});

		await waitForTransactionReceipt({
			txHash: hash,
			chainId,
			sdkConfig,
		});

		return hash;
	};

	const executeApproval = async () => {
		if (!approvalStep) throw new Error('Approval step not found');

		setError(null);
		setIsApproving(true);
		try {
			await executeTransaction(approvalStep);
			setApprovalStep(undefined);
		} catch (error) {
			const errorObj =
				error instanceof Error ? error : new Error(String(error));
			setError({
				title: 'Approval failed',
				message:
					errorObj.message || 'Failed to approve token. Please try again.',
				details: errorObj,
			});
			console.error('Approval transaction failed:', error);
		} finally {
			setIsApproving(false);
		}
	};

	const handleBalanceInsufficientForWaasFeeOption = (error: Error) => {
		setError({
			title: 'Insufficient balance for fee option',
			message: 'You do not have enough balance to purchase this item.',
			details: error,
		});

		console.error('Balance insufficient for fee option:', error);
	};

	const handleTransactionFailed = (error: Error) => {
		setError({
			title: 'Transaction failed',
			message: error.message,
			details: error,
		});

		console.error('Transaction failed:', error);
	};

	const executeBuy = async () => {
		setError(null);
		setIsExecuting(true);
		try {
			const hash =
				isShop && approvalStep
					? await executeBundledTransactions({
							step: buyStep,
							onBalanceInsufficientForFeeOption:
								handleBalanceInsufficientForWaasFeeOption,
							onTransactionFailed: handleTransactionFailed,
						})
					: await executeTransaction(buyStep);

			onSuccess(hash as Hash);
		} catch (error) {
			const errorObj =
				error instanceof Error ? error : new Error(String(error));
			setError({
				title: 'Purchase failed',
				message:
					errorObj.message || 'Failed to complete purchase. Please try again.',
				details: errorObj,
			});
			console.error('Buy transaction failed:', error);
		} finally {
			setIsExecuting(false);
		}
	};

	const dismissError = () => {
		setError(null);
	};

	const formattedPrice = formatPrice(
		BigInt(priceAmount || 0),
		currency?.decimals || 0,
	);
	const isFree = formattedPrice === '0';

	const renderPriceUSD = (): ReactNode => {
		const priceUSD = order?.priceUSDFormatted || order?.priceUSD;
		if (!priceUSD) return '';

		const numericPrice =
			typeof priceUSD === 'string' ? Number.parseFloat(priceUSD) : priceUSD;

		if (numericPrice < 0.0001) {
			return (
				<div className="flex items-center">
					<ChevronLeftIcon className="w-3" /> <Text>$0.0001</Text>
				</div>
			);
		}

		return `~$${priceUSD}`;
	};

	const renderCurrencyPrice = (): ReactNode => {
		if (isFree) return 'Free';

		const numericPrice = Number.parseFloat(formattedPrice);
		if (numericPrice < 0.0001) {
			return (
				<div className="flex items-center">
					<ChevronLeftIcon className="w-4" />
					<Text>0.0001 {currency?.symbol}</Text>
				</div>
			);
		}

		return `${formattedPrice} ${currency?.symbol}`;
	};

	const canApprove =
		hasSufficientBalance &&
		!isLoadingBalance &&
		!isLoadingBuyModalData &&
		isOnCorrectChain;
	const canBuy =
		hasSufficientBalance &&
		!isLoadingBalance &&
		!isLoadingBuyModalData &&
		isOnCorrectChain &&
		(isSequenceConnector ? true : !approvalStep);

	const result: CryptoPaymentModalReturn = {
		data: {
			collectible,
			currency,
			order,
			collection,
		},
		loading: {
			isLoadingBuyModalData,
			isLoadingBalance,
		},
		chain: {
			isOnCorrectChain,
			currentChainId,
		},
		balance: {
			hasSufficientBalance,
		},
		transaction: {
			isApproving,
			isExecuting,
			isExecutingBundledTransactions,
			isAnyTransactionPending,
		},
		error: {
			error,
			dismissError,
		},
		steps: {
			approvalStep,
		},
		connector: {
			isSequenceConnector,
		},
		flags: {
			isMarket,
		},
		permissions: {
			canApprove,
			canBuy,
		},
		price: {
			formattedPrice,
			renderCurrencyPrice,
			renderPriceUSD,
		},
		actions: {
			executeApproval,
			executeBuy,
		},
	};

	return result;
}

export type CryptoPaymentModalContext = CryptoPaymentModalReturn;
