'use client';

import { Button, Text } from '@0xsequence/design-system';
import { useState } from 'react';
import { type Step, StepType } from '../../../../_internal';
import { useBuyModalData } from '../hooks/useBuyModalData';
import { useHasSufficientBalance } from '../hooks/useHasSufficientBalance';
import { useSendTransaction } from 'wagmi';
import { waitForTransactionReceipt } from '../../../../utils/waitForTransactionReceipt';
import { useConfig } from '../../../../hooks';

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

	const { collectible, currencyAddress, currency, order, address } = useBuyModalData();
	const config = useConfig();

	const { data, isLoading: isLoadingBalance } = useHasSufficientBalance({
		chainId,
		value: BigInt(buyStep?.price || 0),
		tokenAddress: currencyAddress,
	});

	const hasSufficientBalance = data?.hasSufficientBalance;

	const { sendTransactionAsync } = useSendTransaction();

	const [approvalStep, setApprovalStep] = useState(steps.find((step) => step.id === StepType.tokenApproval));


	const executeTransaction = async (step: Step) => {
		const data = step.data;
		const to = step.to;
		setIsExecuting(true);
		try {
			const { hash } = await sendTransactionAsync({
				to,
				from: address,
				data,
			});

			await waitForTransactionReceipt({
				txHash: hash,
				chainId,
				sdkConfig: config,
			});

			setApprovalStep(undefined);
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

				{approvalStep && (
					<Button
						onClick={() => executeTransaction(approvalStep)}
						pending={isExecuting}
						disabled={!hasSufficientBalance || isLoadingBalance}
						variant="primary"
						size="lg"
						label={isExecuting ? 'Confirming...' : 'Buy Now'}
						className="w-full"
					/>
				)}

				<Button
					onClick={() => executeTransaction(buyStep)}
					pending={isExecuting}
					disabled={!hasSufficientBalance || isLoadingBalance}
					variant="primary"
					size="lg"
					label={isExecuting ? 'Confirming...' : 'Buy Now'}
					className="w-full"
				/>
			</div>
		</div>
	);
};
