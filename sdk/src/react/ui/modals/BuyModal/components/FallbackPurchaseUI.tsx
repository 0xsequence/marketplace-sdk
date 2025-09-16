'use client';

import { Button, NetworkImage, Text } from '@0xsequence/design-system';
import { useState } from 'react';
import type { Address, Hex } from 'viem';
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

	const executeTransaction = async (step: Step) => {
		const data = step.data as Hex;
		const to = step.to as Address;

		await ensureCorrectChainAsync(chainId);

		const hash = await sendTransactionAsync({
			to,
			data,
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

	const formattedPrice = formatPrice(
		BigInt(priceAmount || 0),
		currency?.decimals || 0,
	);
	const isFree = formattedPrice === '0';

	const isAnyTransactionPending =
		isApproving || isExecuting || isSwitchingChain;
	const canApprove =
		hasSufficientBalance &&
		!isLoadingBalance &&
		!isLoadingBuyModalData &&
		isOnCorrectChain;
	const canBuy =
		hasSufficientBalance &&
		!isLoadingBalance &&
		!isLoadingBuyModalData &&
		!approvalStep &&
		isOnCorrectChain;

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
							<div className="flex items-center gap-2">
								<NetworkImage chainId={chainId} size="xs" />
								<Text className="font-bold text-md">
									{isFree ? 'Free' : formattedPrice}{' '}
									{isFree ? '' : currency?.symbol}
								</Text>
							</div>
							{isMarket && (
								<Text className="font-bold text-text-50 text-xs">
									${order?.priceUSDFormatted || order?.priceUSD}
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

				{approvalStep && (
					<Button
						onClick={executeApproval}
						pending={isApproving}
						disabled={!canApprove || isAnyTransactionPending}
						variant="primary"
						size="lg"
						label={isApproving ? 'Confirming Approval...' : 'Approve Token'}
						className="w-full"
					/>
				)}

				<Button
					onClick={executeBuy}
					pending={isExecuting}
					disabled={!canBuy || isAnyTransactionPending}
					variant="primary"
					size="lg"
					label={isExecuting ? 'Confirming Purchase...' : 'Buy Now'}
					className="w-full"
				/>
			</div>
		</div>
	);
};
