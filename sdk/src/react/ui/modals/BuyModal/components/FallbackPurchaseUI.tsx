'use client';

import {
	Button,
	ChevronLeftIcon,
	NetworkImage,
	Text,
	Tooltip,
	useToast,
} from '@0xsequence/design-system';
import { useState } from 'react';
import { type Address, type Hex } from 'viem';
import { useSendTransaction } from 'wagmi';
import { formatPrice, getPresentableChainName } from '../../../../../utils';
import { type Step, StepType } from '../../../../_internal';
import { useConfig } from '../../../../hooks/config/useConfig';
import { useEnsureCorrectChain } from '../../../../hooks/utils/useEnsureCorrectChain';
import { waitForTransactionReceipt } from '../../../../utils/waitForTransactionReceipt';
import { Media } from '../../../components/media/Media';
import { useBuyModalData } from '../hooks/useBuyModalData';
import { useHasSufficientBalance } from '../hooks/useHasSufficientBalance';
import { FallbackPurchaseUISkeleton } from './FallbackPurchaseUISkeleton';
import {
	selectWaasFeeOptionsStore,
	useSelectWaasFeeOptionsStore,
} from '../../_internal/components/selectWaasFeeOptions/store';
import { useSelectWaasFeeOptions } from '../../_internal/hooks/useSelectWaasFeeOptions';
import { FeeOption } from '../../../../../types/waas-types';
import SelectWaasFeeOptions from '../../_internal/components/selectWaasFeeOptions';
import { useConnectorMetadata } from '../../../../hooks';
import { useExecutePurchaseWithWaas } from './util/executePurchaseWithWaas';

export interface FallbackPurchaseUIProps {
	chainId: number;
	steps: Step[];
	onSuccess: (hash: Hex) => void;
}

export const FallbackPurchaseUI = ({
	chainId,
	steps,
	onSuccess,
}: FallbackPurchaseUIProps) => {
	const [isExecuting, setIsExecuting] = useState(false);
	const [isApproving, setIsApproving] = useState(false);
	const [isSwitchingChain, setIsSwitchingChain] = useState(false);
	const { isWaaS } = useConnectorMetadata();

	const buyStep = steps.find((step) => step.id === StepType.buy);
	if (!buyStep) throw new Error('Buy step not found');

	const {
		collectible,
		currencyAddress,
		currency,
		order,
		salePrice,
		isMarket,
		collection,
		isLoading: isLoadingBuyModalData,
	} = useBuyModalData();
	const sdkConfig = useConfig();
	const toast = useToast();

	const { ensureCorrectChainAsync, currentChainId } = useEnsureCorrectChain();
	const isOnCorrectChain = currentChainId === chainId;
	const requiredChainName = getPresentableChainName(chainId);
	const currentChainName = currentChainId
		? getPresentableChainName(currentChainId)
		: 'Unknown';
	const priceAmount = isMarket ? order?.priceAmount : salePrice?.amount;
	const priceCurrencyAddress = isMarket
		? currencyAddress
		: (salePrice?.currencyAddress as Address);

	const { isVisible: feeOptionsVisible, selectedFeeOption } =
		useSelectWaasFeeOptionsStore();
	const isAnyTransactionPending =
		isApproving || isExecuting || isSwitchingChain;

	const { shouldHideActionButton, waasFeeOptionsShown, getActionLabel } =
		useSelectWaasFeeOptions({
			isProcessing: isAnyTransactionPending,
			feeOptionsVisible,
			selectedFeeOption: selectedFeeOption as FeeOption,
		});

	const { data, isLoading: isLoadingBalance } = useHasSufficientBalance({
		chainId,
		value: BigInt(priceAmount || 0),
		tokenAddress: priceCurrencyAddress,
	});

	const hasSufficientBalance = data?.hasSufficientBalance;
	const { sendTransactionAsync } = useSendTransaction();

	const [approvalStep, setApprovalStep] = useState(
		steps.find((step) => step.id === StepType.tokenApproval),
	);

	const { executePurchaseWithWaas } = useExecutePurchaseWithWaas({
		chainId,
		approvalStep,
		priceAmount: priceAmount as string,
	});

	const executeTransaction = async (step: Step) => {
		const data = step.data as Hex;
		const to = step.to as Address;
		const value = BigInt(step.value);

		if (!data || !to) {
			toast({
				title: 'Invalid step',
				variant: 'error',
				description: 'data, to and value are required',
			});
			throw new Error(`Invalid step. data, to and value are required:
				data: ${data}
				to: ${to}
				value: ${value}

				${JSON.stringify(step)}`);
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

		setIsApproving(true);
		try {
			if (isWaaS) {
				selectWaasFeeOptionsStore.send({ type: 'show' });
			}

			await executeTransaction(approvalStep);
			setApprovalStep(undefined);
		} catch (error) {
			console.error('Approval transaction failed:', error);
		} finally {
			setIsApproving(false);
		}
	};

	const executeBuy = async () => {
		setIsExecuting(true);
		try {
			if (isWaaS) {
				selectWaasFeeOptionsStore.send({ type: 'show' });
			}

			const hash = await executeTransaction(buyStep);

			onSuccess(hash);
		} catch (error) {
			console.error('Buy transaction failed:', error);
		} finally {
			setIsExecuting(false);
		}
	};

	const handleSwitchChain = async () => {
		setIsSwitchingChain(true);
		try {
			await ensureCorrectChainAsync(chainId);
		} catch (error) {
			console.error('Chain switch failed:', error);
		} finally {
			setIsSwitchingChain(false);
		}
	};

	const renderPriceUSD = () => {
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

		return `$${priceUSD}`;
	};

	const formattedPrice = formatPrice(
		BigInt(priceAmount || 0),
		currency?.decimals || 0,
	);
	const isFree = formattedPrice === '0';

	const renderCurrencyPrice = () => {
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
		isOnCorrectChain;
	const buttonLabelForWaas = getActionLabel('Buy now');
	const buyButtonLabel =
		!isWaaS && isExecuting
			? isExecuting
				? 'Confirming Purchase...'
				: 'Buy now'
			: buttonLabelForWaas;

	if (isLoadingBuyModalData || isLoadingBalance) {
		return (
			<FallbackPurchaseUISkeleton
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
						containerClassName="h-16 w-16 rounded-lg object-cover"
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
									<NetworkImage chainId={chainId} size="xs" />
									<Text className="font-bold text-md">
										{renderCurrencyPrice()}
									</Text>
								</div>
							</Tooltip>

							{isMarket && (
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

				{!isOnCorrectChain && currentChainId && (
					<div className="rounded-lg border border-orange-400 bg-orange-950 p-3">
						<Text className="text-orange-400 text-sm">
							Wrong network detected. You&apos;re currently on{' '}
							<Text className="font-bold">{currentChainName}</Text>, but this
							transaction requires{' '}
							<Text className="font-bold">{requiredChainName}</Text>.
						</Text>
					</div>
				)}

				{!isOnCorrectChain && (
					<Button
						onClick={handleSwitchChain}
						pending={isSwitchingChain}
						disabled={isAnyTransactionPending}
						variant="primary"
						size="lg"
						label={
							isSwitchingChain
								? 'Switching Network...'
								: `Switch to ${requiredChainName}`
						}
						className="w-full"
					/>
				)}

				{approvalStep && !isWaaS && (
					<Button
						onClick={executeApproval}
						pending={isApproving}
						disabled={!canApprove || isAnyTransactionPending}
						variant="primary"
						size="lg"
						label={'Approve Token'}
						className="w-full"
					/>
				)}

				{!shouldHideActionButton && canBuy && (
					<Button
						onClick={() =>
							isWaaS ? executePurchaseWithWaas(buyStep) : executeBuy()
						}
						pending={isExecuting}
						disabled={!canBuy || isAnyTransactionPending}
						variant="primary"
						size="lg"
						label={buyButtonLabel}
						className="w-full"
					/>
				)}

				{waasFeeOptionsShown && (
					<SelectWaasFeeOptions
						chainId={Number(chainId)}
						onCancel={() => {
							setIsExecuting(false);
						}}
						titleOnConfirm={'Processing purchase...'}
					/>
				)}
			</div>
		</div>
	);
};
