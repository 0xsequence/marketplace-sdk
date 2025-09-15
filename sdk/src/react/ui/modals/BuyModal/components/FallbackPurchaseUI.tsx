'use client';

import { Button, Text } from '@0xsequence/design-system';
import { useState } from 'react';
import type { Address, Hex } from 'viem';
import { useSendTransaction } from 'wagmi';
import { type Step, StepType } from '../../../../_internal';
import { useConfig } from '../../../../hooks';
import { waitForTransactionReceipt } from '../../../../utils/waitForTransactionReceipt';
import { useBuyModalData } from '../hooks/useBuyModalData';
import { useHasSufficientBalance } from '../hooks/useHasSufficientBalance';

export interface FallbackPurchaseUIProps {
	chainId: number;
	steps: Step[];
}

export const FallbackPurchaseUI = ({
	chainId,
	steps,
}: FallbackPurchaseUIProps) => {
	const [isExecuting, setIsExecuting] = useState(false);
	const buyStep = steps.find((step) => step.id === StepType.buy);
	if (!buyStep) throw new Error('Buy step not found');

	const { collectible, currencyAddress, currency, order } = useBuyModalData();
	const sdkConfig = useConfig();

	const { data, isLoading: isLoadingBalance } = useHasSufficientBalance({
		chainId,
		value: BigInt(buyStep?.price || 0),
		tokenAddress: currencyAddress,
	});

	const hasSufficientBalance = data?.hasSufficientBalance;

	const { sendTransactionAsync } = useSendTransaction();

	const [approvalStep, setApprovalStep] = useState(
		steps.find((step) => step.id === StepType.tokenApproval),
	);

	const executeApproval = async () => {};

	const executeTransaction = async (step: Step) => {
		const data = step.data as Hex;
		const to = step.to as Address;

		setIsExecuting(true);
		try {
			const hash = await sendTransactionAsync({
				to,
				data,
			});

			await waitForTransactionReceipt({
				txHash: hash,
				chainId,
				sdkConfig,
			});

			if (step.id === StepType.tokenApproval) {
				setApprovalStep(undefined);
			}
		} catch (error) {
			console.error('Transaction failed:', error);
		} finally {
			setIsExecuting(false);
		}
	};

	return (
		<div className="flex w-full flex-col">
			<div className="flex flex-col gap-4 p-4">
				<div className="flex items-start gap-4">
					<img
						src={collectible?.image}
						alt={collectible?.name}
						className="h-16 w-16 rounded-lg object-cover"
					/>
					<div className="flex flex-col">
						<div className="flex flex-col">
							<Text className="font-bold text-lg">
								{collectible?.name} #{collectible?.tokenId}
							</Text>
						</div>

						<div className="mt-2">
							<Text className="font-bold text-2xl">
								{buyStep?.price} {currency?.symbol}
							</Text>
							<Text className="text-text-50">${order?.priceUSDFormatted}</Text>
						</div>
					</div>
				</div>

				{!hasSufficientBalance && (
					<Text className="text-text-50">
						You do not have enough {currency?.name} to purchase this item
					</Text>
				)}

				{approvalStep && (
					<Button
						onClick={() => executeTransaction(approvalStep)}
						pending={isExecuting}
						disabled={!hasSufficientBalance || isLoadingBalance}
						variant="primary"
						size="lg"
						label={isExecuting ? 'Confirming...' : 'Approve Token'}
						className="w-full"
					/>
				)}

				<Button
					onClick={() => executeTransaction(buyStep)}
					pending={isExecuting}
					disabled={!hasSufficientBalance || isLoadingBalance || !approvalStep}
					variant="primary"
					size="lg"
					label={isExecuting ? 'Confirming...' : 'Buy Now'}
					className="w-full"
				/>
			</div>
		</div>
	);
};
